/**
 * Collection Types
 * Core type definitions for the collections system
 *
 * Supports both content collections (Cockpit CMS-style custom content types)
 * and product collections (curated product groups for e-commerce).
 */

import type { LocalizedString } from "../../page-builder/types";

// Re-export for convenience
export type { LocalizedString };

// =============================================================================
// FIELD TYPES
// =============================================================================

/**
 * All supported field types in the collection schema system
 */
export type FieldType =
  // Basic text fields
  | "text" // Single-line text input
  | "textarea" // Multi-line text without formatting
  | "richtext" // Rich text with HTML formatting
  | "markdown" // Markdown editor
  | "code" // Code editor with syntax highlighting
  // Numeric and boolean
  | "number" // Numeric input (int or float)
  | "boolean" // Toggle/checkbox
  // Date and time
  | "date" // Date picker
  | "datetime" // Date and time picker
  // Media fields
  | "image" // Single image
  | "gallery" // Multiple images
  | "video" // Video URL or embed
  | "file" // Generic file upload
  // Selection fields
  | "select" // Single select dropdown
  | "multiselect" // Multiple select
  | "radio" // Radio button group
  | "checkbox" // Checkbox group
  // Advanced fields
  | "color" // Color picker
  | "json" // JSON editor
  | "slug" // Auto-generated URL slug
  | "url" // URL input with validation
  | "email" // Email input with validation
  // Complex fields
  | "repeater" // Array of field groups (nested)
  | "object" // Nested object with sub-fields
  // Relation fields
  | "product" // Relation to Unchained product
  | "products" // Relation to multiple products
  | "page" // Relation to CMS page
  | "collection"; // Relation to another collection entry

/**
 * Field validation rules
 */
export interface FieldValidation {
  required?: boolean;
  minLength?: number; // Min length for text
  maxLength?: number; // Max length for text
  min?: number; // Min value for number
  max?: number; // Max value for number
  pattern?: string; // Regex pattern for text fields
  patternMessage?: string; // Custom error message for pattern
  allowedTypes?: string[]; // For file/image: allowed MIME types
  maxSize?: number; // For file/image: max file size in bytes
}

/**
 * Options for select-type fields
 */
export interface SelectOption {
  value: string;
  label: LocalizedString;
}

/**
 * Configuration for relation fields
 */
export interface RelationConfig {
  /** Target collection slug for 'collection' type */
  collectionSlug?: string;
  /** Field to display in the picker */
  displayField?: string;
  /** Allow multiple selections */
  multiple?: boolean;
  /** Max number of selections */
  limit?: number;
}

/**
 * Configuration for repeater/object fields
 */
export interface RepeaterConfig {
  /** Nested field definitions */
  fields: FieldDefinition[];
  /** Minimum number of items */
  minItems?: number;
  /** Maximum number of items */
  maxItems?: number;
  /** Start collapsed by default */
  collapsed?: boolean;
  /** Label template using field values (e.g., "{{title}}") */
  itemLabel?: string;
}

/**
 * Type-specific configuration options
 */
export interface FieldTypeConfig {
  // Text fields
  placeholder?: LocalizedString;
  defaultValue?: unknown;

  // Textarea fields
  rows?: number;

  // Number fields
  step?: number;
  decimals?: number;

  // Select fields
  options?: SelectOption[];

  // Richtext/Markdown
  toolbar?: string[];

  // Code field
  language?: string;

  // Slug field
  sourceField?: string; // Field to generate slug from

  // Media fields
  aspectRatio?: string;
  allowedFormats?: string[];

  // Relation fields
  relation?: RelationConfig;

  // Repeater/Object fields
  repeater?: RepeaterConfig;
}

/**
 * Complete field definition in a collection schema
 */
export interface FieldDefinition {
  /** Unique identifier within the schema */
  id: string;

  /** Internal field name (snake_case recommended) */
  name: string;

  /** Human-readable label */
  label: LocalizedString;

  /** Field type */
  type: FieldType;

  /** Optional description/help text */
  description?: LocalizedString;

  /** Validation rules */
  validation?: FieldValidation;

  /** Type-specific configuration */
  config?: FieldTypeConfig;

  /** Whether this field supports localization */
  localized?: boolean;

  /** Display order in the form */
  order?: number;

  /** Group name for organizing fields in tabs/sections */
  group?: string;

  /** Whether this field appears in list view */
  listColumn?: boolean;

  /** Width in form (full, half, third) */
  width?: "full" | "half" | "third";

  /** Hide from editor UI */
  hidden?: boolean;

  /** Make field read-only */
  readonly?: boolean;

  /** Conditional display based on other field values */
  showIf?: {
    field: string;
    operator: "equals" | "notEquals" | "contains" | "isEmpty" | "isNotEmpty";
    value?: unknown;
  };
}

// =============================================================================
// COLLECTION SCHEMA
// =============================================================================

/**
 * Collection types
 */
export type CollectionType = "content" | "product";

/**
 * Schema status
 */
export type SchemaStatus = "draft" | "active" | "archived";

/**
 * Entry status for workflow
 */
export type EntryStatus = "draft" | "review" | "published" | "archived";

/**
 * Field group for organizing form UI
 */
export interface FieldGroup {
  name: string;
  label: LocalizedString;
  description?: LocalizedString;
  icon?: string;
  collapsed?: boolean;
  order?: number;
}

/**
 * Workflow configuration for a collection
 */
export interface CollectionWorkflowConfig {
  /** Enable review workflow */
  enableReview?: boolean;
  /** Enable scheduled publishing */
  enableScheduling?: boolean;
}

/**
 * Collection Schema - defines the structure of a collection
 */
export interface CollectionSchema {
  /** Unique identifier */
  id: string;

  /** URL-safe identifier (used in API routes and file paths) */
  slug: string;

  /** Human-readable name */
  name: LocalizedString;

  /** Description of the collection */
  description?: LocalizedString;

  /** Collection type */
  type: CollectionType;

  /** Icon for the admin UI (Heroicon name) */
  icon?: string;

  /** Schema status */
  status: SchemaStatus;

  /** Field definitions */
  fields: FieldDefinition[];

  /** Field groups for form organization */
  groups?: FieldGroup[];

  /** Which field to use as the entry title in lists */
  titleField?: string;

  /** Which field to use as preview image in lists */
  previewField?: string;

  /** Field to generate entry slug from */
  slugField?: string;

  /** Default sort field */
  sortField?: string;

  /** Default sort direction */
  sortDirection?: "asc" | "desc";

  /** Enable versioning for entries */
  versioning?: boolean;

  /** Enable workflow (draft/published) for entries */
  workflow?: CollectionWorkflowConfig;

  /** Only one entry allowed (singleton) */
  singleton?: boolean;

  /** Enable manual ordering */
  sortable?: boolean;

  /** URL template for entry preview */
  previewUrl?: string;

  /** Created from template */
  templateSlug?: string;

  /** Metadata */
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// =============================================================================
// COLLECTION ENTRY
// =============================================================================

/**
 * Localized content for an entry
 * Structure: { fieldName: value } or { fieldName: { locale: value } } for localized fields
 */
export type EntryContent = Record<string, unknown>;
export type LocalizedEntryContent = Record<string, LocalizedString | unknown>;

/**
 * Entry workflow metadata
 */
export interface EntryWorkflow {
  submittedBy?: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  scheduledFor?: string;
  publishedBy?: string;
}

/**
 * Version history entry
 */
export interface EntryVersion {
  id: string;
  createdAt: string;
  createdBy?: string;
  data: EntryContent;
}

/**
 * Collection Entry - an instance of content within a collection
 */
export interface CollectionEntry {
  /** Unique identifier */
  id: string;

  /** Reference to the collection schema slug */
  collectionSlug: string;

  /** URL-safe entry identifier */
  slug: string;

  /** Entry status */
  status: EntryStatus;

  /**
   * Entry data
   * For localized fields: { fieldName: { de: value, fr: value } }
   * For non-localized fields: { fieldName: value }
   */
  content: LocalizedEntryContent;

  /** Order for manual sorting */
  order?: number;

  /** Workflow metadata */
  workflow?: EntryWorkflow;

  /** Version history */
  versions?: EntryVersion[];

  /** Metadata */
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// =============================================================================
// PRODUCT COLLECTIONS
// =============================================================================

/**
 * Product source for product collections
 */
export type ProductSource =
  | "manual" // Hand-picked products
  | "category" // Products from Unchained category/assortment
  | "query" // Dynamic query (filters)
  | "bestselling" // Auto: best sellers
  | "newest"; // Auto: newest products

/**
 * Rule operator for product filters
 */
export type RuleOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "greaterThan"
  | "lessThan"
  | "in"
  | "notIn";

/**
 * Product filter for dynamic queries
 */
export interface ProductFilter {
  field: string;
  operator: RuleOperator;
  value: unknown;
}

/**
 * Sort options for product collections
 */
export interface ProductSort {
  field: "price" | "name" | "createdAt" | "sales" | "order";
  direction: "asc" | "desc";
}

/**
 * Display settings for product collections
 */
export interface ProductCollectionDisplay {
  columns?: number;
  mobileColumns?: number;
  showPrice?: boolean;
  showRating?: boolean;
  showQuickAdd?: boolean;
}

/**
 * Product Collection - specialized for curated product groups
 */
export interface ProductCollection {
  /** Unique identifier */
  id: string;

  /** URL-safe identifier */
  slug: string;

  /** Collection name */
  name: LocalizedString;

  /** Collection description */
  description?: LocalizedString;

  /** Cover image for the collection */
  image?: string;

  /** Status */
  status: "draft" | "published";

  /** How products are selected */
  source: ProductSource;

  /** For manual mode: ordered list of product IDs */
  productIds?: string[];

  /** For category mode: category/assortment ID */
  categoryId?: string;

  /** For category mode: include subcategory products */
  includeSub?: boolean;

  /** For query mode: filter rules */
  filters?: ProductFilter[];

  /** For query mode: rule matching behavior */
  filterMatch?: "all" | "any";

  /** Sort order for products */
  sort?: ProductSort;

  /** Maximum products (for automatic modes) */
  limit?: number;

  /** Exclude out-of-stock products */
  excludeOutOfStock?: boolean;

  /** Display settings used by ProductGrid blocks */
  display?: ProductCollectionDisplay;

  /** SEO metadata */
  seo?: {
    title?: LocalizedString;
    description?: LocalizedString;
  };

  /** Metadata */
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// =============================================================================
// API TYPES
// =============================================================================

/**
 * List query parameters
 */
export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EntryStatus | EntryStatus[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  locale?: string;
}

/**
 * Paginated list response
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: { id: string; error: string }[];
}

// =============================================================================
// INPUT TYPES
// =============================================================================

/**
 * Create schema input
 */
export interface CreateSchemaInput {
  slug: string;
  name: LocalizedString;
  description?: LocalizedString;
  type?: CollectionType;
  icon?: string;
  fields: FieldDefinition[];
  groups?: FieldGroup[];
  titleField: string;
  slugField?: string;
  previewField?: string;
  workflow?: CollectionWorkflowConfig;
  singleton?: boolean;
  sortable?: boolean;
  previewUrl?: string;
}

/**
 * Update schema input
 */
export type UpdateSchemaInput = Partial<
  Omit<CollectionSchema, "id" | "createdAt" | "createdBy">
>;

/**
 * Create entry input
 */
export interface CreateEntryInput {
  slug?: string;
  content: LocalizedEntryContent;
  status?: EntryStatus;
  order?: number;
}

/**
 * Update entry input
 */
export type UpdateEntryInput = Partial<
  Omit<CollectionEntry, "id" | "collectionSlug" | "createdAt" | "createdBy">
>;

/**
 * Create product collection input
 */
export interface CreateProductCollectionInput {
  slug: string;
  name: LocalizedString;
  description?: LocalizedString;
  image?: string;
  source: ProductSource;
  productIds?: string[];
  categoryId?: string;
  includeSub?: boolean;
  filters?: ProductFilter[];
  filterMatch?: "all" | "any";
  sort?: ProductSort;
  limit?: number;
  excludeOutOfStock?: boolean;
  display?: ProductCollectionDisplay;
  seo?: {
    title?: LocalizedString;
    description?: LocalizedString;
  };
}

/**
 * Update product collection input
 */
export type UpdateProductCollectionInput = Partial<
  Omit<ProductCollection, "id" | "createdAt" | "createdBy">
>;

// =============================================================================
// EDITOR STATE TYPES
// =============================================================================

/**
 * Selection state for schema editor
 */
export interface SchemaEditorSelection {
  fieldId: string | null;
}

/**
 * Drag state for field reordering
 */
export interface SchemaDragState {
  isDragging: boolean;
  draggedFieldId: string | null;
  dropTargetId: string | null;
  dropPosition: "before" | "after" | null;
}

/**
 * History entry for undo/redo
 */
export interface SchemaHistoryEntry {
  schema: CollectionSchema;
  action: string;
  label: string;
  timestamp: number;
}

/**
 * Schema editor state
 */
export interface SchemaEditorState {
  schema: CollectionSchema | null;
  selection: SchemaEditorSelection;
  isDirty: boolean;
  isSaving: boolean;
  dragState: SchemaDragState;
  history: SchemaHistoryEntry[];
  historyIndex: number;
  sidebarTab: "fields" | "settings";
  error: { message: string; code?: string } | null;
}

/**
 * Entry editor state
 */
export interface EntryEditorState {
  entry: CollectionEntry | null;
  schema: CollectionSchema | null;
  isDirty: boolean;
  isSaving: boolean;
  activeLocale: string;
  validationErrors: Record<string, string>;
  error: { message: string; code?: string } | null;
}
