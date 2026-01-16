/**
 * Block Wrapper
 * Wraps each block with selection, drag handles, and action toolbar
 * Uses @dnd-kit for smooth drag and drop
 */

import React, { useCallback, useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Bars3Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  LockClosedIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import {
  usePageBuilder,
  isNewlyAddedBlock,
  clearNewlyAddedBlock,
} from "../../context/PageBuilderContext";
import type { PageBlock } from "../../types";
import { blockRegistry } from "../../utils/blockRegistry";
import { useCollaborationContext } from "../../collaboration/CollaborationContext";
import { BlockLockIndicator, BlockSelectionBorder } from "../Collaboration";
import AddBlockButton from "../AddBlockButton";
import type { DragData } from "../../hooks/useDragDrop";

interface BlockWrapperProps {
  block: PageBlock;
  parentId?: string;
  children: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  isDraggingAny?: boolean;
  isOver?: boolean;
  overPosition?: "before" | "after" | "inside" | null;
  previousBlockId?: string;
  nextBlockId?: string;
  isGridChild?: boolean;
  onAddAfter?: () => void;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({
  block,
  parentId,
  children,
  isFirst = false,
  isLast = false,
  isDraggingAny = false,
  isOver = false,
  overPosition = null,
  previousBlockId,
  nextBlockId,
  isGridChild = false,
  onAddAfter,
}) => {
  const {
    state,
    selectBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    setHoveredBlock,
  } = usePageBuilder();
  const { isBlockLocked, setSelectedBlock } = useCollaborationContext();

  // Track entrance animation
  const [isAnimating, setIsAnimating] = useState(() =>
    isNewlyAddedBlock(block.id),
  );

  useEffect(() => {
    if (isAnimating) {
      // Clear the flag after animation completes
      const timer = setTimeout(() => {
        clearNewlyAddedBlock(block.id);
        setIsAnimating(false);
      }, 600); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating, block.id]);

  const isSelected = state.selection.blockId === block.id;
  const isHovered = state.hoveredBlockId === block.id;
  const blockDef = blockRegistry[block.type];
  const isCollaborationLocked = isBlockLocked(block.id);
  // Grid children are not draggable - no sorting support yet
  const isDraggable = !block.locked && !isCollaborationLocked && !isGridChild;

  // Handle mouse enter/leave for hover tracking
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setHoveredBlock(block.id);
    },
    [block.id, setHoveredBlock],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Only clear if this block is currently hovered
      if (state.hoveredBlockId === block.id) {
        setHoveredBlock(null);
      }
    },
    [block.id, state.hoveredBlockId, setHoveredBlock],
  );

  // @dnd-kit sortable setup
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: "existing",
      blockId: block.id,
    } satisfies DragData,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : isSelected ? 10 : isHovered ? 5 : undefined,
  };

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isCollaborationLocked) return;
      selectBlock(block.id, parentId);
      setSelectedBlock(block.id);
    },
    [block.id, parentId, selectBlock, isCollaborationLocked, setSelectedBlock],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm("Delete this block?")) {
        deleteBlock(block.id);
      }
    },
    [block.id, deleteBlock],
  );

  const handleDuplicate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      duplicateBlock(block.id);
    },
    [block.id, duplicateBlock],
  );

  const handleMoveUp = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (previousBlockId) {
        moveBlock(block.id, previousBlockId, "before");
      }
    },
    [block.id, previousBlockId, moveBlock],
  );

  const handleMoveDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (nextBlockId) {
        moveBlock(block.id, nextBlockId, "after");
      }
    },
    [block.id, nextBlockId, moveBlock],
  );

  if (state.isPreviewMode) {
    return <>{children}</>;
  }

  const wrapperContent = (
    <div
      ref={setNodeRef}
      data-block-id={block.id}
      style={{
        ...style,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      {...attributes}
      className={classNames(
        "relative group transition-all duration-200 block-wrapper",
        {
          "opacity-50": block.hidden,
          "cursor-not-allowed": isCollaborationLocked,
          "block-enter": isAnimating,
          "block-dragging": isDragging,
          "drop-target-valid": isOver && !isDragging,
        },
        // Selection/hover outlines
        isSelected && !isCollaborationLocked
          ? "outline outline-2 outline-slate-900 dark:outline-white outline-offset-1"
          : isHovered && !isDragging
            ? "outline outline-2 outline-slate-300 dark:outline-slate-600"
            : "",
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Drop indicator - before */}
      <div
        className={classNames(
          "drop-indicator -top-0.5 z-20",
          isOver && overPosition === "before" && "drop-indicator--active",
        )}
      />

      {/* Combined label + action toolbar - inside component */}
      <div
        className={classNames(
          "absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg px-1.5 py-1 z-[100] pointer-events-auto transition-all duration-200",
          isSelected || isHovered
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 !pointer-events-none",
        )}
      >
        {/* Move up - hidden for grid children */}
        {!isGridChild && (
          <button
            className={classNames("p-1.5 rounded-full transition-colors", {
              "text-slate-600 cursor-not-allowed": isFirst,
              "text-slate-400 hover:text-white hover:bg-slate-700": !isFirst,
            })}
            onClick={handleMoveUp}
            disabled={isFirst}
            title="Move up"
          >
            <ArrowUpIcon className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Move down - hidden for grid children */}
        {!isGridChild && (
          <button
            className={classNames("p-1.5 rounded-full transition-colors", {
              "text-slate-600 cursor-not-allowed": isLast,
              "text-slate-400 hover:text-white hover:bg-slate-700": !isLast,
            })}
            onClick={handleMoveDown}
            disabled={isLast}
            title="Move down"
          >
            <ArrowDownIcon className="w-3.5 h-3.5" />
          </button>
        )}

        {!isGridChild && <div className="w-px h-4 bg-slate-700 mx-0.5" />}

        {/* Center: Drag handle + label (just label for grid children) */}
        {isGridChild ? (
          <span className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-white">
            {block.locked && (
              <LockClosedIcon className="w-3 h-3 text-amber-400" />
            )}
            {block.hidden && (
              <EyeSlashIcon className="w-3 h-3 text-slate-400" />
            )}
            {blockDef?.label || block.type}
          </span>
        ) : (
          <button
            ref={setActivatorNodeRef}
            {...listeners}
            className={classNames(
              "flex items-center gap-1.5 px-2 py-1 rounded-full touch-none drag-handle",
              isDraggable
                ? "cursor-grab active:cursor-grabbing"
                : "cursor-not-allowed opacity-50",
            )}
            title="Drag to move"
          >
            <Bars3Icon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-white flex items-center gap-1">
              {block.locked && (
                <LockClosedIcon className="w-3 h-3 text-amber-400" />
              )}
              {block.hidden && (
                <EyeSlashIcon className="w-3 h-3 text-slate-400" />
              )}
              {blockDef?.label || block.type}
            </span>
          </button>
        )}

        <div className="w-px h-4 bg-slate-700 mx-0.5" />

        {/* Duplicate */}
        <button
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
          onClick={handleDuplicate}
          title="Duplicate"
        >
          <DocumentDuplicateIcon className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-full transition-colors"
          onClick={handleDelete}
          title="Delete"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Block content */}
      <div
        style={{ flex: 1, minHeight: 0 }}
        className={classNames(
          "w-full flex flex-col [&>*]:flex-1 [&>*]:min-h-0",
          {
            "pointer-events-none": block.locked || isCollaborationLocked,
          },
        )}
      >
        {children}
      </div>

      {/* Add block button - positioned at bottom edge, centered in gap */}
      {onAddAfter && (
        <div
          className={classNames(
            "absolute left-0 right-0 z-[15] transition-opacity duration-300 bottom-0 translate-y-1/2",
            isHovered || isSelected
              ? "opacity-100"
              : "opacity-0 pointer-events-none",
          )}
        >
          <AddBlockButton position="between" onClick={onAddAfter} />
        </div>
      )}

      {/* Collaboration lock indicator */}
      <BlockLockIndicator blockId={block.id} />

      {/* Drop indicator - after */}
      <div
        className={classNames(
          "drop-indicator -bottom-0.5 z-20",
          isOver && overPosition === "after" && "drop-indicator--active",
        )}
      />

      {/* Drop zone - inside (for container blocks) */}
      {blockRegistry[block.type]?.allowChildren &&
        isOver &&
        overPosition === "inside" && <div className="drop-zone-inside z-5" />}
    </div>
  );

  // Wrap with selection border if another collaborator has selected this block
  return (
    <BlockSelectionBorder blockId={block.id}>
      {wrapperContent}
    </BlockSelectionBorder>
  );
};

export default BlockWrapper;
