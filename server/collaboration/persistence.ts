/**
 * Yjs Persistence Layer
 * Syncs Yjs documents with JSON file storage
 */

import * as Y from 'yjs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { debounce } from 'lodash';

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

// Active documents
const docs = new Map<string, Y.Doc>();

// Save queues (debounced)
const saveQueues = new Map<string, ReturnType<typeof debounce>>();

/**
 * Get the file path for a page
 */
function getPagePath(slug: string): string {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '-');
  return path.join(PAGES_DIR, `${safeSlug}.json`);
}

/**
 * Load initial page data from JSON file
 */
async function loadPageData(slug: string): Promise<Record<string, unknown> | null> {
  const filePath = getPagePath(slug);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    console.error(`Error loading page ${slug}:`, error);
    return null;
  }
}

/**
 * Save page data to JSON file
 */
async function savePageData(slug: string, data: Record<string, unknown>): Promise<void> {
  const filePath = getPagePath(slug);

  try {
    // Ensure directory exists
    await fs.mkdir(PAGES_DIR, { recursive: true });

    // Update timestamp
    data.updatedAt = new Date().toISOString();

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Saved page: ${slug}`);
  } catch (error) {
    console.error(`Error saving page ${slug}:`, error);
  }
}

/**
 * Convert Y.Doc to saveable page data
 */
function yDocToPageData(ydoc: Y.Doc): Record<string, unknown> {
  const ymeta = ydoc.getMap('meta');
  const yblocks = ydoc.getArray('blocks');

  // Helper to convert Y.Map to object
  const yMapToObject = (ymap: Y.Map<unknown>): Record<string, unknown> => {
    const obj: Record<string, unknown> = {};
    ymap.forEach((value, key) => {
      if (value instanceof Y.Map) {
        obj[key] = yMapToObject(value);
      } else if (value instanceof Y.Array) {
        obj[key] = yArrayToArray(value);
      } else {
        obj[key] = value;
      }
    });
    return obj;
  };

  // Helper to convert Y.Array to array
  const yArrayToArray = (yarray: Y.Array<unknown>): unknown[] => {
    const arr: unknown[] = [];
    for (let i = 0; i < yarray.length; i++) {
      const item = yarray.get(i);
      if (item instanceof Y.Map) {
        arr.push(yMapToObject(item));
      } else if (item instanceof Y.Array) {
        arr.push(yArrayToArray(item));
      } else {
        arr.push(item);
      }
    }
    return arr;
  };

  const yseo = ymeta.get('seo') as Y.Map<unknown> | undefined;

  return {
    id: ymeta.get('id') || '',
    title: ymeta.get('title') || 'Untitled',
    slug: ymeta.get('slug') || '',
    status: ymeta.get('status') || 'draft',
    blocks: yArrayToArray(yblocks),
    seo: yseo ? yMapToObject(yseo) : {},
    createdAt: ymeta.get('createdAt') || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: ymeta.get('publishedAt'),
    versions: [],
  };
}

/**
 * Initialize Y.Doc from page data
 */
function initYDocFromPage(ydoc: Y.Doc, pageData: Record<string, unknown>): void {
  const ymeta = ydoc.getMap('meta');
  const yblocks = ydoc.getArray('blocks');

  // Helper to convert object to Y.Map
  const objectToYMap = (obj: Record<string, unknown>): Y.Map<unknown> => {
    const ymap = new Y.Map();
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          ymap.set(key, objectToYMap(value as Record<string, unknown>));
        } else if (Array.isArray(value)) {
          ymap.set(key, arrayToYArray(value));
        } else {
          ymap.set(key, value);
        }
      }
    }
    return ymap;
  };

  // Helper to convert array to Y.Array
  const arrayToYArray = (arr: unknown[]): Y.Array<unknown> => {
    const yarray = new Y.Array();
    for (const item of arr) {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        yarray.push([objectToYMap(item as Record<string, unknown>)]);
      } else if (Array.isArray(item)) {
        yarray.push([arrayToYArray(item)]);
      } else {
        yarray.push([item]);
      }
    }
    return yarray;
  };

  ydoc.transact(() => {
    // Set metadata
    ymeta.set('id', pageData.id);
    ymeta.set('title', pageData.title);
    ymeta.set('slug', pageData.slug);
    ymeta.set('status', pageData.status);
    ymeta.set('createdAt', pageData.createdAt);
    ymeta.set('updatedAt', pageData.updatedAt);
    if (pageData.publishedAt) ymeta.set('publishedAt', pageData.publishedAt);

    // Set SEO
    if (pageData.seo && typeof pageData.seo === 'object') {
      ymeta.set('seo', objectToYMap(pageData.seo as Record<string, unknown>));
    }

    // Set blocks
    if (Array.isArray(pageData.blocks)) {
      for (const block of pageData.blocks) {
        yblocks.push([objectToYMap(block as Record<string, unknown>)]);
      }
    }
  });
}

/**
 * Get or create a Yjs document for a room
 */
export async function getOrCreateDoc(roomId: string): Promise<Y.Doc> {
  // Return existing doc if available
  if (docs.has(roomId)) {
    return docs.get(roomId)!;
  }

  // Create new doc
  const ydoc = new Y.Doc();
  docs.set(roomId, ydoc);

  // Load existing page data
  const pageData = await loadPageData(roomId);
  if (pageData) {
    initYDocFromPage(ydoc, pageData);
  }

  // Setup debounced save
  const debouncedSave = debounce(async () => {
    const doc = docs.get(roomId);
    if (doc) {
      const data = yDocToPageData(doc);
      await savePageData(roomId, data);
    }
  }, 2000);

  saveQueues.set(roomId, debouncedSave);

  // Listen for updates
  ydoc.on('update', () => {
    const save = saveQueues.get(roomId);
    if (save) save();
  });

  return ydoc;
}

/**
 * Remove a document (when all clients disconnect)
 */
export async function removeDoc(roomId: string): Promise<void> {
  const doc = docs.get(roomId);
  const save = saveQueues.get(roomId);

  if (doc) {
    // Final save
    if (save) {
      save.flush();
    }

    doc.destroy();
    docs.delete(roomId);
    saveQueues.delete(roomId);
    console.log(`Removed doc: ${roomId}`);
  }
}

/**
 * Get active room count
 */
export function getActiveRooms(): string[] {
  return Array.from(docs.keys());
}
