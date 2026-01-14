/**
 * Drag and Drop Hook
 * Handles drag and drop interactions using @dnd-kit
 */

import { useCallback, useState } from "react";
import {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  usePageBuilder,
  findBlockById,
  findParentBlock,
} from "../context/PageBuilderContext";
import type { BlockType, PageBlock } from "../types";
import { createBlock, getBlockDefinition } from "../utils/blockRegistry";
import { canNestInParent } from "../utils/nestingRules";

export interface DragData {
  type: "existing" | "new";
  blockId?: string;
  blockType?: BlockType;
}

interface UseDragDropReturn {
  activeId: UniqueIdentifier | null;
  activeData: DragData | null;
  overId: UniqueIdentifier | null;
  overPosition: "before" | "after" | "inside" | null;
  isValidDrop: boolean;
  invalidDropReason: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
  isDragging: boolean;
}

export const useDragDrop = (): UseDragDropReturn => {
  const { state, moveBlock, addBlock } = usePageBuilder();

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeData, setActiveData] = useState<DragData | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [overPosition, setOverPosition] = useState<
    "before" | "after" | "inside" | null
  >(null);
  const [isValidDrop, setIsValidDrop] = useState(true);
  const [invalidDropReason, setInvalidDropReason] = useState<string | null>(
    null,
  );

  // Get the block type being dragged
  const getDraggedBlockType = useCallback(
    (data: DragData | null): BlockType | null => {
      if (!data) return null;
      if (data.type === "new" && data.blockType) {
        return data.blockType;
      }
      if (data.type === "existing" && data.blockId && state.page) {
        const block = findBlockById(state.page.blocks, data.blockId);
        return block?.type || null;
      }
      return null;
    },
    [state.page],
  );

  // Validate if a drop is allowed
  const validateDrop = useCallback(
    (
      draggedType: BlockType | null,
      targetId: string | null,
      position: "before" | "after" | "inside" | null,
    ): { valid: boolean; reason: string | null } => {
      if (!draggedType || !targetId || !position) {
        return { valid: true, reason: null };
      }

      if (!state.page) {
        return { valid: true, reason: null };
      }

      const targetBlock = findBlockById(state.page.blocks, targetId);
      if (!targetBlock) {
        return { valid: true, reason: null };
      }

      let parentType: BlockType | null = null;

      if (position === "inside") {
        // Dropping inside the target - target is the parent
        const targetDef = getBlockDefinition(targetBlock.type);
        if (!targetDef?.allowChildren) {
          return {
            valid: false,
            reason: `${targetDef?.label || targetBlock.type} cannot contain children`,
          };
        }
        parentType = targetBlock.type;
      } else {
        // Dropping before/after - find the target's parent
        const parent = findParentBlock(state.page.blocks, targetId);
        parentType = parent?.type || null;
      }

      const validation = canNestInParent(draggedType, parentType);
      return { valid: validation.valid, reason: validation.reason || null };
    },
    [state.page],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as DragData | undefined;

    setActiveId(active.id);
    setActiveData(data || null);
    setIsValidDrop(true);
    setInvalidDropReason(null);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;

      if (!over) {
        setOverId(null);
        setOverPosition(null);
        setIsValidDrop(true);
        setInvalidDropReason(null);
        return;
      }

      // Prevent dropping on self
      if (activeId === over.id) {
        setOverId(null);
        setOverPosition(null);
        setIsValidDrop(false);
        setInvalidDropReason("Cannot drop on self");
        return;
      }

      const overData = over.data.current as
        | { position?: "before" | "after" | "inside"; blockId?: string }
        | undefined;
      const position = overData?.position || "after";
      const targetId = (overData?.blockId || over.id) as string;

      // Validate the drop
      const draggedType = getDraggedBlockType(activeData);
      const validation = validateDrop(draggedType, targetId, position);

      setOverId(over.id);
      setOverPosition(position);
      setIsValidDrop(validation.valid);
      setInvalidDropReason(validation.reason);
    },
    [activeId, activeData, getDraggedBlockType, validateDrop],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        setActiveId(null);
        setActiveData(null);
        setOverId(null);
        setOverPosition(null);
        setIsValidDrop(true);
        setInvalidDropReason(null);
        return;
      }

      const dragData = active.data.current as DragData | undefined;
      const overData = over.data.current as
        | {
            position?: "before" | "after" | "inside";
            blockId?: string;
          }
        | undefined;

      const targetId = (overData?.blockId || over.id) as string;
      const position = overData?.position || "after";

      // Final validation before executing
      const draggedType = getDraggedBlockType(dragData || null);
      const validation = validateDrop(draggedType, targetId, position);

      if (!validation.valid) {
        // Reset state without executing the drop
        setActiveId(null);
        setActiveData(null);
        setOverId(null);
        setOverPosition(null);
        setIsValidDrop(true);
        setInvalidDropReason(null);
        return;
      }

      // Note: addBlock and moveBlock already save history internally

      if (dragData?.type === "new" && dragData.blockType) {
        // Create and add new block
        const newBlock = createBlock(dragData.blockType) as PageBlock;

        if (position === "inside") {
          addBlock(newBlock, targetId);
        } else {
          // Find target's parent to add alongside it
          if (state.page) {
            const parent = findParentBlock(state.page.blocks, targetId);
            addBlock(newBlock, parent?.id);
          } else {
            addBlock(newBlock);
          }
        }
      } else if (dragData?.type === "existing" && dragData.blockId) {
        // Move existing block
        moveBlock(dragData.blockId, targetId, position);
      }

      // Reset state
      setActiveId(null);
      setActiveData(null);
      setOverId(null);
      setOverPosition(null);
      setIsValidDrop(true);
      setInvalidDropReason(null);
    },
    [state.page, moveBlock, addBlock, getDraggedBlockType, validateDrop],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveData(null);
    setOverId(null);
    setOverPosition(null);
    setIsValidDrop(true);
    setInvalidDropReason(null);
  }, []);

  return {
    activeId,
    activeData,
    overId,
    overPosition,
    isValidDrop,
    invalidDropReason,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    isDragging: activeId !== null,
  };
};

export default useDragDrop;
