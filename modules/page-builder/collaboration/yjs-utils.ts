/**
 * Yjs Utilities
 * Functions for converting between Page/Block structures and Yjs documents
 */

import * as Y from "yjs";
import type { Page, PageBlock, BlockContent, BlockStyle } from "../types";

/**
 * Convert a Page to Y.Doc structure
 */
export function pageToYDoc(page: Page, ydoc: Y.Doc): void {
  const ymeta = ydoc.getMap("meta");
  const yblocks = ydoc.getArray("blocks");

  ydoc.transact(() => {
    // Set metadata
    ymeta.set("id", page.id);
    ymeta.set("title", page.title);
    ymeta.set("slug", page.slug);
    ymeta.set("status", page.status);
    ymeta.set("createdAt", page.createdAt);
    ymeta.set("updatedAt", page.updatedAt);
    if (page.publishedAt) ymeta.set("publishedAt", page.publishedAt);

    // Set SEO
    const yseo = new Y.Map();
    if (page.seo?.title) yseo.set("title", page.seo.title);
    if (page.seo?.description) yseo.set("description", page.seo.description);
    if (page.seo?.ogImage) yseo.set("ogImage", page.seo.ogImage);
    if (page.seo?.noIndex) yseo.set("noIndex", page.seo.noIndex);
    ymeta.set("seo", yseo);

    // Clear and set blocks
    if (yblocks.length > 0) {
      yblocks.delete(0, yblocks.length);
    }

    for (const block of page.blocks) {
      yblocks.push([blockToYMap(block)]);
    }
  });
}

/**
 * Convert a PageBlock to Y.Map
 */
function blockToYMap(block: PageBlock): Y.Map<unknown> {
  const yblock = new Y.Map();

  yblock.set("id", block.id);
  yblock.set("type", block.type);
  yblock.set(
    "content",
    objectToYMap(block.content as unknown as Record<string, unknown>),
  );
  yblock.set(
    "style",
    objectToYMap(block.style as unknown as Record<string, unknown>),
  );
  yblock.set(
    "responsive",
    objectToYMap(block.responsive as unknown as Record<string, unknown>),
  );

  if (block.locked !== undefined) yblock.set("locked", block.locked);
  if (block.hidden !== undefined) yblock.set("hidden", block.hidden);

  // Handle children recursively
  if (block.children && block.children.length > 0) {
    const ychildren = new Y.Array();
    for (const child of block.children) {
      ychildren.push([blockToYMap(child)]);
    }
    yblock.set("children", ychildren);
  }

  return yblock;
}

/**
 * Convert a plain object to Y.Map
 */
function objectToYMap(obj: Record<string, unknown>): Y.Map<unknown> {
  const ymap = new Y.Map();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === "object" && !Array.isArray(value)) {
        ymap.set(key, objectToYMap(value as Record<string, unknown>));
      } else if (Array.isArray(value)) {
        const yarray = new Y.Array();
        yarray.push(value);
        ymap.set(key, yarray);
      } else {
        ymap.set(key, value);
      }
    }
  }
  return ymap;
}

/**
 * Convert Y.Doc to Page structure
 */
export function yDocToPage(ydoc: Y.Doc): Page {
  const ymeta = ydoc.getMap("meta");
  const yblocks = ydoc.getArray("blocks");

  const yseo = ymeta.get("seo") as Y.Map<unknown> | undefined;

  return {
    id: (ymeta.get("id") as string) || "",
    title: (ymeta.get("title") as string) || "Untitled",
    slug: (ymeta.get("slug") as string) || "untitled",
    status: (ymeta.get("status") as Page["status"]) || "draft",
    blocks: yArrayToBlocks(yblocks),
    seo: yseo ? yMapToObject(yseo) : {},
    createdAt: (ymeta.get("createdAt") as string) || new Date().toISOString(),
    updatedAt: (ymeta.get("updatedAt") as string) || new Date().toISOString(),
    publishedAt: ymeta.get("publishedAt") as string | undefined,
    versions: [],
  };
}

/**
 * Convert Y.Array of blocks to PageBlock[]
 */
export function yArrayToBlocks(yblocks: Y.Array<unknown>): PageBlock[] {
  const blocks: PageBlock[] = [];

  for (let i = 0; i < yblocks.length; i++) {
    const yblock = yblocks.get(i) as Y.Map<unknown>;
    if (yblock) {
      blocks.push(yMapToBlock(yblock));
    }
  }

  return blocks;
}

/**
 * Convert Y.Map to PageBlock
 */
function yMapToBlock(yblock: Y.Map<unknown>): PageBlock {
  const ycontent = yblock.get("content") as Y.Map<unknown>;
  const ystyle = yblock.get("style") as Y.Map<unknown>;
  const yresponsive = yblock.get("responsive") as Y.Map<unknown>;
  const ychildren = yblock.get("children") as Y.Array<unknown> | undefined;

  return {
    id: (yblock.get("id") as string) || "",
    type: yblock.get("type") as PageBlock["type"],
    content: ycontent
      ? (yMapToObject(ycontent) as unknown as BlockContent)
      : ({} as BlockContent),
    style: ystyle
      ? (yMapToObject(ystyle) as unknown as BlockStyle)
      : ({} as BlockStyle),
    responsive: yresponsive ? yMapToObject(yresponsive) : {},
    locked: yblock.get("locked") as boolean | undefined,
    hidden: yblock.get("hidden") as boolean | undefined,
    children: ychildren ? yArrayToBlocks(ychildren) : undefined,
  };
}

/**
 * Convert Y.Map to plain object
 */
function yMapToObject(ymap: Y.Map<unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {};

  ymap.forEach((value, key) => {
    if (value instanceof Y.Map) {
      obj[key] = yMapToObject(value);
    } else if (value instanceof Y.Array) {
      obj[key] = value.toArray();
    } else {
      obj[key] = value;
    }
  });

  return obj;
}

/**
 * Find a block in Y.Array by ID
 */
export function findYBlock(
  yblocks: Y.Array<unknown>,
  blockId: string,
): Y.Map<unknown> | null {
  for (let i = 0; i < yblocks.length; i++) {
    const yblock = yblocks.get(i) as Y.Map<unknown>;
    if (yblock.get("id") === blockId) {
      return yblock;
    }

    // Check children
    const ychildren = yblock.get("children") as Y.Array<unknown> | undefined;
    if (ychildren) {
      const found = findYBlock(ychildren, blockId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Update a block in Y.Array
 */
export function updateYBlock(
  yblocks: Y.Array<unknown>,
  blockId: string,
  updates: Partial<PageBlock>,
): boolean {
  const yblock = findYBlock(yblocks, blockId);
  if (!yblock) return false;

  if (updates.content) {
    const ycontent = yblock.get("content") as Y.Map<unknown>;
    for (const [key, value] of Object.entries(updates.content)) {
      ycontent.set(key, value);
    }
  }

  if (updates.style) {
    const ystyle = yblock.get("style") as Y.Map<unknown>;
    for (const [key, value] of Object.entries(updates.style)) {
      ystyle.set(key, value);
    }
  }

  if (updates.locked !== undefined) {
    yblock.set("locked", updates.locked);
  }

  if (updates.hidden !== undefined) {
    yblock.set("hidden", updates.hidden);
  }

  return true;
}

/**
 * Delete a block from Y.Array
 */
export function deleteYBlock(
  yblocks: Y.Array<unknown>,
  blockId: string,
): boolean {
  for (let i = 0; i < yblocks.length; i++) {
    const yblock = yblocks.get(i) as Y.Map<unknown>;
    if (yblock.get("id") === blockId) {
      yblocks.delete(i, 1);
      return true;
    }

    // Check children
    const ychildren = yblock.get("children") as Y.Array<unknown> | undefined;
    if (ychildren && deleteYBlock(ychildren, blockId)) {
      return true;
    }
  }

  return false;
}

/**
 * Add a block to Y.Array at a specific position
 */
export function addYBlock(
  yblocks: Y.Array<unknown>,
  block: PageBlock,
  position?: number,
): void {
  const yblock = blockToYMap(block);

  if (position !== undefined && position < yblocks.length) {
    yblocks.insert(position, [yblock]);
  } else {
    yblocks.push([yblock]);
  }
}
