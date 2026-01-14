/**
 * Menu Editor Component
 * Visual editor for managing menu items with drag-and-drop hierarchy
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
  useDraggable,
  UniqueIdentifier,
  closestCenter,
  rectIntersection,
  CollisionDetection,
  pointerWithin,
} from "@dnd-kit/core";
import {
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  CheckIcon,
  CloudArrowUpIcon,
  EyeSlashIcon,
  ChevronRightIcon,
  ChevronDownIcon as ChevronDownSolidIcon,
  LinkIcon,
  DocumentIcon,
  GlobeAltIcon,
  FolderIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";
import { getLocalizedString } from "../../page-builder/utils/localization";
import { cmsConfig } from "../../../lib/cms.config";
import type { Menu, MenuItem, MenuItemLinkType } from "../types";
import { generateMenuItemId } from "../utils/helpers";

interface MenuEditorProps {
  menu: Menu;
  onSave: (menu: Menu) => Promise<Menu>;
  onPublish: (menu: Menu) => Promise<Menu>;
  onBack: () => void;
}

const MAX_DEPTH = 3;

const linkTypeLabels: Record<MenuItemLinkType, string> = {
  page: "Page",
  category: "Category",
  external: "External URL",
  submenu: "Submenu (no link)",
};

const linkTypeIcons: Record<
  MenuItemLinkType,
  React.ComponentType<{ className?: string }>
> = {
  page: DocumentIcon,
  category: FolderIcon,
  external: GlobeAltIcon,
  submenu: FolderIcon,
};

// Tree manipulation helpers
const removeItemFromTree = (
  items: MenuItem[],
  id: string,
): { items: MenuItem[]; removed: MenuItem | null } => {
  let removed: MenuItem | null = null;
  const newItems = items.reduce<MenuItem[]>((acc, item) => {
    if (item.id === id) {
      removed = item;
      return acc;
    }
    if (item.children?.length) {
      const result = removeItemFromTree(item.children, id);
      if (result.removed) removed = result.removed;
      acc.push({
        ...item,
        children: result.items.length > 0 ? result.items : undefined,
      });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
  return { items: newItems, removed };
};

const insertAsChild = (
  items: MenuItem[],
  parentId: string,
  itemToInsert: MenuItem,
): MenuItem[] => {
  return items.map((item) => {
    if (item.id === parentId) {
      const children = item.children ? [...item.children] : [];
      children.push({ ...itemToInsert, order: children.length });
      return { ...item, children };
    }
    if (item.children?.length) {
      return {
        ...item,
        children: insertAsChild(item.children, parentId, itemToInsert),
      };
    }
    return item;
  });
};

const insertAtIndex = (
  items: MenuItem[],
  parentId: string | null,
  index: number,
  itemToInsert: MenuItem,
): MenuItem[] => {
  if (parentId === null) {
    const newItems = [...items];
    newItems.splice(index, 0, itemToInsert);
    return newItems.map((item, i) => ({ ...item, order: i }));
  }
  return items.map((item) => {
    if (item.id === parentId) {
      const children = item.children ? [...item.children] : [];
      children.splice(index, 0, itemToInsert);
      return {
        ...item,
        children: children.map((c, i) => ({ ...c, order: i })),
      };
    }
    if (item.children?.length) {
      return {
        ...item,
        children: insertAtIndex(item.children, parentId, index, itemToInsert),
      };
    }
    return item;
  });
};

// Droppable zone for inserting between items
const DropZone: React.FC<{
  id: string;
  isOver: boolean;
  depth: number;
}> = ({ id, isOver, depth }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ paddingLeft: `${depth * 24 + 8}px` }}
      className={`h-1 transition-all ${
        isOver
          ? "h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-dashed border-blue-400 rounded-lg mx-2"
          : ""
      }`}
    />
  );
};

// Custom collision detection that prioritizes nest zones over insert zones
const customCollisionDetection: CollisionDetection = (args) => {
  // First check if pointer is within any nest zone
  const pointerCollisions = pointerWithin(args);
  const nestCollision = pointerCollisions.find((c) =>
    String(c.id).startsWith("nest-"),
  );
  if (nestCollision) {
    return [nestCollision];
  }

  // Otherwise use closest center for insert zones
  return closestCenter(args);
};

// Draggable tree item with separate nest drop zone
const TreeItem: React.FC<{
  item: MenuItem;
  depth: number;
  isSelected: boolean;
  isExpanded: boolean;
  canNest: boolean;
  isNestTarget: boolean;
  activeLocale: string;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
}> = ({
  item,
  depth,
  isSelected,
  isExpanded,
  canNest,
  isNestTarget,
  activeLocale,
  onSelect,
  onToggleExpand,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({ id: item.id });

  const { setNodeRef: setNestRef, isOver: isOverNest } = useDroppable({
    id: `nest-${item.id}`,
    disabled: !canNest,
  });

  const hasChildren = item.children && item.children.length > 0;
  const ItemIcon = linkTypeIcons[item.linkType];
  const showNestHighlight = isOverNest && canNest;

  return (
    <div
      ref={setNestRef}
      style={{ paddingLeft: `${depth * 24 + 8}px` }}
      className={`relative flex items-center gap-1.5 px-2 py-2 rounded-lg cursor-pointer transition-all ${
        isDragging
          ? "opacity-30"
          : isSelected
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            : showNestHighlight
              ? "bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 ring-inset"
              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
      }`}
      onClick={() => onSelect(item.id)}
    >
      {/* Drag handle */}
      <button
        ref={setDragRef}
        {...attributes}
        {...listeners}
        className="w-5 h-5 flex items-center justify-center flex-shrink-0 cursor-grab active:cursor-grabbing opacity-30 hover:opacity-100 touch-none"
        onClick={(e) => e.stopPropagation()}
      >
        <Bars2Icon className="w-4 h-4" />
      </button>

      {/* Expand/collapse */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) onToggleExpand(item.id);
        }}
        className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${
          hasChildren
            ? "opacity-60 hover:opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {hasChildren &&
          (isExpanded ? (
            <ChevronDownSolidIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-4 h-4" />
          ))}
      </button>

      <ItemIcon className="w-4 h-4 flex-shrink-0 opacity-50" />

      <span
        className={`flex-1 truncate text-sm font-medium ${
          !item.isVisible ? "opacity-50 line-through" : ""
        }`}
      >
        {getLocalizedString(item.label, activeLocale) || "Untitled"}
      </span>

      {!item.isVisible && <EyeSlashIcon className="w-3.5 h-3.5 opacity-50" />}

      {hasChildren && (
        <span className="text-xs opacity-50 tabular-nums">
          {item.children!.length}
        </span>
      )}

      {showNestHighlight && (
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
          Drop to nest
        </span>
      )}
    </div>
  );
};

// Overlay shown while dragging
const DragOverlayContent: React.FC<{
  item: MenuItem;
  activeLocale: string;
}> = ({ item, activeLocale }) => {
  const ItemIcon = linkTypeIcons[item.linkType];
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-2xl ring-2 ring-blue-500 w-64">
      <Bars2Icon className="w-4 h-4 opacity-50" />
      <ItemIcon className="w-4 h-4 opacity-50" />
      <span className="flex-1 truncate text-sm font-medium text-slate-900 dark:text-white">
        {getLocalizedString(item.label, activeLocale) || "Untitled"}
      </span>
    </div>
  );
};

// Count total items
const countItems = (items: MenuItem[]): number => {
  return items.reduce((count, item) => {
    return count + 1 + (item.children ? countItems(item.children) : 0);
  }, 0);
};

// Find item location
interface ItemLocation {
  parent: MenuItem | null;
  siblings: MenuItem[];
  index: number;
  depth: number;
}

const findItemLocation = (
  items: MenuItem[],
  itemId: string,
  parent: MenuItem | null = null,
  depth = 0,
): ItemLocation | null => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === itemId) {
      return { parent, siblings: items, index: i, depth };
    }
    if (items[i].children) {
      const found = findItemLocation(
        items[i].children!,
        itemId,
        items[i],
        depth + 1,
      );
      if (found) return found;
    }
  }
  return null;
};

// Get depth of an item
const getItemDepth = (items: MenuItem[], id: string, depth = 0): number => {
  for (const item of items) {
    if (item.id === id) return depth;
    if (item.children) {
      const d = getItemDepth(item.children, id, depth + 1);
      if (d >= 0) return d;
    }
  }
  return -1;
};

const MenuEditor: React.FC<MenuEditorProps> = ({
  menu: initialMenu,
  onSave,
  onPublish,
  onBack,
}) => {
  const [menu, setMenu] = useState<Menu>(initialMenu);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const expanded = new Set<string>();
    const addExpanded = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.children?.length) {
          expanded.add(item.id);
          addExpanded(item.children);
        }
      });
    };
    addExpanded(initialMenu.items);
    return expanded;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeLocale, setActiveLocale] = useState(cmsConfig.defaultLocale);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Find item by ID
  const findItem = useCallback(
    (items: MenuItem[], id: string): MenuItem | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findItem(item.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    [],
  );

  const selectedItem = selectedItemId
    ? findItem(menu.items, selectedItemId)
    : null;
  const selectedItemLocation = useMemo(() => {
    if (!selectedItemId) return null;
    return findItemLocation(menu.items, selectedItemId);
  }, [menu.items, selectedItemId]);

  const activeItem = activeId ? findItem(menu.items, activeId as string) : null;

  // Toggle expand
  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  }, []);

  // Update menu
  const updateMenu = useCallback((updatedMenu: Menu) => {
    setMenu(updatedMenu);
    setHasChanges(true);
  }, []);

  // Update items helper
  const updateItems = useCallback(
    (
      items: MenuItem[],
      itemId: string,
      updater: (item: MenuItem) => MenuItem,
    ): MenuItem[] => {
      return items.map((item) => {
        if (item.id === itemId) return updater(item);
        if (item.children) {
          return {
            ...item,
            children: updateItems(item.children, itemId, updater),
          };
        }
        return item;
      });
    },
    [],
  );

  // Add item
  const addItem = useCallback(
    (parentId?: string) => {
      const newItem: MenuItem = {
        id: generateMenuItemId(),
        label: { [activeLocale]: "New Item" },
        linkType: "page",
        isVisible: true,
        order: 0,
      };

      if (parentId) {
        const newItems = updateItems(menu.items, parentId, (parent) => ({
          ...parent,
          children: [
            ...(parent.children || []),
            { ...newItem, order: parent.children?.length || 0 },
          ],
        }));
        updateMenu({ ...menu, items: newItems });
        setExpandedItems((prev) => new Set([...prev, parentId]));
      } else {
        updateMenu({
          ...menu,
          items: [...menu.items, { ...newItem, order: menu.items.length }],
        });
      }
      setSelectedItemId(newItem.id);
    },
    [menu, activeLocale, updateItems, updateMenu],
  );

  // Delete item
  const deleteItem = useCallback(
    (itemId: string) => {
      const { items: newItems } = removeItemFromTree(menu.items, itemId);
      updateMenu({ ...menu, items: newItems });
      if (selectedItemId === itemId) setSelectedItemId(null);
    },
    [menu, selectedItemId, updateMenu],
  );

  // Move item up/down
  const moveItem = useCallback(
    (itemId: string, direction: "up" | "down") => {
      const location = findItemLocation(menu.items, itemId);
      if (!location) return;

      const { siblings, index, parent } = location;
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= siblings.length) return;

      const newSiblings = [...siblings];
      [newSiblings[index], newSiblings[newIndex]] = [
        newSiblings[newIndex],
        newSiblings[index],
      ];
      const reordered = newSiblings.map((s, i) => ({ ...s, order: i }));

      if (parent) {
        const newItems = updateItems(menu.items, parent.id, (p) => ({
          ...p,
          children: reordered,
        }));
        updateMenu({ ...menu, items: newItems });
      } else {
        updateMenu({ ...menu, items: reordered });
      }
    },
    [menu, updateItems, updateMenu],
  );

  // Update item property
  const updateItemProperty = useCallback(
    <K extends keyof MenuItem>(
      itemId: string,
      property: K,
      value: MenuItem[K],
    ) => {
      const newItems = updateItems(menu.items, itemId, (item) => ({
        ...item,
        [property]: value,
      }));
      updateMenu({ ...menu, items: newItems });
    },
    [menu, updateItems, updateMenu],
  );

  // Update item label
  const updateItemLabel = useCallback(
    (itemId: string, locale: string, value: string) => {
      const newItems = updateItems(menu.items, itemId, (item) => ({
        ...item,
        label: { ...item.label, [locale]: value },
      }));
      updateMenu({ ...menu, items: newItems });
    },
    [menu, updateItems, updateMenu],
  );

  // DnD handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = useCallback((event: any) => {
    setOverId(event.over?.id ?? null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setOverId(null);

      if (!over || active.id === over.id) return;

      const draggedItemId = active.id as string;
      const targetId = over.id as string;

      // Check if dropping into a nest zone
      const isNestDrop = targetId.startsWith("nest-");
      const actualTargetId = isNestDrop
        ? targetId.replace("nest-", "")
        : targetId;

      // Check if dropping into an insert zone
      const isInsertDrop = targetId.startsWith("insert-");

      // Don't drop on self
      if (actualTargetId === draggedItemId) return;

      // Get dragged item
      const { items: itemsWithoutDragged, removed: draggedItem } =
        removeItemFromTree(menu.items, draggedItemId);
      if (!draggedItem) return;

      // Check we're not dropping into own children
      const isDescendant = (parentId: string, checkId: string): boolean => {
        const parent = findItem(menu.items, parentId);
        if (!parent?.children) return false;
        return parent.children.some(
          (c) => c.id === checkId || isDescendant(c.id, checkId),
        );
      };
      if (isDescendant(draggedItemId, actualTargetId)) return;

      let newItems: MenuItem[];

      if (isNestDrop) {
        // Drop as child of target
        const targetDepth = getItemDepth(itemsWithoutDragged, actualTargetId);
        if (targetDepth >= MAX_DEPTH - 1) return; // Can't nest deeper

        newItems = insertAsChild(
          itemsWithoutDragged,
          actualTargetId,
          draggedItem,
        );
        setExpandedItems((prev) => new Set([...prev, actualTargetId]));
      } else if (isInsertDrop) {
        // Parse insert zone: "insert-{parentId|root}-{index}"
        const parts = targetId.split("-");
        const parentId = parts[1] === "root" ? null : parts[1];
        const index = parseInt(parts[2], 10);
        newItems = insertAtIndex(
          itemsWithoutDragged,
          parentId,
          index,
          draggedItem,
        );
      } else {
        // Drop after target at same level
        const targetLocation = findItemLocation(
          itemsWithoutDragged,
          actualTargetId,
        );
        if (!targetLocation) return;
        const parentId = targetLocation.parent?.id || null;
        newItems = insertAtIndex(
          itemsWithoutDragged,
          parentId,
          targetLocation.index + 1,
          draggedItem,
        );
      }

      updateMenu({ ...menu, items: newItems });
    },
    [menu, findItem, updateMenu],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
  }, []);

  // Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await onSave(menu);
      setMenu(saved);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save menu");
    } finally {
      setIsSaving(false);
    }
  };

  // Publish
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const published = await onPublish(menu);
      setMenu(published);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to publish:", error);
      alert("Failed to publish menu");
    } finally {
      setIsPublishing(false);
    }
  };

  // Render tree recursively with drop zones
  const renderTree = (
    items: MenuItem[],
    parentId: string | null,
    depth: number,
  ) => {
    const result: React.ReactNode[] = [];

    // Drop zone at start
    const startZoneId = `insert-${parentId || "root"}-0`;
    result.push(
      <DropZone
        key={startZoneId}
        id={startZoneId}
        isOver={overId === startZoneId}
        depth={depth}
      />,
    );

    items.forEach((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.has(item.id);
      const canNest =
        depth < MAX_DEPTH - 1 && activeId !== null && activeId !== item.id;

      // The item itself
      result.push(
        <TreeItem
          key={item.id}
          item={item}
          depth={depth}
          isSelected={selectedItemId === item.id}
          isExpanded={isExpanded}
          canNest={canNest}
          isNestTarget={overId === `nest-${item.id}`}
          activeLocale={activeLocale}
          onSelect={setSelectedItemId}
          onToggleExpand={toggleExpanded}
        />,
      );

      // Children if expanded
      if (hasChildren && isExpanded) {
        result.push(
          <div key={`children-${item.id}`}>
            {renderTree(item.children!, item.id, depth + 1)}
          </div>,
        );
      }

      // Drop zone after item
      const afterZoneId = `insert-${parentId || "root"}-${index + 1}`;
      result.push(
        <DropZone
          key={afterZoneId}
          id={afterZoneId}
          isOver={overId === afterZoneId}
          depth={depth}
        />,
      );
    });

    return result;
  };

  const totalItems = countItems(menu.items);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-slate-900 dark:text-white">
                {getLocalizedString(menu.name, activeLocale)}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>{menu.slug}</span>
                <span>•</span>
                <span
                  className={
                    menu.status === "published"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }
                >
                  {menu.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={activeLocale}
              onChange={(e) => setActiveLocale(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {cmsConfig.locales.map((locale) => (
                <option key={locale} value={locale}>
                  {locale.toUpperCase()}
                </option>
              ))}
            </select>

            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                hasChanges
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <>
                  <CloudArrowUpIcon className="w-4 h-4 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Save
                </>
              )}
            </button>

            {menu.status !== "published" && (
              <button
                onClick={handlePublish}
                disabled={isPublishing || hasChanges}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? "Publishing..." : "Publish"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel */}
        <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Menu Items
              </h2>
              <button
                onClick={() => addItem()}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Add item"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalItems} item{totalItems !== 1 ? "s" : ""} • Drag onto item to
              nest
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {menu.items.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={customCollisionDetection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                {renderTree(menu.items, null, 0)}
                <DragOverlay dropAnimation={null}>
                  {activeItem && (
                    <DragOverlayContent
                      item={activeItem}
                      activeLocale={activeLocale}
                    />
                  )}
                </DragOverlay>
              </DndContext>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <LinkIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  No menu items yet
                </p>
                <button
                  onClick={() => addItem()}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Item
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-y-auto">
          {selectedItem ? (
            <div className="max-w-xl mx-auto p-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Item Settings
                  </h2>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveItem(selectedItem.id, "up")}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Move up"
                    >
                      <ChevronUpIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => moveItem(selectedItem.id, "down")}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Move down"
                    >
                      <ChevronDownIcon className="w-5 h-5" />
                    </button>
                    <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                    <button
                      onClick={() => deleteItem(selectedItem.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Label */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Label ({activeLocale.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={selectedItem.label[activeLocale] || ""}
                      onChange={(e) =>
                        updateItemLabel(
                          selectedItem.id,
                          activeLocale,
                          e.target.value,
                        )
                      }
                      placeholder="Menu item label"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Link Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Link Type
                    </label>
                    <select
                      value={selectedItem.linkType}
                      onChange={(e) =>
                        updateItemProperty(
                          selectedItem.id,
                          "linkType",
                          e.target.value as MenuItemLinkType,
                        )
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                    >
                      {Object.entries(linkTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Link Target */}
                  {selectedItem.linkType === "page" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Page Slug
                      </label>
                      <input
                        type="text"
                        value={selectedItem.pageSlug || ""}
                        onChange={(e) =>
                          updateItemProperty(
                            selectedItem.id,
                            "pageSlug",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., about-us"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
                      />
                    </div>
                  )}

                  {selectedItem.linkType === "category" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Category Slug
                      </label>
                      <input
                        type="text"
                        value={selectedItem.categorySlug || ""}
                        onChange={(e) =>
                          updateItemProperty(
                            selectedItem.id,
                            "categorySlug",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., electronics"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
                      />
                    </div>
                  )}

                  {selectedItem.linkType === "external" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        URL
                      </label>
                      <input
                        type="url"
                        value={selectedItem.externalUrl || ""}
                        onChange={(e) =>
                          updateItemProperty(
                            selectedItem.id,
                            "externalUrl",
                            e.target.value,
                          )
                        }
                        placeholder="https://example.com"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  {/* Visibility */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Visible
                      </div>
                      <div className="text-xs text-slate-500">
                        Show this item in the menu
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        updateItemProperty(
                          selectedItem.id,
                          "isVisible",
                          !selectedItem.isVisible,
                        )
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        selectedItem.isVisible
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          selectedItem.isVisible ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Open in new tab */}
                  {selectedItem.linkType === "external" && (
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Open in new tab
                        </div>
                        <div className="text-xs text-slate-500">
                          Opens link in a new browser tab
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          updateItemProperty(
                            selectedItem.id,
                            "openInNewTab",
                            !selectedItem.openInNewTab,
                          )
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          selectedItem.openInNewTab
                            ? "bg-emerald-500"
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            selectedItem.openInNewTab ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  {/* Children section */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Child Items
                        </div>
                        <div className="text-xs text-slate-500">
                          {selectedItem.children?.length || 0} children •{" "}
                          {selectedItemLocation
                            ? `Level ${selectedItemLocation.depth + 1} of ${MAX_DEPTH}`
                            : ""}
                        </div>
                      </div>
                    </div>
                    {selectedItemLocation &&
                    selectedItemLocation.depth < MAX_DEPTH - 1 ? (
                      <button
                        onClick={() => addItem(selectedItem.id)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Child Item
                      </button>
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-2">
                        Maximum nesting depth reached
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <LinkIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Select an item
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Click to edit. Drag onto another item to nest it inside.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuEditor;
