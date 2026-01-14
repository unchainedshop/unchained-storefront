/**
 * Nesting Rules Utility
 * Validates and controls which blocks can be nested where
 */

import type { BlockType, PageBlock, NestingConfig } from '../types';
import { blockRegistry, getBlockDefinition } from './blockRegistry';

export interface NestingValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Check if a block type can be nested inside a specific parent block type
 */
export const canNestInParent = (
  childType: BlockType,
  parentType: BlockType | null
): NestingValidationResult => {
  const childDef = getBlockDefinition(childType);
  if (!childDef) {
    return { valid: false, reason: `Unknown block type: ${childType}` };
  }

  // If no parent (root level), check if block can exist at root
  if (parentType === null) {
    // All blocks can exist at root level
    return { valid: true };
  }

  const parentDef = getBlockDefinition(parentType);
  if (!parentDef) {
    return { valid: false, reason: `Unknown parent type: ${parentType}` };
  }

  // Parent must allow children
  if (!parentDef.allowChildren) {
    return { valid: false, reason: `${parentDef.label} cannot contain child blocks` };
  }

  const childNesting = childDef.nesting;
  const parentNesting = parentDef.nesting;

  // Check if child can be nested at all
  if (childNesting && !childNesting.canBeNested) {
    return { valid: false, reason: `${childDef.label} can only be used at root level` };
  }

  // Check if child has forbidden parents
  if (childNesting?.forbiddenParents?.includes(parentType)) {
    return { valid: false, reason: `${childDef.label} cannot be placed inside ${parentDef.label}` };
  }

  // Check if child has specific allowed parents
  if (childNesting?.allowedParents && childNesting.allowedParents.length > 0) {
    if (!childNesting.allowedParents.includes(parentType)) {
      return {
        valid: false,
        reason: `${childDef.label} can only be placed inside: ${childNesting.allowedParents
          .map((t) => getBlockDefinition(t)?.label || t)
          .join(', ')}`,
      };
    }
  }

  // Check if parent has specific allowed children
  if (parentNesting?.allowedChildren && parentNesting.allowedChildren.length > 0) {
    if (!parentNesting.allowedChildren.includes(childType)) {
      return {
        valid: false,
        reason: `${parentDef.label} can only contain: ${parentNesting.allowedChildren
          .map((t) => getBlockDefinition(t)?.label || t)
          .join(', ')}`,
      };
    }
  }

  return { valid: true };
};

/**
 * Get all block types that can be nested inside a specific parent
 */
export const getAvailableBlocksForParent = (parentType: BlockType | null): BlockType[] => {
  const allBlockTypes = Object.keys(blockRegistry) as BlockType[];

  return allBlockTypes.filter((blockType) => {
    const result = canNestInParent(blockType, parentType);
    return result.valid;
  });
};

/**
 * Get all block types that cannot be nested (root-level only)
 */
export const getRootOnlyBlocks = (): BlockType[] => {
  return (Object.keys(blockRegistry) as BlockType[]).filter((blockType) => {
    const def = getBlockDefinition(blockType);
    return def?.nesting?.canBeNested === false;
  });
};

/**
 * Get all container block types (blocks that can have children)
 */
export const getContainerBlocks = (): BlockType[] => {
  return (Object.keys(blockRegistry) as BlockType[]).filter((blockType) => {
    const def = getBlockDefinition(blockType);
    return def?.allowChildren === true;
  });
};

/**
 * Check if a block can be moved to a new position
 */
export const canMoveBlock = (
  block: PageBlock,
  targetParentType: BlockType | null,
  position: 'before' | 'after' | 'inside'
): NestingValidationResult => {
  // If position is before/after, we're at the same level as target, not inside
  if (position !== 'inside') {
    // Moving alongside another block - check if we can exist at that level
    // For root level drops (targetParentType === null), all blocks are valid
    return { valid: true };
  }

  // Position is 'inside' - check if block can nest in target
  return canNestInParent(block.type, targetParentType);
};

/**
 * Validate an entire block tree for nesting violations
 */
export const validateBlockTree = (
  blocks: PageBlock[],
  parentType: BlockType | null = null
): NestingValidationResult[] => {
  const violations: NestingValidationResult[] = [];

  for (const block of blocks) {
    const result = canNestInParent(block.type, parentType);
    if (!result.valid) {
      violations.push({
        valid: false,
        reason: `Block "${block.id}" (${block.type}): ${result.reason}`,
      });
    }

    // Recursively validate children
    if (block.children && block.children.length > 0) {
      const childViolations = validateBlockTree(block.children, block.type);
      violations.push(...childViolations);
    }
  }

  return violations;
};

/**
 * Get a human-readable description of where a block can be placed
 */
export const getNestingDescription = (blockType: BlockType): string => {
  const def = getBlockDefinition(blockType);
  if (!def) return 'Unknown block type';

  const nesting = def.nesting;
  if (!nesting) return 'Can be placed anywhere';

  if (!nesting.canBeNested) {
    return 'Root level only';
  }

  if (nesting.allowedParents && nesting.allowedParents.length > 0) {
    const parentNames = nesting.allowedParents
      .map((t) => getBlockDefinition(t)?.label || t)
      .join(', ');
    return `Can be placed inside: ${parentNames}`;
  }

  if (nesting.forbiddenParents && nesting.forbiddenParents.length > 0) {
    const forbiddenNames = nesting.forbiddenParents
      .map((t) => getBlockDefinition(t)?.label || t)
      .join(', ');
    return `Cannot be placed inside: ${forbiddenNames}`;
  }

  return 'Can be placed in any container';
};
