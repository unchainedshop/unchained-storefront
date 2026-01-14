/**
 * Canvas Component
 * Main editing canvas where blocks are rendered and edited
 * Uses @dnd-kit for smooth drag and drop
 */

import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { usePageBuilder } from "../../context/PageBuilderContext";
import { useDragDrop, type DragData } from "../../hooks/useDragDrop";
import BlockWrapper from "./BlockWrapper";
import BlockRenderer from "../Blocks/BlockRenderer";
import AddBlockButton from "../AddBlockButton";
import BlockPickerModal from "../BlockPickerModal";
import { createBlock, blockRegistry } from "../../utils/blockRegistry";
import type { PageBlock, BlockType } from "../../types";
import { VIEWPORT_WIDTHS } from "../../types";

interface CanvasProps {
  className?: string;
}

// Drag overlay component - shows a preview of the block being dragged
const BlockDragOverlay: React.FC<{ block: PageBlock | null }> = ({ block }) => {
  if (!block) return null;

  const blockDef = blockRegistry[block.type];

  return (
    <div className="flex items-center gap-2 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl px-4 py-2 cursor-grabbing">
      <div className="w-6 h-6 rounded-lg rainbow-gradient flex items-center justify-center">
        <span className="text-slate-700 text-sm">
          {blockDef?.icon === "rectangle-group" && "▢"}
          {blockDef?.icon === "view-columns" && "⫼"}
          {blockDef?.icon === "photo" && "🖼"}
          {blockDef?.icon === "document-text" && "📄"}
          {![
            "rectangle-group",
            "view-columns",
            "photo",
            "document-text",
          ].includes(blockDef?.icon || "") && "◆"}
        </span>
      </div>
      <span className="text-sm font-medium text-white">
        {blockDef?.label || block.type}
      </span>
    </div>
  );
};

const Canvas: React.FC<CanvasProps> = ({ className }) => {
  const { state, selectBlock, addBlock, updateBlock } = usePageBuilder();
  const {
    activeId,
    activeData,
    overId,
    overPosition,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    isDragging,
  } = useDragDrop();

  const [isBlockPickerOpen, setIsBlockPickerOpen] = useState(false);
  const [insertPosition, setInsertPosition] = useState<number | null>(null);

  const { page, viewport, zoom, showGrid, showOutlines, isPreviewMode } = state;

  // Configure sensors for better drag experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts - prevents accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Measuring configuration for better drop detection
  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  const handleCanvasClick = useCallback(() => {
    selectBlock(null);
  }, [selectBlock]);

  const handleOpenBlockPicker = useCallback(
    (position: number | null = null) => {
      setInsertPosition(position);
      setIsBlockPickerOpen(true);
    },
    [],
  );

  const handleSelectBlock = useCallback(
    (
      blockType: BlockType,
      overrides?: {
        content?: Record<string, any>;
        style?: Record<string, any>;
      },
    ) => {
      const newBlock = createBlock(blockType, overrides) as PageBlock;
      addBlock(newBlock, undefined, insertPosition ?? undefined);
      setIsBlockPickerOpen(false);
      setInsertPosition(null);
    },
    [addBlock, insertPosition],
  );

  // Get the currently dragged block for the overlay
  const activeBlock = useMemo(() => {
    if (!activeData || activeData.type !== "existing" || !activeData.blockId) {
      return null;
    }
    const findBlock = (blocks: PageBlock[]): PageBlock | null => {
      for (const block of blocks) {
        if (block.id === activeData.blockId) return block;
        if (block.children) {
          const found = findBlock(block.children);
          if (found) return found;
        }
      }
      return null;
    };
    return page ? findBlock(page.blocks) : null;
  }, [activeData, page]);

  // Get all block IDs for SortableContext
  const blockIds = useMemo(() => {
    const ids: string[] = [];
    const collectIds = (blocks: PageBlock[]) => {
      for (const block of blocks) {
        ids.push(block.id);
        if (block.children) {
          collectIds(block.children);
        }
      }
    };
    if (page) {
      collectIds(page.blocks);
    }
    return ids;
  }, [page]);

  // Get viewport width - desktop-xl uses full width
  const viewportWidth =
    viewport === "desktop-xl" ? "100%" : VIEWPORT_WIDTHS[viewport];

  const renderBlocks = (blocks: PageBlock[], parentId?: string) => {
    return blocks.map((block, index) => {
      const isBlockSelected = state.selection.blockId === block.id;
      const previousBlockId = index > 0 ? blocks[index - 1].id : undefined;
      const nextBlockId =
        index < blocks.length - 1 ? blocks[index + 1].id : undefined;

      const handleBlockUpdate = (updates: Partial<PageBlock>) => {
        updateBlock(block.id, updates);
      };

      return (
        <React.Fragment key={block.id}>
          {/* Add block button between blocks */}
          {index === 0 && !isPreviewMode && (
            <AddBlockButton
              position="between"
              onClick={() => handleOpenBlockPicker(0)}
            />
          )}
          <BlockWrapper
            block={block}
            parentId={parentId}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
            isDraggingAny={isDragging}
            isOver={overId === block.id}
            overPosition={overId === block.id ? overPosition : null}
            previousBlockId={previousBlockId}
            nextBlockId={nextBlockId}
          >
            <BlockRenderer
              block={block}
              isSelected={isBlockSelected}
              onUpdate={handleBlockUpdate}
            >
              {block.children && block.children.length > 0 && (
                <div className="min-h-[100px]">
                  {renderBlocks(block.children, block.id)}
                </div>
              )}
            </BlockRenderer>
          </BlockWrapper>
          {/* Add block button after each block */}
          {!isPreviewMode && (
            <AddBlockButton
              position="between"
              onClick={() => handleOpenBlockPicker(index + 1)}
            />
          )}
        </React.Fragment>
      );
    });
  };

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
        <p className="text-slate-500 dark:text-slate-400">No page loaded</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={measuringConfig}
    >
      <div
        className={classNames(
          "flex-1 overflow-auto",
          isPreviewMode
            ? "bg-white dark:bg-slate-900"
            : "bg-slate-100 dark:bg-slate-800 p-8",
          className,
        )}
        onClick={handleCanvasClick}
      >
        {/* Canvas frame */}
        <div
          className={classNames(
            "transition-all duration-200",
            isPreviewMode ? "w-full h-full" : "mx-auto",
          )}
          style={
            isPreviewMode
              ? {}
              : {
                  width: viewportWidth,
                  maxWidth: "100%",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                }
          }
        >
          {/* Page container */}
          <div
            className={classNames(
              "min-h-screen bg-white dark:bg-slate-900 overflow-hidden",
              {
                "shadow-xl rounded-lg": !isPreviewMode,
                "bg-grid-pattern": showGrid && !isPreviewMode,
              },
            )}
          >
            {/* Blocks */}
            {page.blocks.length > 0 ? (
              <SortableContext
                items={blockIds}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className={classNames({
                    "[&>*]:outline [&>*]:outline-1 [&>*]:outline-dashed [&>*]:outline-slate-300":
                      showOutlines && !isPreviewMode,
                  })}
                >
                  {renderBlocks(page.blocks)}
                </div>
              </SortableContext>
            ) : (
              /* Empty state - click to add first block */
              !isPreviewMode && (
                <div className="min-h-[400px] flex items-center justify-center p-8 m-8">
                  <AddBlockButton
                    position="center"
                    onClick={() => handleOpenBlockPicker(0)}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Block Picker Modal */}
        <BlockPickerModal
          isOpen={isBlockPickerOpen}
          onClose={() => {
            setIsBlockPickerOpen(false);
            setInsertPosition(null);
          }}
          onSelectBlock={handleSelectBlock}
        />
      </div>

      {/* Drag Overlay - shows smooth preview during drag */}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeId ? <BlockDragOverlay block={activeBlock} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Canvas;
