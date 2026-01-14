/**
 * Block Wrapper
 * Wraps each block with selection, drag handles, and action toolbar
 * Uses @dnd-kit for smooth drag and drop
 */

import React, { useCallback } from "react";
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
import { usePageBuilder } from "../../context/PageBuilderContext";
import type { PageBlock } from "../../types";
import { blockRegistry } from "../../utils/blockRegistry";
import { useCollaborationContext } from "../../collaboration/CollaborationContext";
import { BlockLockIndicator, BlockSelectionBorder } from "../Collaboration";
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
}) => {
  const { state, selectBlock, deleteBlock, duplicateBlock, moveBlock } =
    usePageBuilder();
  const { isBlockLocked, setSelectedBlock } = useCollaborationContext();

  const isSelected = state.selection.blockId === block.id;
  const blockDef = blockRegistry[block.type];
  const isCollaborationLocked = isBlockLocked(block.id);
  const isDraggable = !block.locked && !isCollaborationLocked;

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
    zIndex: isDragging ? 100 : undefined,
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
      style={style}
      {...attributes}
      className={classNames("relative group transition-all duration-200", {
        "rainbow-border": isSelected && !isCollaborationLocked,
        "opacity-50": block.hidden,
        "cursor-not-allowed": isCollaborationLocked,
      })}
      onClick={handleClick}
    >
      {/* Drop indicator - before */}
      <div
        className={classNames(
          "absolute -top-1 left-0 right-0 h-1 z-20 rounded-full transition-all duration-200",
          isOver && overPosition === "before"
            ? "rainbow-gradient scale-y-[3]"
            : isDraggingAny
              ? "hover:bg-pink-300"
              : "",
        )}
      />

      {/* Hover outline */}
      <div
        className={classNames(
          "absolute inset-0 pointer-events-none border-2 border-transparent transition-all duration-200 z-10 rounded-lg",
          {
            "group-hover:border-pink-300 dark:group-hover:border-pink-400/50":
              !isSelected && !state.isPreviewMode && !isDragging,
          },
        )}
      />

      {/* Combined label + action toolbar - inside component */}
      <div
        className={classNames(
          "absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg px-1.5 py-1 z-30 transition-all duration-200",
          isSelected
            ? "opacity-100 scale-100"
            : "opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100",
        )}
      >
        {/* Move up */}
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

        {/* Move down */}
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

        <div className="w-px h-4 bg-slate-700 mx-0.5" />

        {/* Center: Drag handle + label */}
        <button
          ref={setActivatorNodeRef}
          {...listeners}
          className={classNames(
            "flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors touch-none",
            isDraggable
              ? "cursor-grab active:cursor-grabbing hover:bg-slate-700"
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
        className={classNames({
          "pointer-events-none": block.locked || isCollaborationLocked,
        })}
      >
        {children}
      </div>

      {/* Collaboration lock indicator */}
      <BlockLockIndicator blockId={block.id} />

      {/* Drop indicator - after */}
      <div
        className={classNames(
          "absolute -bottom-1 left-0 right-0 h-1 z-20 rounded-full transition-all duration-200",
          isOver && overPosition === "after"
            ? "rainbow-gradient scale-y-[3]"
            : isDraggingAny
              ? "hover:bg-pink-300"
              : "",
        )}
      />

      {/* Drop zone - inside (for container blocks) */}
      {blockRegistry[block.type]?.allowChildren && (
        <div
          className={classNames(
            "absolute inset-4 z-5 transition-all duration-200 rounded-lg pointer-events-none",
            isOver && overPosition === "inside"
              ? "bg-pink-200/30 border-2 border-dashed border-pink-400"
              : "",
          )}
        />
      )}
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
