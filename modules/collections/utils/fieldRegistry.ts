/**
 * Field Registry
 * Defines all available field types with their default configurations
 */

import type { FieldType, FieldDefinition, LocalizedString } from "../types";
import { generateFieldId } from "./helpers";

/**
 * Field category for organizing in the UI
 */
export type FieldCategory =
  | "text"
  | "media"
  | "data"
  | "selection"
  | "relations"
  | "advanced";

/**
 * Field template definition
 */
export interface FieldTemplate {
  type: FieldType;
  label: string;
  description: string;
  icon: string;
  category: FieldCategory;
  defaultConfig: Partial<Omit<FieldDefinition, "id" | "type">>;
}

/**
 * Field category metadata
 */
export interface FieldCategoryInfo {
  id: FieldCategory;
  label: LocalizedString;
  icon: string;
  order: number;
}

/**
 * All field categories
 */
export const fieldCategories: FieldCategoryInfo[] = [
  {
    id: "text",
    label: { de: "Text", en: "Text", fr: "Texte" },
    icon: "document-text",
    order: 0,
  },
  {
    id: "media",
    label: { de: "Medien", en: "Media", fr: "Medias" },
    icon: "photo",
    order: 1,
  },
  {
    id: "data",
    label: { de: "Daten", en: "Data", fr: "Donnees" },
    icon: "hashtag",
    order: 2,
  },
  {
    id: "selection",
    label: { de: "Auswahl", en: "Selection", fr: "Selection" },
    icon: "list-bullet",
    order: 3,
  },
  {
    id: "relations",
    label: { de: "Beziehungen", en: "Relations", fr: "Relations" },
    icon: "link",
    order: 4,
  },
  {
    id: "advanced",
    label: { de: "Erweitert", en: "Advanced", fr: "Avance" },
    icon: "code-bracket",
    order: 5,
  },
];

/**
 * Field registry with all supported field types
 */
export const fieldRegistry: Record<FieldType, FieldTemplate> = {
  // ==========================================================================
  // TEXT FIELDS
  // ==========================================================================
  text: {
    type: "text",
    label: "Text",
    description: "Single-line text input",
    icon: "document-text",
    category: "text",
    defaultConfig: {
      name: "text_field",
      label: { de: "Text", en: "Text" },
      validation: { maxLength: 255 },
      width: "full",
    },
  },
  textarea: {
    type: "textarea",
    label: "Long Text",
    description: "Multi-line text area without formatting",
    icon: "document",
    category: "text",
    defaultConfig: {
      name: "textarea_field",
      label: { de: "Langer Text", en: "Long Text" },
      validation: { maxLength: 5000 },
      width: "full",
    },
  },
  richtext: {
    type: "richtext",
    label: "Rich Text",
    description: "Formatted text with WYSIWYG editor",
    icon: "document-duplicate",
    category: "text",
    defaultConfig: {
      name: "content",
      label: { de: "Inhalt", en: "Content" },
      localized: true,
      width: "full",
      config: {
        toolbar: [
          "bold",
          "italic",
          "link",
          "heading",
          "list",
          "image",
          "quote",
        ],
      },
    },
  },
  markdown: {
    type: "markdown",
    label: "Markdown",
    description: "Markdown editor with preview",
    icon: "code-bracket-square",
    category: "text",
    defaultConfig: {
      name: "markdown_field",
      label: { de: "Markdown", en: "Markdown" },
      localized: true,
      width: "full",
    },
  },
  code: {
    type: "code",
    label: "Code",
    description: "Code editor with syntax highlighting",
    icon: "command-line",
    category: "text",
    defaultConfig: {
      name: "code_field",
      label: { de: "Code", en: "Code" },
      width: "full",
      config: {
        language: "javascript",
      },
    },
  },
  slug: {
    type: "slug",
    label: "Slug",
    description: "URL-safe identifier, auto-generated from another field",
    icon: "link",
    category: "text",
    defaultConfig: {
      name: "slug",
      label: { de: "URL-Slug", en: "URL Slug" },
      validation: { required: true, pattern: "^[a-z0-9-]+$" },
      width: "half",
      config: {
        sourceField: "title",
      },
    },
  },
  url: {
    type: "url",
    label: "URL",
    description: "URL input with validation",
    icon: "globe-alt",
    category: "text",
    defaultConfig: {
      name: "url_field",
      label: { de: "URL", en: "URL" },
      width: "full",
      config: {
        placeholder: { de: "https://...", en: "https://..." },
      },
    },
  },
  email: {
    type: "email",
    label: "Email",
    description: "Email address input with validation",
    icon: "envelope",
    category: "text",
    defaultConfig: {
      name: "email_field",
      label: { de: "E-Mail", en: "Email" },
      width: "half",
      validation: {
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        patternMessage: "Please enter a valid email address",
      },
    },
  },

  // ==========================================================================
  // MEDIA FIELDS
  // ==========================================================================
  image: {
    type: "image",
    label: "Image",
    description: "Single image upload or selection",
    icon: "photo",
    category: "media",
    defaultConfig: {
      name: "image",
      label: { de: "Bild", en: "Image" },
      width: "full",
      config: {
        allowedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      },
    },
  },
  gallery: {
    type: "gallery",
    label: "Gallery",
    description: "Multiple images with ordering",
    icon: "squares-2x2",
    category: "media",
    defaultConfig: {
      name: "gallery",
      label: { de: "Galerie", en: "Gallery" },
      width: "full",
      config: {
        allowedFormats: ["image/jpeg", "image/png", "image/webp"],
      },
    },
  },
  video: {
    type: "video",
    label: "Video",
    description: "Video URL or embed (YouTube, Vimeo)",
    icon: "video-camera",
    category: "media",
    defaultConfig: {
      name: "video",
      label: { de: "Video", en: "Video" },
      width: "full",
    },
  },
  file: {
    type: "file",
    label: "File",
    description: "Generic file upload (PDF, documents, etc.)",
    icon: "paper-clip",
    category: "media",
    defaultConfig: {
      name: "file",
      label: { de: "Datei", en: "File" },
      width: "full",
      config: {
        allowedFormats: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      },
    },
  },

  // ==========================================================================
  // DATA FIELDS
  // ==========================================================================
  number: {
    type: "number",
    label: "Number",
    description: "Numeric input (integer or decimal)",
    icon: "hashtag",
    category: "data",
    defaultConfig: {
      name: "number_field",
      label: { de: "Zahl", en: "Number" },
      width: "half",
      config: {
        step: 1,
        decimals: 0,
      },
    },
  },
  boolean: {
    type: "boolean",
    label: "Toggle",
    description: "Yes/No toggle or checkbox",
    icon: "check-circle",
    category: "data",
    defaultConfig: {
      name: "enabled",
      label: { de: "Aktiviert", en: "Enabled" },
      width: "half",
      config: {
        defaultValue: false,
      },
    },
  },
  date: {
    type: "date",
    label: "Date",
    description: "Date picker",
    icon: "calendar",
    category: "data",
    defaultConfig: {
      name: "date_field",
      label: { de: "Datum", en: "Date" },
      width: "half",
    },
  },
  datetime: {
    type: "datetime",
    label: "Date & Time",
    description: "Date and time picker",
    icon: "clock",
    category: "data",
    defaultConfig: {
      name: "datetime_field",
      label: { de: "Datum & Zeit", en: "Date & Time" },
      width: "half",
    },
  },
  color: {
    type: "color",
    label: "Color",
    description: "Color picker with hex/RGB support",
    icon: "swatch",
    category: "data",
    defaultConfig: {
      name: "color_field",
      label: { de: "Farbe", en: "Color" },
      width: "half",
    },
  },

  // ==========================================================================
  // SELECTION FIELDS
  // ==========================================================================
  select: {
    type: "select",
    label: "Dropdown",
    description: "Single selection from predefined options",
    icon: "chevron-down",
    category: "selection",
    defaultConfig: {
      name: "select_field",
      label: { de: "Auswahl", en: "Select" },
      width: "half",
      config: {
        options: [
          { value: "option1", label: { de: "Option 1", en: "Option 1" } },
          { value: "option2", label: { de: "Option 2", en: "Option 2" } },
        ],
      },
    },
  },
  multiselect: {
    type: "multiselect",
    label: "Multi-Select",
    description: "Multiple selections from predefined options",
    icon: "check",
    category: "selection",
    defaultConfig: {
      name: "multiselect_field",
      label: { de: "Mehrfachauswahl", en: "Multi-Select" },
      width: "full",
      config: {
        options: [
          { value: "option1", label: { de: "Option 1", en: "Option 1" } },
          { value: "option2", label: { de: "Option 2", en: "Option 2" } },
        ],
      },
    },
  },
  radio: {
    type: "radio",
    label: "Radio Buttons",
    description: "Single selection with radio buttons",
    icon: "stop-circle",
    category: "selection",
    defaultConfig: {
      name: "radio_field",
      label: { de: "Optionen", en: "Options" },
      width: "full",
      config: {
        options: [
          { value: "option1", label: { de: "Option 1", en: "Option 1" } },
          { value: "option2", label: { de: "Option 2", en: "Option 2" } },
        ],
      },
    },
  },
  checkbox: {
    type: "checkbox",
    label: "Checkboxes",
    description: "Multiple selections with checkboxes",
    icon: "squares-2x2",
    category: "selection",
    defaultConfig: {
      name: "checkbox_field",
      label: { de: "Checkboxen", en: "Checkboxes" },
      width: "full",
      config: {
        options: [
          { value: "option1", label: { de: "Option 1", en: "Option 1" } },
          { value: "option2", label: { de: "Option 2", en: "Option 2" } },
        ],
      },
    },
  },

  // ==========================================================================
  // RELATION FIELDS
  // ==========================================================================
  product: {
    type: "product",
    label: "Product",
    description: "Link to a single product from Unchained",
    icon: "shopping-bag",
    category: "relations",
    defaultConfig: {
      name: "product",
      label: { de: "Produkt", en: "Product" },
      width: "full",
    },
  },
  products: {
    type: "products",
    label: "Products",
    description: "Link to multiple products from Unchained",
    icon: "shopping-cart",
    category: "relations",
    defaultConfig: {
      name: "products",
      label: { de: "Produkte", en: "Products" },
      width: "full",
      config: {
        relation: {
          multiple: true,
        },
      },
    },
  },
  page: {
    type: "page",
    label: "Page",
    description: "Link to a CMS page",
    icon: "document",
    category: "relations",
    defaultConfig: {
      name: "page",
      label: { de: "Seite", en: "Page" },
      width: "full",
    },
  },
  collection: {
    type: "collection",
    label: "Collection Entry",
    description: "Link to another collection entry",
    icon: "link",
    category: "relations",
    defaultConfig: {
      name: "related_entry",
      label: { de: "Verknüpfter Eintrag", en: "Related Entry" },
      width: "full",
      config: {
        relation: {
          collectionSlug: "",
          displayField: "title",
          multiple: false,
        },
      },
    },
  },

  // ==========================================================================
  // ADVANCED FIELDS
  // ==========================================================================
  repeater: {
    type: "repeater",
    label: "Repeater",
    description: "Repeatable group of fields",
    icon: "squares-plus",
    category: "advanced",
    defaultConfig: {
      name: "items",
      label: { de: "Einträge", en: "Items" },
      width: "full",
      config: {
        repeater: {
          fields: [],
          minItems: 0,
          maxItems: 10,
          collapsed: false,
        },
      },
    },
  },
  object: {
    type: "object",
    label: "Object",
    description: "Nested object with sub-fields",
    icon: "cube",
    category: "advanced",
    defaultConfig: {
      name: "object_field",
      label: { de: "Objekt", en: "Object" },
      width: "full",
      config: {
        repeater: {
          fields: [],
        },
      },
    },
  },
  json: {
    type: "json",
    label: "JSON",
    description: "Raw JSON editor",
    icon: "code-bracket",
    category: "advanced",
    defaultConfig: {
      name: "json_field",
      label: { de: "JSON", en: "JSON" },
      width: "full",
    },
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get fields by category
 */
export function getFieldsByCategory(category: FieldCategory): FieldTemplate[] {
  return Object.values(fieldRegistry).filter((f) => f.category === category);
}

/**
 * Get all fields grouped by category
 */
export function getAllFieldsByCategory(): Record<FieldCategory, FieldType[]> {
  const result: Record<FieldCategory, FieldType[]> = {
    text: [],
    media: [],
    data: [],
    selection: [],
    relations: [],
    advanced: [],
  };

  for (const [type, template] of Object.entries(fieldRegistry)) {
    result[template.category].push(type as FieldType);
  }

  return result;
}

/**
 * Get a field template by type
 */
export function getFieldTemplate(type: FieldType): FieldTemplate | undefined {
  return fieldRegistry[type];
}

/**
 * Create a new field definition from a template
 */
export function createFieldFromTemplate(
  type: FieldType,
  overrides?: Partial<Omit<FieldDefinition, "id" | "type">>,
): FieldDefinition {
  const template = fieldRegistry[type];
  if (!template) {
    throw new Error(`Unknown field type: ${type}`);
  }

  return {
    id: generateFieldId(),
    type,
    name: overrides?.name || template.defaultConfig.name || type,
    label: overrides?.label ||
      template.defaultConfig.label || { de: type, en: type },
    ...template.defaultConfig,
    ...overrides,
  } as FieldDefinition;
}

/**
 * Get all field types as array
 */
export function getAllFieldTypes(): FieldType[] {
  return Object.keys(fieldRegistry) as FieldType[];
}

/**
 * Check if a field type supports localization
 */
export function fieldSupportsLocalization(type: FieldType): boolean {
  const localizableTypes: FieldType[] = [
    "text",
    "textarea",
    "richtext",
    "markdown",
    "image",
    "gallery",
    "video",
    "file",
  ];
  return localizableTypes.includes(type);
}

/**
 * Get icon for a field type
 */
export function getFieldIcon(type: FieldType): string {
  return fieldRegistry[type]?.icon || "document";
}

/**
 * Validate field configuration
 */
export function validateFieldConfig(field: FieldDefinition): string[] {
  const errors: string[] = [];

  if (!field.name) {
    errors.push("Field name is required");
  } else if (!/^[a-z][a-z0-9_]*$/.test(field.name)) {
    errors.push("Field name must be snake_case (lowercase, start with letter)");
  }

  if (!field.label || Object.keys(field.label).length === 0) {
    errors.push("Field label is required");
  }

  if (!field.type || !fieldRegistry[field.type]) {
    errors.push("Invalid field type");
  }

  // Type-specific validation
  if (
    field.type === "select" ||
    field.type === "multiselect" ||
    field.type === "radio" ||
    field.type === "checkbox"
  ) {
    if (!field.config?.options || field.config.options.length === 0) {
      errors.push("Selection fields require at least one option");
    }
  }

  if (field.type === "collection") {
    if (!field.config?.relation?.collectionSlug) {
      errors.push("Collection field requires a target collection");
    }
  }

  if (field.type === "repeater" || field.type === "object") {
    if (!field.config?.repeater?.fields) {
      errors.push("Repeater/Object fields require sub-fields configuration");
    }
  }

  return errors;
}
