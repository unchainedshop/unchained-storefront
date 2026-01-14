/**
 * File-based Schema Storage
 * Stores collection schemas as JSON files in content/collections/schemas/
 */

import fs from "fs/promises";
import path from "path";
import type {
  CollectionSchema,
  CreateSchemaInput,
  UpdateSchemaInput,
  ListParams,
  ListResponse,
} from "../types";
import {
  generateSchemaId,
  sanitizeSlug,
  getLocalizedValue,
  getTimestamp,
} from "./helpers";

const SCHEMAS_DIR = path.join(
  process.cwd(),
  "content",
  "collections",
  "schemas",
);
const TEMPLATES_DIR = path.join(SCHEMAS_DIR, "_templates");

/**
 * Ensure the schemas directory exists
 */
export async function ensureSchemasDir(): Promise<void> {
  try {
    await fs.access(SCHEMAS_DIR);
  } catch {
    await fs.mkdir(SCHEMAS_DIR, { recursive: true });
  }
}

/**
 * Ensure the templates directory exists
 */
export async function ensureTemplatesDir(): Promise<void> {
  try {
    await fs.access(TEMPLATES_DIR);
  } catch {
    await fs.mkdir(TEMPLATES_DIR, { recursive: true });
  }
}

/**
 * Get the file path for a schema
 */
function getSchemaPath(slug: string): string {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "-");
  return path.join(SCHEMAS_DIR, `${safeSlug}.json`);
}

/**
 * Get the file path for a template
 */
function getTemplatePath(slug: string): string {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "-");
  return path.join(TEMPLATES_DIR, `${safeSlug}.json`);
}

/**
 * List all schemas with optional filtering and pagination
 */
export async function listSchemas(
  params: ListParams = {},
): Promise<ListResponse<CollectionSchema>> {
  await ensureSchemasDir();

  const {
    page = 1,
    limit = 50,
    search,
    sortBy = "updatedAt",
    sortOrder = "desc",
    locale = "de",
  } = params;

  const files = await fs.readdir(SCHEMAS_DIR);
  const jsonFiles = files.filter(
    (f) => f.endsWith(".json") && !f.startsWith("_"),
  );

  let schemas: CollectionSchema[] = [];

  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(path.join(SCHEMAS_DIR, file), "utf-8");
      schemas.push(JSON.parse(content));
    } catch (error) {
      console.error(`Error reading schema ${file}:`, error);
    }
  }

  // Search filter
  if (search) {
    const query = search.toLowerCase();
    schemas = schemas.filter(
      (s) =>
        s.slug.toLowerCase().includes(query) ||
        getLocalizedValue(s.name, locale).toLowerCase().includes(query) ||
        getLocalizedValue(s.description, locale).toLowerCase().includes(query),
    );
  }

  // Sort
  schemas.sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    if (sortBy === "name") {
      aVal = getLocalizedValue(a.name, locale).toLowerCase();
      bVal = getLocalizedValue(b.name, locale).toLowerCase();
    } else {
      aVal = (a as unknown as Record<string, unknown>)[sortBy] as string;
      bVal = (b as unknown as Record<string, unknown>)[sortBy] as string;
    }

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder === "desc" ? -comparison : comparison;
  });

  const total = schemas.length;
  const offset = (page - 1) * limit;
  const items = schemas.slice(offset, offset + limit);

  return {
    items,
    total,
    page,
    limit,
    hasMore: offset + limit < total,
  };
}

/**
 * Get a single schema by slug
 */
export async function getSchema(
  slug: string,
): Promise<CollectionSchema | null> {
  await ensureSchemasDir();

  const filePath = getSchemaPath(slug);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get a schema by ID
 */
export async function getSchemaById(
  id: string,
): Promise<CollectionSchema | null> {
  const { items } = await listSchemas({ limit: 1000 });
  return items.find((s) => s.id === id) || null;
}

/**
 * Create a new schema
 */
export async function createSchema(
  input: CreateSchemaInput,
  userId?: string,
): Promise<CollectionSchema> {
  await ensureSchemasDir();

  const now = getTimestamp();
  const slug = sanitizeSlug(input.slug);

  // Check if slug already exists
  const existing = await getSchema(slug);
  if (existing) {
    throw new Error(`Schema with slug "${slug}" already exists`);
  }

  const schema: CollectionSchema = {
    id: generateSchemaId(),
    slug,
    name: input.name,
    description: input.description,
    type: input.type || "content",
    icon: input.icon,
    status: "active",
    fields: input.fields,
    groups: input.groups,
    titleField: input.titleField,
    slugField: input.slugField,
    previewField: input.previewField,
    workflow: input.workflow,
    singleton: input.singleton,
    sortable: input.sortable,
    previewUrl: input.previewUrl,
    versioning: true,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
  };

  const filePath = getSchemaPath(schema.slug);
  await fs.writeFile(filePath, JSON.stringify(schema, null, 2), "utf-8");

  return schema;
}

/**
 * Update a schema
 */
export async function updateSchema(
  slug: string,
  updates: UpdateSchemaInput,
  userId?: string,
): Promise<CollectionSchema | null> {
  const existing = await getSchema(slug);
  if (!existing) return null;

  const now = getTimestamp();

  // Handle slug change
  const newSlug = updates.slug ? sanitizeSlug(updates.slug) : slug;

  // Check if new slug already exists (and is different from current)
  if (newSlug !== slug) {
    const conflicting = await getSchema(newSlug);
    if (conflicting) {
      throw new Error(`Schema with slug "${newSlug}" already exists`);
    }
  }

  const updated: CollectionSchema = {
    ...existing,
    ...updates,
    slug: newSlug,
    id: existing.id, // Preserve ID
    createdAt: existing.createdAt, // Preserve creation time
    createdBy: existing.createdBy, // Preserve creator
    updatedAt: now,
    updatedBy: userId,
  };

  // If slug changed, delete old file
  if (newSlug !== slug) {
    await deleteSchema(slug);
  }

  const filePath = getSchemaPath(newSlug);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

  return updated;
}

/**
 * Delete a schema
 */
export async function deleteSchema(slug: string): Promise<boolean> {
  await ensureSchemasDir();

  const filePath = getSchemaPath(slug);

  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

/**
 * Check if a slug is available
 */
export async function isSchemaSlugAvailable(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const schema = await getSchema(slug);
  if (!schema) return true;
  if (excludeId && schema.id === excludeId) return true;
  return false;
}

/**
 * Duplicate a schema
 */
export async function duplicateSchema(
  slug: string,
  newSlug: string,
  userId?: string,
): Promise<CollectionSchema | null> {
  const schema = await getSchema(slug);
  if (!schema) return null;

  const now = getTimestamp();
  const sanitizedNewSlug = sanitizeSlug(newSlug);

  // Check if new slug already exists
  const existing = await getSchema(sanitizedNewSlug);
  if (existing) {
    throw new Error(`Schema with slug "${sanitizedNewSlug}" already exists`);
  }

  // Create new name with "(Copy)" suffix
  const duplicatedName: Record<string, string> = {};
  for (const [locale, name] of Object.entries(schema.name)) {
    duplicatedName[locale] = `${name} (Copy)`;
  }

  const duplicated: CollectionSchema = {
    ...schema,
    id: generateSchemaId(),
    slug: sanitizedNewSlug,
    name: duplicatedName,
    status: "draft",
    templateSlug: undefined,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: undefined,
  };

  const filePath = getSchemaPath(duplicated.slug);
  await fs.writeFile(filePath, JSON.stringify(duplicated, null, 2), "utf-8");

  return duplicated;
}

// =============================================================================
// TEMPLATES
// =============================================================================

/**
 * List all available templates
 */
export async function listTemplates(): Promise<CollectionSchema[]> {
  await ensureTemplatesDir();

  let files: string[];
  try {
    files = await fs.readdir(TEMPLATES_DIR);
  } catch {
    return [];
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const templates: CollectionSchema[] = [];

  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(
        path.join(TEMPLATES_DIR, file),
        "utf-8",
      );
      templates.push(JSON.parse(content));
    } catch (error) {
      console.error(`Error reading template ${file}:`, error);
    }
  }

  return templates;
}

/**
 * Get a single template by slug
 */
export async function getTemplate(
  slug: string,
): Promise<CollectionSchema | null> {
  await ensureTemplatesDir();

  const filePath = getTemplatePath(slug);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Create a schema from a template
 */
export async function createSchemaFromTemplate(
  templateSlug: string,
  newSlug: string,
  customizations?: Partial<CreateSchemaInput>,
  userId?: string,
): Promise<CollectionSchema> {
  const template = await getTemplate(templateSlug);
  if (!template) {
    throw new Error(`Template "${templateSlug}" not found`);
  }

  const now = getTimestamp();
  const sanitizedSlug = sanitizeSlug(newSlug);

  // Check if slug already exists
  const existing = await getSchema(sanitizedSlug);
  if (existing) {
    throw new Error(`Schema with slug "${sanitizedSlug}" already exists`);
  }

  const schema: CollectionSchema = {
    ...template,
    id: generateSchemaId(),
    slug: sanitizedSlug,
    name: customizations?.name || template.name,
    description: customizations?.description || template.description,
    icon: customizations?.icon || template.icon,
    status: "active",
    templateSlug,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: undefined,
  };

  const filePath = getSchemaPath(schema.slug);
  await fs.writeFile(filePath, JSON.stringify(schema, null, 2), "utf-8");

  return schema;
}

/**
 * Save a template (for development/migration purposes)
 */
export async function saveTemplate(template: CollectionSchema): Promise<void> {
  await ensureTemplatesDir();

  const filePath = getTemplatePath(template.slug);
  await fs.writeFile(filePath, JSON.stringify(template, null, 2), "utf-8");
}

/**
 * Get entry count for a schema (requires entryStorage import to avoid circular deps)
 */
export async function getSchemaEntryCount(schemaSlug: string): Promise<number> {
  // This is a placeholder - actual implementation will use entryStorage
  // Avoiding circular dependency by not importing entryStorage here
  const entriesDir = path.join(
    process.cwd(),
    "content",
    "collections",
    "entries",
    schemaSlug,
  );

  try {
    const files = await fs.readdir(entriesDir);
    return files.filter((f) => f.endsWith(".json")).length;
  } catch {
    return 0;
  }
}
