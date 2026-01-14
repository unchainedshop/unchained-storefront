/**
 * Page Builder Types
 * Core type definitions for the visual page builder
 */

export type BlockType =
  | "hero-banner"
  | "product-grid"
  | "product-carousel"
  | "category-grid"
  | "text-content"
  | "image"
  | "countdown-timer"
  | "newsletter"
  | "promo-bar"
  | "testimonials"
  | "spacer"
  | "custom-html"
  | "section"
  | "columns"
  | "shoppable-image"
  | "before-after";

export type Viewport =
  | "mobile"
  | "tablet"
  | "tablet-lg"
  | "laptop"
  | "desktop"
  | "desktop-lg"
  | "desktop-xl";

// Viewport width configurations
export const VIEWPORT_WIDTHS: Record<Viewport, number> = {
  mobile: 390,
  tablet: 768,
  "tablet-lg": 1024,
  laptop: 1280,
  desktop: 1520,
  "desktop-lg": 1728,
  "desktop-xl": 1920,
};

export type AlignmentX = "left" | "center" | "right";
export type AlignmentY = "top" | "center" | "bottom";

export interface BlockStyle {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundOverlay?: number;
  backgroundOverlayColor?: string;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  borderRadius?: number;
  minHeight?: number;
  maxWidth?: number;
  alignmentX?: AlignmentX;
  alignmentY?: AlignmentY;
  textColor?: string;
  fullWidth?: boolean;
}

export interface ResponsiveOverrides {
  mobile?: Partial<BlockStyle>;
  tablet?: Partial<BlockStyle>;
}

export type ButtonVariant = "primary" | "secondary" | "link";

// Content types for each block
export interface HeroBannerContent {
  heading: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonVariant?: ButtonVariant;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonVariant?: ButtonVariant;
}

export interface ProductGridContent {
  source: "collection" | "manual" | "auto";
  collectionId?: string;
  productIds?: string[];
  limit: number;
  columns: number;
  mobileColumns: number;
  showOutOfStock: boolean;
  showSaleBadge: boolean;
  showQuickAdd: boolean;
  sortBy: "bestselling" | "newest" | "price-asc" | "price-desc" | "manual";
}

export interface ProductCarouselContent {
  source: "collection" | "manual" | "auto";
  collectionId?: string;
  productIds?: string[];
  limit: number;
  autoPlay: boolean;
  autoPlaySpeed: number;
  showArrows: boolean;
  showDots: boolean;
}

export interface CategoryGridContent {
  categoryIds: string[];
  columns: number;
  mobileColumns: number;
  showTitle: boolean;
  layout: "grid" | "masonry";
}

export interface TextContentBlock {
  content: string;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "p";
}

export interface ImageBlockContent {
  src: string;
  alt: string;
  link?: string;
  caption?: string;
  aspectRatio?: "auto" | "1:1" | "4:3" | "16:9" | "21:9";
}

export interface CountdownTimerContent {
  endDate: string;
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
  expiredMessage?: string;
}

export interface NewsletterContent {
  heading: string;
  subheading?: string;
  buttonText: string;
  placeholder: string;
  successMessage: string;
  showConsent: boolean;
  consentText?: string;
}

export interface PromoBarContent {
  text: string;
  link?: string;
  icon?: string;
  dismissible: boolean;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

export interface TestimonialsContent {
  testimonials: TestimonialItem[];
  layout: "carousel" | "grid";
  showRating: boolean;
  showAvatar: boolean;
}

export interface SpacerContent {
  height: number;
  mobileHeight?: number;
}

export interface CustomHtmlContent {
  html: string;
  css?: string;
}

export interface SectionContent {
  containerWidth: "full" | "container" | "narrow";
}

export type ColumnLayout = "equal" | "1-2" | "2-1" | "1-1-1" | "1-2-1";

export interface ColumnsContent {
  columns: number;
  gap: number;
  layout: ColumnLayout;
  // Responsive overrides - mobile stacks by default
  mobileColumns?: number;
  mobileLayout?: ColumnLayout;
  tabletColumns?: number;
  tabletLayout?: ColumnLayout;
  // Whether to stack on mobile (default: true)
  stackOnMobile?: boolean;
}

export interface ProductHotspot {
  id: string;
  productId: string;
  productTitle?: string;
  productImage?: string;
  productPrice?: string;
  position: {
    x: number;
    y: number;
  };
  label?: string;
}

export interface ShoppableImageContent {
  image: string;
  altText: string;
  hotspots: ProductHotspot[];
  showLabels: "always" | "hover" | "never";
  hotspotStyle: "dot" | "plus" | "pulse";
  hotspotColor: string;
}

export interface BeforeAfterContent {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  initialPosition: number;
  orientation: "horizontal" | "vertical";
  showLabels: boolean;
}

export type BlockContent =
  | HeroBannerContent
  | ProductGridContent
  | ProductCarouselContent
  | CategoryGridContent
  | TextContentBlock
  | ImageBlockContent
  | CountdownTimerContent
  | NewsletterContent
  | PromoBarContent
  | TestimonialsContent
  | SpacerContent
  | CustomHtmlContent
  | SectionContent
  | ColumnsContent
  | ShoppableImageContent
  | BeforeAfterContent;

export interface PageBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  style: BlockStyle;
  responsive: ResponsiveOverrides;
  children?: PageBlock[];
  locked?: boolean;
  hidden?: boolean;
}

export interface SEOSettings {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface PageVersion {
  id: string;
  createdAt: string;
  createdBy?: string;
  blocks: PageBlock[];
}

export type PageStatus = "draft" | "published" | "archived";

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  blocks: PageBlock[];
  seo: SEOSettings;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  versions: PageVersion[];
}

// Editor state types
export interface EditorSelection {
  blockId: string | null;
  parentId: string | null;
}

export interface DragState {
  isDragging: boolean;
  draggedBlockId: string | null;
  draggedBlockType: BlockType | null;
  dropTargetId: string | null;
  dropPosition: "before" | "after" | "inside" | null;
}

export type HistoryActionType =
  | "add"
  | "delete"
  | "move"
  | "duplicate"
  | "update"
  | "restore"
  | "initial";

export interface HistoryEntry {
  blocks: PageBlock[];
  timestamp: number;
  action: HistoryActionType;
  label: string;
  blockType?: BlockType;
  blockId?: string;
}

export interface EditorState {
  page: Page | null;
  selection: EditorSelection;
  viewport: Viewport;
  zoom: number;
  showGrid: boolean;
  showOutlines: boolean;
  isDirty: boolean;
  isSaving: boolean;
  isPreviewMode: boolean;
  isFocusMode: boolean;
  dragState: DragState;
  history: HistoryEntry[];
  historyIndex: number;
  sidebarTab: "blocks" | "layers" | "settings" | "history";
}

// Nesting configuration for blocks
export interface NestingConfig {
  /** Whether this block can be nested inside other blocks */
  canBeNested: boolean;
  /** Specific block types this block can be nested inside (empty = any container) */
  allowedParents?: BlockType[];
  /** Specific block types that can be nested inside this block (only if allowChildren is true) */
  allowedChildren?: BlockType[];
  /** Block types that cannot contain this block */
  forbiddenParents?: BlockType[];
}

// Block definition for registry
export interface BlockDefinition {
  type: BlockType;
  label: string;
  description?: string;
  icon: string;
  category: "layout" | "content" | "ecommerce" | "marketing" | "custom";
  defaultContent: BlockContent;
  defaultStyle: BlockStyle;
  allowChildren?: boolean;
  maxChildren?: number;
  /** Nesting rules for this block */
  nesting?: NestingConfig;
}

// Editor actions
export type EditorAction =
  | { type: "SET_PAGE"; payload: Page }
  | {
      type: "SELECT_BLOCK";
      payload: {
        blockId: string | null;
        parentId?: string | null;
        keepTab?: boolean;
      };
    }
  | {
      type: "ADD_BLOCK";
      payload: { block: PageBlock; parentId?: string; position?: number };
    }
  | {
      type: "UPDATE_BLOCK";
      payload: { blockId: string; updates: Partial<PageBlock> };
    }
  | { type: "DELETE_BLOCK"; payload: { blockId: string } }
  | {
      type: "MOVE_BLOCK";
      payload: {
        blockId: string;
        targetId: string;
        position: "before" | "after" | "inside";
      };
    }
  | { type: "DUPLICATE_BLOCK"; payload: { blockId: string } }
  | { type: "SET_VIEWPORT"; payload: Viewport }
  | { type: "SET_ZOOM"; payload: number }
  | { type: "TOGGLE_GRID"; payload?: boolean }
  | { type: "TOGGLE_OUTLINES"; payload?: boolean }
  | { type: "TOGGLE_PREVIEW"; payload?: boolean }
  | { type: "TOGGLE_FOCUS_MODE"; payload?: boolean }
  | {
      type: "SET_SIDEBAR_TAB";
      payload: "blocks" | "layers" | "settings" | "history";
    }
  | { type: "SET_DRAG_STATE"; payload: Partial<DragState> }
  | { type: "UNDO" }
  | { type: "REDO" }
  | {
      type: "SAVE_HISTORY";
      payload: {
        action: HistoryActionType;
        label: string;
        blockType?: BlockType;
        blockId?: string;
      };
    }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "MARK_CLEAN" }
  | { type: "UPDATE_SEO"; payload: Partial<SEOSettings> }
  | {
      type: "UPDATE_PAGE_META";
      payload: { title?: string; slug?: string; status?: PageStatus };
    };
