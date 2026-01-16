/**
 * Canvas Component
 * Main editing canvas where blocks are rendered and edited
 * Uses @dnd-kit for smooth drag and drop
 */

import React, { useCallback, useMemo, useState, useRef } from "react";
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
import { PlusIcon } from "@heroicons/react/24/outline";
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

// Floating Add Button - single instance, fixed in viewport at nearest gap
interface FloatingAddButtonProps {
  position: { top: number; left: number; width: number } | null;
  onClick: () => void;
  visible: boolean;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  position,
  onClick,
  visible,
}) => {
  if (!position || !visible) return null;

  return (
    <div
      className="fixed z-[9999] transition-all duration-150 ease-out"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="relative h-0 flex items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="group absolute top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer h-8 w-full transition-all duration-200"
        >
          {/* Line with gradient */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent dark:via-slate-600/80" />

          {/* Rainbow glow behind button */}
          <div
            className="absolute w-10 h-10 rounded-full opacity-40 blur-md animate-pulse"
            style={{
              background:
                "conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd, #ff6b6b)",
            }}
          />

          {/* Button */}
          <div className="relative w-6 h-6 rounded-full bg-slate-700 dark:bg-slate-300 flex items-center justify-center shadow-lg hover:scale-110 transition-all">
            <PlusIcon className="w-3.5 h-3.5 text-white dark:text-slate-800" />
          </div>
        </button>
      </div>
    </div>
  );
};

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
    <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-slate-800 dark:bg-slate-200 shadow-lg cursor-grabbing">
      <div className="w-6 h-6 rounded bg-slate-700 dark:bg-slate-300 flex items-center justify-center">
        <span className="text-slate-300 dark:text-slate-600 text-xs">
          {getBlockIcon(blockDef?.icon)}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-medium text-white dark:text-slate-800">
          {blockDef?.label || block.type}
        </span>
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
  <div
    className={classNames(
      "h-6 flex items-center",
      position === "top" ? "justify-end pr-3" : "justify-end pr-3",
    )}
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={classNames(
        "group flex items-center gap-1.5 text-[10px] font-medium transition-colors",
        "text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400",
      )}
    >
      {/* Toggle switch */}
      <div
        className={classNames(
          "relative w-6 h-3.5 rounded-full transition-colors duration-150",
          isActive
            ? "bg-slate-500 dark:bg-slate-400"
            : "bg-slate-200 dark:bg-slate-700",
        )}
      >
        <div
          className={classNames(
            "absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out",
            isActive ? "translate-x-3" : "translate-x-0.5",
          )}
        />
      </div>
      <span>{position === "top" ? "Header" : "Footer"}</span>
    </button>
  </div>
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
  const [insertParentId, setInsertParentId] = useState<string | null>(null);

  // Floating add button state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [floatingButtonPos, setFloatingButtonPos] = useState<{
    top: number;
    left: number;
    width: number;
    insertIndex: number;
  } | null>(null);
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false);
  const blockRefsMap = useRef<Map<string, HTMLElement>>(new Map());

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

  // Track mouse movement to position floating add button
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPreviewMode || isDragging || !page || page.blocks.length === 0) {
        setFloatingButtonPos(null);
        return;
      }

      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      // Get all block wrapper elements
      const blockWrappers = canvasEl.querySelectorAll("[data-block-id]");
      if (blockWrappers.length === 0) {
        setFloatingButtonPos(null);
        return;
      }

      const mouseY = e.clientY;
      const mouseX = e.clientX;
      let nearestGap: {
        y: number;
        insertIndex: number;
        rect: DOMRect;
      } | null = null;
      let minDistance = Infinity;
      const THRESHOLD = 80; // Distance in px to trigger the button

      // Calculate gaps between blocks
      const wrapperRects: { rect: DOMRect; index: number }[] = [];
      let topLevelIndex = 0;
      blockWrappers.forEach((wrapper) => {
        // Only consider top-level blocks (parent is not a block)
        const parentBlock = wrapper.parentElement?.closest("[data-block-id]");
        if (!parentBlock) {
          wrapperRects.push({
            rect: wrapper.getBoundingClientRect(),
            index: topLevelIndex++,
          });
        }
      });

      // Sort by top position
      wrapperRects.sort((a, b) => a.rect.top - b.rect.top);

      // Only show if mouse is horizontally within a block's bounds
      const isWithinBlockBounds = wrapperRects.some(
        ({ rect }) => mouseX >= rect.left && mouseX <= rect.right,
      );
      if (!isWithinBlockBounds) {
        setFloatingButtonPos(null);
        return;
      }

      // Check gap before first block
      if (wrapperRects.length > 0) {
        const firstRect = wrapperRects[0].rect;
        const gapY = firstRect.top;
        const distance = Math.abs(mouseY - gapY);
        if (distance < minDistance && distance < THRESHOLD) {
          minDistance = distance;
          nearestGap = { y: gapY, insertIndex: 0, rect: firstRect };
        }
      }

      // Check gaps between blocks and after last block
      for (let i = 0; i < wrapperRects.length; i++) {
        const currentRect = wrapperRects[i].rect;
        const gapY = currentRect.bottom;
        const distance = Math.abs(mouseY - gapY);
        if (distance < minDistance && distance < THRESHOLD) {
          minDistance = distance;
          nearestGap = { y: gapY, insertIndex: i + 1, rect: currentRect };
        }
      }

      if (nearestGap) {
        setFloatingButtonPos({
          top: nearestGap.y,
          left: nearestGap.rect.left,
          width: nearestGap.rect.width,
          insertIndex: nearestGap.insertIndex,
        });
      } else {
        setFloatingButtonPos(null);
      }
    },
    [isPreviewMode, isDragging, page],
  );

  const handleCanvasMouseLeave = useCallback(() => {
    setIsMouseInCanvas(false);
    setFloatingButtonPos(null);
  }, []);

  const handleCanvasMouseEnter = useCallback(() => {
    setIsMouseInCanvas(true);
  }, []);

  const handleFloatingButtonClick = useCallback(() => {
    if (floatingButtonPos) {
      setInsertPosition(floatingButtonPos.insertIndex);
      setInsertParentId(null);
      setIsBlockPickerOpen(true);
    }
  }, [floatingButtonPos]);

  const handleOpenBlockPicker = useCallback(
    (position: number | null = null, parentId: string | null = null) => {
      setInsertPosition(position);
      setInsertParentId(parentId);
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
      addBlock(
        newBlock,
        insertParentId ?? undefined,
        insertPosition ?? undefined,
      );
      setIsBlockPickerOpen(false);
      setInsertPosition(null);
      setInsertParentId(null);
    },
    [addBlock, insertPosition, insertParentId],
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

  const renderBlocks = (
    blocks: PageBlock[],
    parentId?: string,
    parentType?: string,
  ) => {
    // Don't show add button for grid children - grid has its own overlay
    const isGridChild = parentType === "grid";

    // Filter hidden blocks in preview mode
    const visibleBlocks = isPreviewMode
      ? blocks.filter((b) => !b.hidden)
      : blocks;

    return visibleBlocks.map((block, index) => {
      const isBlockSelected = state.selection.blockId === block.id;
      const previousBlockId =
        index > 0 ? visibleBlocks[index - 1].id : undefined;
      const nextBlockId =
        index < visibleBlocks.length - 1
          ? visibleBlocks[index + 1].id
          : undefined;

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
          isGridChild={isGridChild}
        >
          <BlockRenderer
            block={block}
            isSelected={isBlockSelected}
            onUpdate={handleBlockUpdate}
          >
            {block.children && block.children.length > 0 ? (
              // Grid blocks need children passed directly (no wrapper) for CSS Grid to work
              block.type === "grid" ? (
                renderBlocks(block.children, block.id, block.type)
              ) : (
                <div className="min-h-[100px]">
                  {renderBlocks(block.children, block.id, block.type)}
                </div>
              )
            ) : blockRegistry[block.type]?.allowChildren &&
              !isPreviewMode &&
              // Don't show AddBlockButton for Grid - it has its own overlay
              block.type !== "grid" ? (
              <div className="min-h-[100px] flex items-center justify-center m-4">
                <AddBlockButton
                  position="center"
                  onClick={() => handleOpenBlockPicker(0, block.id)}
                />
              </div>
            ) : null}
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
        ref={canvasRef}
        className={classNames(
          "flex-1 overflow-auto",
          isPreviewMode
            ? "bg-white dark:bg-slate-900"
            : "bg-slate-100 dark:bg-slate-800 p-8",
          className,
        )}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
        onMouseEnter={handleCanvasMouseEnter}
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
            className={classNames("min-h-screen bg-white dark:bg-slate-900", {
              "shadow-xl": !isPreviewMode,
              "rounded-lg": !isPreviewMode && !showSiteFrame,
              "bg-grid-pattern": showGrid && !isPreviewMode,
              "canvas-dragging": isDragging,
              "overflow-hidden": isPreviewMode, // Only clip in preview mode
            })}
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

        {/* Floating Add Button - single instance following mouse */}
        <FloatingAddButton
          position={floatingButtonPos}
          onClick={handleFloatingButtonClick}
          visible={
            isMouseInCanvas &&
            !isDragging &&
            !isPreviewMode &&
            !!floatingButtonPos
          }
        />

        {/* Block Picker Modal */}
        <BlockPickerModal
          isOpen={isBlockPickerOpen}
          onClose={() => {
            setIsBlockPickerOpen(false);
            setInsertPosition(null);
            setInsertParentId(null);
          }}
          onSelectBlock={handleSelectBlock}
          parentBlockType={
            insertParentId
              ? (page?.blocks.find((b) => b.id === insertParentId)
                  ?.type as BlockType) ||
                (page?.blocks
                  .flatMap((b) => b.children || [])
                  .find((b) => b.id === insertParentId)?.type as BlockType)
              : null
          }
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
