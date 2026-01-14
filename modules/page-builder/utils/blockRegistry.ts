/**
 * Block Registry
 * Defines all available blocks and their default configurations
 */

import type { BlockDefinition, BlockType } from "../types";

export const blockRegistry: Record<BlockType, BlockDefinition> = {
  // Layout blocks
  section: {
    type: "section",
    label: "Section",
    description: "Container for grouping blocks with background styling",
    icon: "rectangle-group",
    category: "layout",
    allowChildren: true,
    defaultContent: {
      containerWidth: "container",
    },
    defaultStyle: {
      padding: { top: 48, right: 24, bottom: 48, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      fullWidth: true,
    },
    nesting: {
      canBeNested: false, // Sections are root-level only
    },
  },

  columns: {
    type: "columns",
    label: "Columns",
    description: "Multi-column layout for side-by-side content",
    icon: "view-columns",
    category: "layout",
    allowChildren: true,
    maxChildren: 4,
    defaultContent: {
      columns: 2,
      gap: 24,
      layout: "equal",
    },
    defaultStyle: {
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: true,
      allowedParents: ["section"], // Columns can only go in sections
      forbiddenParents: ["columns"], // No nested columns
    },
  },

  spacer: {
    type: "spacer",
    label: "Spacer",
    description: "Add vertical spacing between blocks",
    icon: "arrows-up-down",
    category: "layout",
    defaultContent: {
      height: 48,
      mobileHeight: 24,
    },
    defaultStyle: {},
    nesting: {
      canBeNested: true, // Can be placed anywhere
    },
  },

  // Content blocks
  "text-content": {
    type: "text-content",
    label: "Text",
    description: "Rich text with formatting (bold, links, lists)",
    icon: "document-text",
    category: "content",
    defaultContent: {
      content: "<p>Enter your text here...</p>",
      headingLevel: "p",
    },
    defaultStyle: {
      padding: { top: 16, right: 0, bottom: 16, left: 0 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: true, // Can be placed anywhere including columns
    },
  },

  image: {
    type: "image",
    label: "Image",
    description: "Single image with optional link and caption",
    icon: "photo",
    category: "content",
    defaultContent: {
      src: "",
      alt: "",
      aspectRatio: "auto",
    },
    defaultStyle: {
      borderRadius: 8,
    },
    nesting: {
      canBeNested: true, // Can be placed anywhere including columns
    },
  },

  // E-commerce blocks
  "hero-banner": {
    type: "hero-banner",
    label: "Hero Banner",
    description: "Full-width banner with heading, CTA, and background",
    icon: "presentation-chart-bar",
    category: "marketing",
    defaultContent: {
      heading: "Welcome to Our Store",
      subheading: "Discover amazing products at great prices",
      buttonText: "Shop Now",
      buttonLink: "/shop",
    },
    defaultStyle: {
      minHeight: 500,
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      alignmentX: "center",
      alignmentY: "center",
      textColor: "#ffffff",
      backgroundOverlay: 40,
      backgroundOverlayColor: "#000000",
      fullWidth: true,
    },
    nesting: {
      canBeNested: false, // Complex block, root-level only
    },
  },

  "product-grid": {
    type: "product-grid",
    label: "Product Grid",
    description: "Display products in a responsive grid",
    icon: "squares-2x2",
    category: "ecommerce",
    defaultContent: {
      source: "auto",
      limit: 8,
      columns: 4,
      mobileColumns: 2,
      showOutOfStock: true,
      showSaleBadge: true,
      showQuickAdd: false,
      sortBy: "bestselling",
    },
    defaultStyle: {
      padding: { top: 48, right: 24, bottom: 48, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false, // Complex block, root-level only
    },
  },

  "product-carousel": {
    type: "product-carousel",
    label: "Product Carousel",
    description: "Scrollable product showcase",
    icon: "arrows-right-left",
    category: "ecommerce",
    defaultContent: {
      source: "auto",
      limit: 8,
      autoPlay: false,
      autoPlaySpeed: 5000,
      showArrows: true,
      showDots: true,
    },
    defaultStyle: {
      padding: { top: 48, right: 24, bottom: 48, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false, // Complex block, root-level only
    },
  },

  "category-grid": {
    type: "category-grid",
    label: "Category Grid",
    description: "Display category cards in a grid",
    icon: "folder",
    category: "ecommerce",
    defaultContent: {
      categoryIds: [],
      columns: 3,
      mobileColumns: 1,
      showTitle: true,
      layout: "grid",
    },
    defaultStyle: {
      padding: { top: 48, right: 24, bottom: 48, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false, // Complex block, root-level only
    },
  },

  // Marketing blocks
  "countdown-timer": {
    type: "countdown-timer",
    label: "Countdown",
    description: "Countdown timer for sales and promotions",
    icon: "clock",
    category: "marketing",
    defaultContent: {
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      heading: "Flash Sale Ends In",
      buttonText: "Shop the Sale",
      buttonLink: "/shop",
      expiredMessage: "Sale has ended",
    },
    defaultStyle: {
      padding: { top: 48, right: 24, bottom: 48, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      alignmentX: "center",
      backgroundColor: "#1e293b",
      textColor: "#ffffff",
    },
    nesting: {
      canBeNested: false, // Complex block, root-level only
    },
  },

  newsletter: {
    type: "newsletter",
    label: "Newsletter",
    description: "Email signup form with consent",
    icon: "envelope",
    category: "marketing",
    defaultContent: {
      heading: "Subscribe & Save 10%",
      subheading: "Join our newsletter for exclusive deals",
      buttonText: "Subscribe",
      placeholder: "Enter your email",
      successMessage: "Thank you for subscribing!",
      showConsent: true,
      consentText: "I agree to receive marketing emails",
    },
    defaultStyle: {
      padding: { top: 64, right: 24, bottom: 64, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      alignmentX: "center",
      backgroundColor: "#f1f5f9",
    },
    nesting: {
      canBeNested: false, // Complex block, root-level only
    },
  },

  "promo-bar": {
    type: "promo-bar",
    label: "Promo Bar",
    description: "Dismissible promotional banner",
    icon: "megaphone",
    category: "marketing",
    defaultContent: {
      text: "Free shipping on orders over $100",
      dismissible: true,
    },
    defaultStyle: {
      padding: { top: 12, right: 24, bottom: 12, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      backgroundColor: "#1e293b",
      textColor: "#ffffff",
      alignmentX: "center",
      fullWidth: true,
    },
    nesting: {
      canBeNested: false, // Complex block, root-level only
    },
  },

  testimonials: {
    type: "testimonials",
    label: "Testimonials",
    description: "Customer reviews and testimonials",
    icon: "chat-bubble-left-right",
    category: "marketing",
    defaultContent: {
      testimonials: [
        {
          id: "1",
          quote: "Amazing products and fast shipping!",
          author: "Jane Doe",
          role: "Verified Customer",
          rating: 5,
        },
        {
          id: "2",
          quote: "Great customer service and quality items.",
          author: "John Smith",
          role: "Verified Customer",
          rating: 5,
        },
      ],
      layout: "carousel",
      showRating: true,
      showAvatar: true,
    },
    defaultStyle: {
      padding: { top: 64, right: 24, bottom: 64, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      backgroundColor: "#ffffff",
    },
    nesting: {
      canBeNested: false, // Complex block, root-level only
    },
  },

  // Custom blocks
  "custom-html": {
    type: "custom-html",
    label: "Custom HTML",
    description: "Custom HTML and CSS code",
    icon: "code-bracket",
    category: "custom",
    defaultContent: {
      html: "<div>Custom HTML content</div>",
      css: "",
    },
    defaultStyle: {
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: true, // Can be placed anywhere for flexibility
    },
  },

  // Interactive commerce blocks
  "shoppable-image": {
    type: "shoppable-image",
    label: "Shoppable Image",
    description: "Lifestyle image with clickable product hotspots",
    icon: "cursor-arrow-rays",
    category: "ecommerce",
    defaultContent: {
      image: "",
      altText: "",
      hotspots: [],
      showLabels: "hover",
      hotspotStyle: "pulse",
      hotspotColor: "#ffffff",
    },
    defaultStyle: {
      borderRadius: 8,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: true,
    },
  },

  "before-after": {
    type: "before-after",
    label: "Before/After",
    description: "Image comparison slider",
    icon: "arrows-right-left",
    category: "content",
    defaultContent: {
      beforeImage: "",
      afterImage: "",
      beforeLabel: "Before",
      afterLabel: "After",
      initialPosition: 50,
      orientation: "horizontal",
      showLabels: true,
    },
    defaultStyle: {
      borderRadius: 8,
      maxWidth: 800,
      alignmentX: "center",
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: true,
    },
  },
};

export const blockCategories = [
  { id: "layout", label: "Layout", icon: "view-columns" },
  { id: "content", label: "Content", icon: "document-text" },
  { id: "ecommerce", label: "E-Commerce", icon: "shopping-bag" },
  { id: "marketing", label: "Marketing", icon: "megaphone" },
  { id: "custom", label: "Custom", icon: "code-bracket" },
] as const;

export const getBlocksByCategory = (category: BlockDefinition["category"]) => {
  return Object.values(blockRegistry).filter(
    (block) => block.category === category,
  );
};

export const getBlockDefinition = (
  type: BlockType,
): BlockDefinition | undefined => {
  return blockRegistry[type];
};

export const createBlock = (
  type: BlockType,
  overrides?: Partial<{ content: any; style: any }>,
): {
  id: string;
  type: BlockType;
  content: any;
  style: any;
  responsive: { mobile?: any; tablet?: any };
  children?: any[];
} => {
  const definition = blockRegistry[type];
  if (!definition) {
    throw new Error(`Unknown block type: ${type}`);
  }

  return {
    id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    content: { ...definition.defaultContent, ...overrides?.content },
    style: { ...definition.defaultStyle, ...overrides?.style },
    responsive: {},
    children: definition.allowChildren ? [] : undefined,
  };
};
