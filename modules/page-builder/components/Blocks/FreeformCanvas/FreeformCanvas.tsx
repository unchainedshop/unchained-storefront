/**
 * Freeform Canvas Block
 * A design surface where elements can be freely positioned, resized, and styled
 */

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../../context/PageBuilderContext";
import MediaPickerModal from "../../../../media/components/MediaPickerModal";
import type { MediaAsset } from "../../../../media/types";
import type {
  PageBlock,
  FreeformCanvasContent,
  FreeformElement,
  FreeformElementBounds,
  FreeformElementType,
  FreeformTextProps,
  FreeformImageProps,
  FreeformButtonProps,
} from "../../../types";

interface FreeformCanvasProps {
  block: PageBlock;
  isPreview?: boolean;
}

// Generate unique ID for elements
const generateElementId = () =>
  `el_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Default element configurations
const DEFAULT_ELEMENT_CONFIGS: Record<
  FreeformElementType,
  {
    bounds: Partial<FreeformElementBounds>;
    style: FreeformElement["style"];
    props: FreeformElement["props"];
  }
> = {
  rectangle: {
    bounds: { width: 200, height: 150 },
    style: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      border: { width: 2, color: "#3b82f6", style: "solid" },
      borderRadius: 8,
    },
    props: {},
  },
  text: {
    bounds: { width: 250, height: 80 },
    style: { backgroundColor: "transparent" },
    props: {
      content: "Double-click to edit",
      fontSize: 16,
      fontWeight: "normal",
      color: "#1f2937",
      textAlign: "left",
      lineHeight: 1.5,
      padding: 12,
    } as FreeformTextProps,
  },
  image: {
    bounds: { width: 300, height: 200 },
    style: { borderRadius: 8, opacity: 1 },
    props: {
      src: "",
      alt: "Image",
      objectFit: "cover",
    } as FreeformImageProps,
  },
  button: {
    bounds: { width: 160, height: 48 },
    style: { borderRadius: 6 },
    props: {
      label: "Button",
      href: "#",
      variant: "primary",
      backgroundColor: "#3b82f6",
      textColor: "#ffffff",
      fontSize: 14,
      padding: { x: 24, y: 12 },
    } as FreeformButtonProps,
  },
  icon: {
    bounds: { width: 48, height: 48 },
    style: {},
    props: { name: "star", size: 32, color: "#6b7280" },
  },
};

const FreeformCanvas: React.FC<FreeformCanvasProps> = ({
  block,
  isPreview = false,
}) => {
  const { updateBlock } = usePageBuilder();
  const content = block.content as unknown as FreeformCanvasContent;
  const canvasRef = useRef<HTMLDivElement>(null);

  // Local state for editing
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    elementId: string | null;
    startX: number;
    startY: number;
    startBounds: FreeformElementBounds | null;
  }>({
    isDragging: false,
    elementId: null,
    startX: 0,
    startY: 0,
    startBounds: null,
  });

  const [resizeState, setResizeState] = useState<{
    isResizing: boolean;
    elementId: string | null;
    handle: string | null;
    startX: number;
    startY: number;
    startBounds: FreeformElementBounds | null;
  }>({
    isResizing: false,
    elementId: null,
    handle: null,
    startX: 0,
    startY: 0,
    startBounds: null,
  });

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [snapLines, setSnapLines] = useState<{
    vertical: number[];
    horizontal: number[];
  }>({ vertical: [], horizontal: [] });

  // Media picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);

  // Calculate scale for responsive mode
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!content.responsive || !canvasRef.current) return;

    const updateScale = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      const containerWidth = container.clientWidth - 48; // Account for padding
      const newScale = Math.min(1, containerWidth / content.canvasWidth);
      setScale(Math.max(content.minScale || 0.5, newScale));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [content.responsive, content.canvasWidth, content.minScale]);

  // Update block content
  const updateContent = useCallback(
    (updates: Partial<FreeformCanvasContent>) => {
      if (isPreview) return;
      updateBlock(block.id, { content: { ...content, ...updates } });
    },
    [block.id, content, isPreview, updateBlock],
  );

  // Update a single element
  const updateElement = useCallback(
    (elementId: string, updates: Partial<FreeformElement>) => {
      const newElements = content.elements.map((el) =>
        el.id === elementId ? { ...el, ...updates } : el,
      );
      updateContent({ elements: newElements });
    },
    [content.elements, updateContent],
  );

  // Add a new element
  const addElement = useCallback(
    (type: FreeformElementType, position?: { x: number; y: number }) => {
      const config = DEFAULT_ELEMENT_CONFIGS[type];
      const maxZ = Math.max(0, ...content.elements.map((el) => el.zIndex));

      const newElement: FreeformElement = {
        id: generateElementId(),
        type,
        bounds: {
          x: position?.x || 50,
          y: position?.y || 50,
          width: config.bounds.width || 100,
          height: config.bounds.height || 100,
        },
        style: config.style,
        props: config.props,
        zIndex: maxZ + 1,
      };

      updateContent({ elements: [...content.elements, newElement] });
      setSelectedIds([newElement.id]);
    },
    [content.elements, updateContent],
  );

  // Delete selected elements
  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const newElements = content.elements.filter(
      (el) => !selectedIds.includes(el.id),
    );
    updateContent({ elements: newElements });
    setSelectedIds([]);
  }, [content.elements, selectedIds, updateContent]);

  // Handle image click to open media picker
  const handleImageClick = useCallback(
    (elementId: string) => {
      if (isPreview) return;
      setEditingImageId(elementId);
      setIsMediaPickerOpen(true);
    },
    [isPreview],
  );

  // Handle media selection from picker
  const handleMediaSelect = useCallback(
    (asset: MediaAsset) => {
      if (editingImageId) {
        const element = content.elements.find((el) => el.id === editingImageId);
        if (element && element.type === "image") {
          const currentProps = element.props as FreeformImageProps;
          updateElement(editingImageId, {
            props: {
              ...currentProps,
              src: asset.url || "",
              alt: asset.filename || "Image",
            },
          });
        }
      }
      setIsMediaPickerOpen(false);
      setEditingImageId(null);
    },
    [editingImageId, content.elements, updateElement],
  );

  // Calculate snap positions
  const calculateSnapPositions = useCallback(
    (
      movingId: string,
      currentBounds: FreeformElementBounds,
    ): { x: number | null; y: number | null; lines: typeof snapLines } => {
      if (
        !content.snapConfig.snapToElements &&
        !content.snapConfig.snapToCenter
      ) {
        return { x: null, y: null, lines: { vertical: [], horizontal: [] } };
      }

      const threshold = content.snapConfig.threshold;
      const otherElements = content.elements.filter((el) => el.id !== movingId);
      const snapLinesV: number[] = [];
      const snapLinesH: number[] = [];
      let snapX: number | null = null;
      let snapY: number | null = null;

      // Canvas center
      if (content.snapConfig.snapToCenter) {
        const centerX = content.canvasWidth / 2;
        const centerY = content.canvasHeight / 2;

        // Check element center against canvas center
        const elCenterX = currentBounds.x + currentBounds.width / 2;
        const elCenterY = currentBounds.y + currentBounds.height / 2;

        if (Math.abs(elCenterX - centerX) < threshold) {
          snapX = centerX - currentBounds.width / 2;
          snapLinesV.push(centerX);
        }
        if (Math.abs(elCenterY - centerY) < threshold) {
          snapY = centerY - currentBounds.height / 2;
          snapLinesH.push(centerY);
        }
      }

      // Snap to other elements
      if (content.snapConfig.snapToElements) {
        for (const other of otherElements) {
          const otherRight = other.bounds.x + other.bounds.width;
          const otherBottom = other.bounds.y + other.bounds.height;
          const currentRight = currentBounds.x + currentBounds.width;
          const currentBottom = currentBounds.y + currentBounds.height;

          // Vertical alignment (left edge to left/right, right edge to left/right)
          if (Math.abs(currentBounds.x - other.bounds.x) < threshold) {
            snapX = other.bounds.x;
            snapLinesV.push(other.bounds.x);
          } else if (Math.abs(currentBounds.x - otherRight) < threshold) {
            snapX = otherRight;
            snapLinesV.push(otherRight);
          } else if (Math.abs(currentRight - other.bounds.x) < threshold) {
            snapX = other.bounds.x - currentBounds.width;
            snapLinesV.push(other.bounds.x);
          } else if (Math.abs(currentRight - otherRight) < threshold) {
            snapX = otherRight - currentBounds.width;
            snapLinesV.push(otherRight);
          }

          // Horizontal alignment
          if (Math.abs(currentBounds.y - other.bounds.y) < threshold) {
            snapY = other.bounds.y;
            snapLinesH.push(other.bounds.y);
          } else if (Math.abs(currentBounds.y - otherBottom) < threshold) {
            snapY = otherBottom;
            snapLinesH.push(otherBottom);
          } else if (Math.abs(currentBottom - other.bounds.y) < threshold) {
            snapY = other.bounds.y - currentBounds.height;
            snapLinesH.push(other.bounds.y);
          } else if (Math.abs(currentBottom - otherBottom) < threshold) {
            snapY = otherBottom - currentBounds.height;
            snapLinesH.push(otherBottom);
          }
        }
      }

      // Grid snapping
      if (content.snapConfig.snapToGrid && snapX === null) {
        const gridSize = content.snapConfig.gridSize;
        snapX = Math.round(currentBounds.x / gridSize) * gridSize;
      }
      if (content.snapConfig.snapToGrid && snapY === null) {
        const gridSize = content.snapConfig.gridSize;
        snapY = Math.round(currentBounds.y / gridSize) * gridSize;
      }

      return {
        x: snapX,
        y: snapY,
        lines: { vertical: snapLinesV, horizontal: snapLinesH },
      };
    },
    [
      content.elements,
      content.snapConfig,
      content.canvasWidth,
      content.canvasHeight,
    ],
  );

  // Handle mouse down on element (start drag)
  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      if (isPreview) return;
      e.stopPropagation();

      const element = content.elements.find((el) => el.id === elementId);
      if (!element || element.locked) return;

      // Handle selection
      if (e.shiftKey) {
        setSelectedIds((prev) =>
          prev.includes(elementId)
            ? prev.filter((id) => id !== elementId)
            : [...prev, elementId],
        );
      } else if (!selectedIds.includes(elementId)) {
        setSelectedIds([elementId]);
      }

      // Start drag
      setDragState({
        isDragging: true,
        elementId,
        startX: e.clientX,
        startY: e.clientY,
        startBounds: { ...element.bounds },
      });
    },
    [content.elements, isPreview, selectedIds],
  );

  // Handle mouse move (drag or resize)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (
        dragState.isDragging &&
        dragState.elementId &&
        dragState.startBounds
      ) {
        const dx = (e.clientX - dragState.startX) / scale;
        const dy = (e.clientY - dragState.startY) / scale;

        const newBounds = {
          ...dragState.startBounds,
          x: Math.max(
            0,
            Math.min(
              content.canvasWidth - dragState.startBounds.width,
              dragState.startBounds.x + dx,
            ),
          ),
          y: Math.max(
            0,
            Math.min(
              content.canvasHeight - dragState.startBounds.height,
              dragState.startBounds.y + dy,
            ),
          ),
        };

        // Apply snapping
        const snap = calculateSnapPositions(dragState.elementId, newBounds);
        if (snap.x !== null) newBounds.x = snap.x;
        if (snap.y !== null) newBounds.y = snap.y;
        setSnapLines(snap.lines);

        updateElement(dragState.elementId, { bounds: newBounds });
      }

      if (
        resizeState.isResizing &&
        resizeState.elementId &&
        resizeState.startBounds &&
        resizeState.handle
      ) {
        const dx = (e.clientX - resizeState.startX) / scale;
        const dy = (e.clientY - resizeState.startY) / scale;
        const handle = resizeState.handle;
        const start = resizeState.startBounds;

        let newBounds = { ...start };
        const minSize = 40;

        // Handle resize based on which handle is being dragged
        if (handle.includes("e")) {
          newBounds.width = Math.max(minSize, start.width + dx);
        }
        if (handle.includes("w")) {
          const newWidth = Math.max(minSize, start.width - dx);
          newBounds.x = start.x + (start.width - newWidth);
          newBounds.width = newWidth;
        }
        if (handle.includes("s")) {
          newBounds.height = Math.max(minSize, start.height + dy);
        }
        if (handle.includes("n")) {
          const newHeight = Math.max(minSize, start.height - dy);
          newBounds.y = start.y + (start.height - newHeight);
          newBounds.height = newHeight;
        }

        // Constrain to canvas
        newBounds.x = Math.max(
          0,
          Math.min(content.canvasWidth - newBounds.width, newBounds.x),
        );
        newBounds.y = Math.max(
          0,
          Math.min(content.canvasHeight - newBounds.height, newBounds.y),
        );

        updateElement(resizeState.elementId, { bounds: newBounds });
      }
    },
    [
      dragState,
      resizeState,
      scale,
      content.canvasWidth,
      content.canvasHeight,
      calculateSnapPositions,
      updateElement,
    ],
  );

  // Handle mouse up (end drag or resize)
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      elementId: null,
      startX: 0,
      startY: 0,
      startBounds: null,
    });
    setResizeState({
      isResizing: false,
      elementId: null,
      handle: null,
      startX: 0,
      startY: 0,
      startBounds: null,
    });
    setSnapLines({ vertical: [], horizontal: [] });
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, elementId: string, handle: string) => {
      if (isPreview) return;
      e.stopPropagation();

      const element = content.elements.find((el) => el.id === elementId);
      if (!element || element.locked) return;

      setResizeState({
        isResizing: true,
        elementId,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startBounds: { ...element.bounds },
      });
    },
    [content.elements, isPreview],
  );

  // Handle double click (edit text)
  const handleDoubleClick = useCallback(
    (elementId: string) => {
      const element = content.elements.find((el) => el.id === elementId);
      if (element?.type === "text" && !isPreview) {
        setEditingTextId(elementId);
      }
    },
    [content.elements, isPreview],
  );

  // Handle canvas click (deselect)
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIds([]);
      setEditingTextId(null);
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (isPreview) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (editingTextId) return; // Don't delete while editing text
        deleteSelected();
      }
      if (e.key === "Escape") {
        setSelectedIds([]);
        setEditingTextId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, editingTextId, isPreview]);

  // Render element based on type
  const renderElement = useCallback(
    (element: FreeformElement) => {
      const isSelected = selectedIds.includes(element.id);
      const isEditing = editingTextId === element.id;

      const style: React.CSSProperties = {
        position: "absolute",
        left: element.bounds.x,
        top: element.bounds.y,
        width: element.bounds.width,
        height: element.bounds.height,
        transform: element.bounds.rotation
          ? `rotate(${element.bounds.rotation}deg)`
          : undefined,
        zIndex: element.zIndex,
        backgroundColor: element.style.backgroundColor,
        borderRadius: element.style.borderRadius,
        opacity: element.style.opacity ?? 1,
        border: element.style.border
          ? `${element.style.border.width}px ${element.style.border.style} ${element.style.border.color}`
          : undefined,
        boxShadow: element.style.boxShadow
          ? `${element.style.boxShadow.x}px ${element.style.boxShadow.y}px ${element.style.boxShadow.blur}px ${element.style.boxShadow.spread}px ${element.style.boxShadow.color}`
          : undefined,
        backdropFilter: element.style.backdropBlur
          ? `blur(${element.style.backdropBlur}px)`
          : undefined,
        cursor: isPreview ? "default" : element.locked ? "not-allowed" : "move",
        userSelect: "none",
        outline: isSelected && !isPreview ? "2px solid #3b82f6" : undefined,
        outlineOffset: "2px",
      };

      // Apply gradient if specified
      if (element.style.backgroundGradient) {
        const grad = element.style.backgroundGradient;
        const stopsStr = grad.stops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ");
        if (grad.type === "linear") {
          style.background = `linear-gradient(${grad.angle || 135}deg, ${stopsStr})`;
        } else if (grad.type === "radial") {
          style.background = `radial-gradient(circle, ${stopsStr})`;
        }
      }

      let content: React.ReactNode = null;

      switch (element.type) {
        case "text": {
          const props = element.props as FreeformTextProps;
          if (isEditing) {
            content = (
              <textarea
                autoFocus
                className="w-full h-full resize-none border-none outline-none bg-transparent"
                style={{
                  fontSize: props.fontSize,
                  fontWeight: props.fontWeight,
                  color: props.color,
                  textAlign: props.textAlign,
                  lineHeight: props.lineHeight,
                  padding: props.padding,
                }}
                defaultValue={props.content}
                onBlur={(e) => {
                  updateElement(element.id, {
                    props: { ...props, content: e.target.value },
                  });
                  setEditingTextId(null);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            );
          } else {
            content = (
              <div
                className="w-full h-full overflow-hidden"
                style={{
                  fontSize: props.fontSize,
                  fontWeight: props.fontWeight,
                  color: props.color,
                  textAlign: props.textAlign,
                  lineHeight: props.lineHeight,
                  padding: props.padding,
                }}
              >
                {props.content}
              </div>
            );
          }
          break;
        }
        case "image": {
          const props = element.props as FreeformImageProps;
          content = props.src ? (
            <div
              className="w-full h-full relative group"
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(element.id);
              }}
            >
              <img
                src={props.src}
                alt={props.alt || ""}
                className="w-full h-full"
                style={{
                  objectFit: props.objectFit || "cover",
                  objectPosition: props.focalPoint
                    ? `${props.focalPoint.x}% ${props.focalPoint.y}%`
                    : "center",
                  borderRadius: element.style.borderRadius,
                }}
                draggable={false}
              />
              {/* Change image overlay */}
              {!isPreview && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Click to change
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(element.id);
              }}
            >
              <PhotoIcon className="w-8 h-8 mb-2" />
              <span className="text-sm">Click to add image</span>
            </div>
          );
          break;
        }
        case "button": {
          const props = element.props as FreeformButtonProps;
          content = (
            <button
              className="w-full h-full flex items-center justify-center font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: props.backgroundColor,
                color: props.textColor,
                fontSize: props.fontSize,
                borderRadius: element.style.borderRadius,
                padding: props.padding
                  ? `${props.padding.y}px ${props.padding.x}px`
                  : undefined,
              }}
              onClick={(e) => e.preventDefault()}
            >
              {props.label}
            </button>
          );
          break;
        }
        case "rectangle":
        default:
          // Rectangle is just the styled container, no inner content
          break;
      }

      return (
        <div
          key={element.id}
          style={style}
          onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          onDoubleClick={() => handleDoubleClick(element.id)}
        >
          {content}
          {/* Resize handles */}
          {isSelected && !isPreview && !element.locked && (
            <>
              {["n", "ne", "e", "se", "s", "sw", "w", "nw"].map((handle) => (
                <div
                  key={handle}
                  className="absolute bg-white border-2 border-blue-500 rounded-sm"
                  style={{
                    width: 10,
                    height: 10,
                    cursor: `${handle}-resize`,
                    ...(handle.includes("n") && { top: -5 }),
                    ...(handle.includes("s") && { bottom: -5 }),
                    ...(handle.includes("w") && { left: -5 }),
                    ...(handle.includes("e") && { right: -5 }),
                    ...(!handle.includes("n") &&
                      !handle.includes("s") && { top: "50%", marginTop: -5 }),
                    ...(!handle.includes("e") &&
                      !handle.includes("w") && { left: "50%", marginLeft: -5 }),
                  }}
                  onMouseDown={(e) => handleResizeStart(e, element.id, handle)}
                />
              ))}
            </>
          )}
        </div>
      );
    },
    [
      selectedIds,
      editingTextId,
      isPreview,
      handleElementMouseDown,
      handleDoubleClick,
      handleResizeStart,
      handleImageClick,
      updateElement,
    ],
  );

  // Render grid
  const renderGrid = useMemo(() => {
    if (!content.showGrid || isPreview) return null;
    const lines: React.ReactNode[] = [];
    const gridSize = content.gridSize || 20;

    for (let x = gridSize; x < content.canvasWidth; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={content.canvasHeight}
          stroke="#e5e7eb"
          strokeWidth={0.5}
        />,
      );
    }
    for (let y = gridSize; y < content.canvasHeight; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={content.canvasWidth}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth={0.5}
        />,
      );
    }
    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={content.canvasWidth}
        height={content.canvasHeight}
      >
        {lines}
      </svg>
    );
  }, [
    content.showGrid,
    content.gridSize,
    content.canvasWidth,
    content.canvasHeight,
    isPreview,
  ]);

  // Render snap lines
  const renderSnapLines = useMemo(() => {
    if (snapLines.vertical.length === 0 && snapLines.horizontal.length === 0) {
      return null;
    }
    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={content.canvasWidth}
        height={content.canvasHeight}
        style={{ zIndex: 9999 }}
      >
        {snapLines.vertical.map((x, i) => (
          <line
            key={`snap-v-${i}`}
            x1={x}
            y1={0}
            x2={x}
            y2={content.canvasHeight}
            stroke="#3b82f6"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
        {snapLines.horizontal.map((y, i) => (
          <line
            key={`snap-h-${i}`}
            x1={0}
            y1={y}
            x2={content.canvasWidth}
            y2={y}
            stroke="#3b82f6"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
      </svg>
    );
  }, [snapLines, content.canvasWidth, content.canvasHeight]);

  // Sort elements by z-index for rendering
  const sortedElements = useMemo(
    () => [...content.elements].sort((a, b) => a.zIndex - b.zIndex),
    [content.elements],
  );

  return (
    <div className="relative">
      {/* Toolbar - only in edit mode */}
      {!isPreview && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-600 mr-2">Add:</span>
          {(
            [
              {
                type: "rectangle" as const,
                label: "Rectangle",
                icon: "square",
              },
              { type: "text" as const, label: "Text", icon: "T" },
              { type: "image" as const, label: "Image", icon: "img" },
              { type: "button" as const, label: "Button", icon: "btn" },
            ] as const
          ).map((item) => (
            <button
              key={item.type}
              onClick={() => addElement(item.type)}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {item.label}
            </button>
          ))}
          {selectedIds.length > 0 && (
            <button
              onClick={deleteSelected}
              className="ml-auto px-3 py-1.5 text-sm bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* Canvas container */}
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          width: content.responsive ? "100%" : content.canvasWidth,
          maxWidth: content.canvasWidth,
        }}
      >
        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative"
          style={{
            width: content.canvasWidth,
            height: content.canvasHeight,
            backgroundColor: content.backgroundColor || "#ffffff",
            backgroundImage: content.backgroundImage
              ? `url(${content.backgroundImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: content.responsive ? `scale(${scale})` : undefined,
            transformOrigin: "top left",
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        >
          {/* Grid */}
          {renderGrid}

          {/* Snap lines */}
          {renderSnapLines}

          {/* Elements */}
          {sortedElements.map(renderElement)}

          {/* Empty state */}
          {content.elements.length === 0 && !isPreview && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Empty Canvas</p>
                <p className="text-sm">Use the toolbar above to add elements</p>
              </div>
            </div>
          )}
        </div>

        {/* Scale indicator for responsive mode */}
        {content.responsive && scale < 1 && !isPreview && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
            {Math.round(scale * 100)}%
          </div>
        )}
      </div>

      {/* Selected element info */}
      {!isPreview && selectedIds.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
          <p className="text-gray-600">
            {selectedIds.length} element{selectedIds.length > 1 ? "s" : ""}{" "}
            selected
          </p>
          {selectedIds.length === 1 && (
            <div className="mt-2 flex gap-4 text-gray-500">
              {(() => {
                const el = content.elements.find(
                  (e) => e.id === selectedIds[0],
                );
                if (!el) return null;
                return (
                  <>
                    <span>
                      X: {Math.round(el.bounds.x)}, Y: {Math.round(el.bounds.y)}
                    </span>
                    <span>
                      {Math.round(el.bounds.width)} x{" "}
                      {Math.round(el.bounds.height)}
                    </span>
                    <span>Z: {el.zIndex}</span>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => {
          setIsMediaPickerOpen(false);
          setEditingImageId(null);
        }}
        onSelect={handleMediaSelect}
        allowedTypes={["image/*"]}
      />
    </div>
  );
};

export default FreeformCanvas;
