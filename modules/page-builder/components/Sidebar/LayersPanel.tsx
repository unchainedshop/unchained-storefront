/**
 * Layers Panel
 * Shows the page structure as a draggable tree view
 */

import React, { useState } from "react";
import classNames from "classnames";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import { blockRegistry } from "../../utils/blockRegistry";
import type { PageBlock } from "../../types";

interface LayersPanelProps {
  className?: string;
}

interface SortableLayerItemProps {
  block: PageBlock;
  depth: number;
  parentId?: string;
  isSelected: boolean;
  isOver: boolean;
  onSelect: () => void;
  onToggleHidden: () => void;
  onToggleLocked: () => void;
  children?: React.ReactNode;
}

const SortableLayerItem: React.FC<SortableLayerItemProps> = ({
  block,
  depth,
  isSelected,
  isOver,
  onSelect,
  onToggleHidden,
  onToggleLocked,
  children,
}) => {
  const blockDef = blockRegistry[block.type];
  const hasChildren = block.children && block.children.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { block, depth },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 150ms cubic-bezier(0.25, 1, 0.5, 1)",
  };

  const getBlockColor = () => {
    if (block.type.includes("hero") || block.type.includes("banner"))
      return "bg-slate-600 dark:bg-slate-400";
    if (block.type.includes("product")) return "bg-slate-500 dark:bg-slate-500";
    if (block.type.includes("section") || block.type.includes("column"))
      return "bg-slate-500 dark:bg-slate-500";
    if (block.type.includes("newsletter") || block.type.includes("promo"))
      return "bg-slate-400 dark:bg-slate-500";
    return "bg-slate-400 dark:bg-slate-500";
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {/* Drop indicator line */}
      <div
        className={classNames(
          "h-px mx-1.5 transition-all duration-150",
          isOver ? "bg-slate-400 dark:bg-slate-500 opacity-100" : "opacity-0",
        )}
      />

      <div
        {...listeners}
        className={classNames(
          "group flex items-center gap-1 py-1.5 px-1.5 rounded transition-all duration-100 cursor-grab active:cursor-grabbing",
          isDragging && "opacity-30 scale-95",
          isSelected
            ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800"
            : isOver
              ? "bg-slate-100 dark:bg-slate-800"
              : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400",
        )}
        style={{ paddingLeft: `${depth * 10 + 6}px` }}
        onClick={onSelect}
      >
        {/* Drag handle */}
        <span className="w-3.5 h-3.5 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity">
          <Bars2Icon className="w-3 h-3" />
        </span>

        {/* Expand/collapse icon */}
        <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
          {hasChildren ? (
            <ChevronDownIcon className="w-3 h-3" />
          ) : blockDef?.allowChildren ? (
            <ChevronRightIcon className="w-3 h-3 opacity-20" />
          ) : null}
        </span>

        {/* Block type indicator */}
        <span
          className={classNames(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            getBlockColor(),
          )}
        />

        {/* Block name */}
        <span className="flex-1 truncate text-[11px] font-medium">
          {blockDef?.label || block.type}
        </span>

        {/* Quick actions */}
        <div
          className={classNames(
            "flex items-center transition-opacity",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleHidden();
            }}
            className={classNames(
              "p-0.5 rounded transition-colors",
              isSelected
                ? "hover:bg-white/20"
                : "hover:bg-slate-100 dark:hover:bg-slate-700",
            )}
            title={block.hidden ? "Show" : "Hide"}
          >
            {block.hidden ? (
              <EyeSlashIcon
                className={classNames(
                  "w-3 h-3",
                  isSelected
                    ? "text-white/50"
                    : "text-slate-300 dark:text-slate-600",
                )}
              />
            ) : (
              <EyeIcon
                className={classNames(
                  "w-3 h-3",
                  isSelected
                    ? "text-white/70"
                    : "text-slate-400 dark:text-slate-500",
                )}
              />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLocked();
            }}
            className={classNames(
              "p-0.5 rounded transition-colors",
              isSelected
                ? "hover:bg-white/20"
                : "hover:bg-slate-100 dark:hover:bg-slate-700",
            )}
            title={block.locked ? "Unlock" : "Lock"}
          >
            {block.locked ? (
              <LockClosedIcon
                className={classNames(
                  "w-3 h-3",
                  isSelected ? "text-amber-300" : "text-amber-500",
                )}
              />
            ) : (
              <LockOpenIcon
                className={classNames(
                  "w-3 h-3",
                  isSelected
                    ? "text-white/50"
                    : "text-slate-300 dark:text-slate-600",
                )}
              />
            )}
          </button>
        </div>
      </div>

      {/* Children */}
      {children}
    </div>
  );
};

// Drag overlay item - what you see while dragging
const DragOverlayItem: React.FC<{ block: PageBlock }> = ({ block }) => {
  const blockDef = blockRegistry[block.type];

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 dark:bg-slate-200 shadow-lg">
      <Bars2Icon className="w-3 h-3 text-slate-400 dark:text-slate-500" />
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
      <span className="text-[11px] font-medium text-white dark:text-slate-800">
        {blockDef?.label || block.type}
      </span>
    </div>
  );
};

const LayersPanel: React.FC<LayersPanelProps> = ({ className }) => {
  const { state, selectBlock, updateBlock, moveBlock } = usePageBuilder();
  const { page, selection } = state;
  const [activeBlock, setActiveBlock] = useState<PageBlock | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (!page) {
    return (
      <div
        className={classNames(
          "flex items-center justify-center h-full",
          className,
        )}
      >
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          No page loaded
        </p>
      </div>
    );
  }

  const blockIds = page.blocks.map((b) => b.id);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const block = page.blocks.find((b) => b.id === active.id);
    if (block) {
      setActiveBlock(block);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBlock(null);
    setOverId(null);

    if (over && active.id !== over.id) {
      const activeIndex = page.blocks.findIndex((b) => b.id === active.id);
      const overIndex = page.blocks.findIndex((b) => b.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        const position = activeIndex < overIndex ? "after" : "before";
        moveBlock(active.id as string, over.id as string, position);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveBlock(null);
    setOverId(null);
  };

  const renderLayer = (
    block: PageBlock,
    depth: number = 0,
    parentId?: string,
  ) => {
    const isSelected = selection.blockId === block.id;
    const hasChildren = block.children && block.children.length > 0;
    const isOver = overId === block.id;

    return (
      <SortableLayerItem
        key={block.id}
        block={block}
        depth={depth}
        parentId={parentId}
        isSelected={isSelected}
        isOver={isOver}
        onSelect={() => selectBlock(block.id, parentId, true)}
        onToggleHidden={() => updateBlock(block.id, { hidden: !block.hidden })}
        onToggleLocked={() => updateBlock(block.id, { locked: !block.locked })}
      >
        {hasChildren && (
          <div className="ml-2 border-l border-slate-100 dark:border-slate-800">
            {block.children!.map((child) =>
              renderLayer(child, depth + 1, block.id),
            )}
          </div>
        )}
      </SortableLayerItem>
    );
  };

  return (
    <div className={classNames("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Layers
          </h3>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
            {page.blocks.length}
          </span>
        </div>
      </div>

      {/* Tree view */}
      <div className="flex-1 overflow-y-auto p-1.5">
        {page.blocks.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={blockIds}
              strategy={verticalListSortingStrategy}
            >
              {page.blocks.map((block) => renderLayer(block))}
            </SortableContext>

            <DragOverlay
              dropAnimation={{
                duration: 150,
                easing: "cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            >
              {activeBlock ? <DragOverlayItem block={activeBlock} /> : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center py-6">
            No blocks yet
          </div>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
