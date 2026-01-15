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
import Header from "../../../layout/components/Header";
import Footer from "../../../layout/components/Footer";

interface CanvasProps {
  className?: string;
}

// Block icon mapping
const getBlockIcon = (icon?: string) => {
  switch (icon) {
    case "rectangle-group":
      return "▢";
    case "view-columns":
      return "⫼";
    case "photo":
      return "🖼";
    case "document-text":
      return "📄";
    case "shopping-bag":
      return "🛍";
    case "squares-2x2":
      return "⊞";
    case "sparkles":
      return "✨";
    case "video-camera":
      return "🎬";
    default:
      return "◆";
  }
};

// Drag overlay component - shows a preview of the block being dragged
const BlockDragOverlay: React.FC<{ block: PageBlock | null }> = ({ block }) => {
  if (!block) return null;

  const blockDef = blockRegistry[block.type];

  return (
    <div className="drag-overlay flex items-center gap-3 rounded-xl px-4 py-3 cursor-grabbing">
      <div className="w-8 h-8 rounded-lg rainbow-gradient flex items-center justify-center shadow-inner">
        <span className="text-slate-700 text-base">
          {getBlockIcon(blockDef?.icon)}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">
          {blockDef?.label || block.type}
        </span>
        <span className="text-[10px] text-slate-400">Drag to reorder</span>
      </div>
    </div>
  );
};

// Animated switch toggle component
const SiteFrameToggle: React.FC<{
  position: "top" | "bottom";
  isActive: boolean;
  onClick: () => void;
}> = ({ position, isActive, onClick }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={classNames(
      "group flex items-center justify-center gap-3 w-full py-2.5 text-xs font-medium transition-all",
      position === "top" ? "rounded-t-lg" : "rounded-b-lg",
      "bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
    )}
  >
    {/* Toggle switch */}
    <div
      className={classNames(
        "relative w-9 h-5 rounded-full transition-colors duration-200",
        isActive
          ? "bg-slate-700 dark:bg-slate-300"
          : "bg-slate-300 dark:bg-slate-600",
      )}
    >
      <div
        className={classNames(
          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
          isActive ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </div>
    <span className="min-w-[60px] text-left">
      {position === "top" ? "Header" : "Footer"}
    </span>
  </button>
);

// Wrapper for Header in canvas - makes it non-sticky and non-interactive
const CanvasHeader: React.FC = () => (
  <div className="relative [&_header]:!static [&_header]:!z-auto pointer-events-none opacity-60">
    <Header onSidebarToggle={() => {}} hasHeroSection={false} />
    <div className="absolute inset-0 bg-transparent" />
  </div>
);

// Wrapper for Footer in canvas - makes it non-interactive
const CanvasFooter: React.FC = () => (
  <div className="relative pointer-events-none opacity-60 [&_footer]:!my-0">
    <Footer />
    <div className="absolute inset-0 bg-transparent" />
  </div>
);

const Canvas: React.FC<CanvasProps> = ({ className }) => {
  const { state, selectBlock, addBlock, updateBlock, toggleSiteFrame } =
    usePageBuilder();
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

  const {
    page,
    viewport,
    zoom,
    showGrid,
    showOutlines,
    showSiteFrame,
    isPreviewMode,
  } = state;

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
        <BlockWrapper
          key={block.id}
          block={block}
          parentId={parentId}
          isFirst={index === 0}
          isLast={index === blocks.length - 1}
          isDraggingAny={isDragging}
          isOver={overId === block.id}
          overPosition={overId === block.id ? overPosition : null}
          previousBlockId={previousBlockId}
          nextBlockId={nextBlockId}
          onAddAfter={
            !isPreviewMode ? () => handleOpenBlockPicker(index + 1) : undefined
          }
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
          {/* Header toggle */}
          {!isPreviewMode && (
            <SiteFrameToggle
              position="top"
              isActive={showSiteFrame}
              onClick={() => toggleSiteFrame()}
            />
          )}

          {/* Page container */}
          <div
            className={classNames(
              "min-h-screen bg-white dark:bg-slate-900 overflow-hidden",
              {
                "shadow-xl": !isPreviewMode,
                "rounded-lg": !isPreviewMode && !showSiteFrame,
                "bg-grid-pattern": showGrid && !isPreviewMode,
                "canvas-dragging": isDragging,
              },
            )}
          >
            {/* Header preview */}
            {showSiteFrame && <CanvasHeader />}

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

            {/* Footer preview */}
            {showSiteFrame && <CanvasFooter />}
          </div>

          {/* Footer toggle */}
          {!isPreviewMode && (
            <SiteFrameToggle
              position="bottom"
              isActive={showSiteFrame}
              onClick={() => toggleSiteFrame()}
            />
          )}
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
