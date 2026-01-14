/**
 * Page Builder Types
 * Core type definitions for the visual page builder
 */

// =============================================================================
// LOCALIZATION TYPES
// =============================================================================

/**
 * A string that has translations for multiple locales
 * Example: { de: "Willkommen", fr: "Bienvenue", en: "Welcome" }
 */
export type LocalizedString = Record<string, string>;

/**
 * Block content that has translations for multiple locales
 * Example: { de: { heading: "Willkommen" }, fr: { heading: "Bienvenue" } }
 */
export type LocalizedContent<T = BlockContent> = Record<string, T>;

/**
 * Translation status for a specific locale
 */
export type TranslationStatusValue =
  | "not_started"
  | "in_progress"
  | "completed"
  | "needs_update";

export interface TranslationStatus {
  locale: string;
  status: TranslationStatusValue;
  /** Percentage of fields translated (0-100) */
  completeness: number;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
  /** True if source locale content changed after this translation */
  sourceChangedSince?: boolean;
}

export interface PageTranslations {
  /** The source/master locale (e.g., 'de') */
  sourceLocale: string;
  /** Translation status per locale */
  status: Record<string, TranslationStatus>;
}

/**
 * Localized SEO settings
 */
export interface LocalizedSEOSettings {
  title?: LocalizedString;
  description?: LocalizedString;
  keywords?: LocalizedString;
  ogImage?: LocalizedString;
  noIndex?: boolean;
}

// =============================================================================
// BLOCK TYPES
// =============================================================================

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
  | "before-after"
  | "faq-accordion"
  | "pricing-table"
  | "stats"
  | "logo-cloud"
  | "team-grid"
  | "video"
  | "tabs"
  | "feature-grid"
  | "shoppable-video"
  | "size-guide"
  | "store-locator"
  | "instagram-feed";

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
  /** Focal point for background image (0-100 percentage) */
  backgroundFocalPoint?: { x: number; y: number };
  /** Object fit behavior for background image */
  backgroundObjectFit?: "cover" | "contain" | "fill";
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

export type HeroVariant =
  | "centered"
  | "text-left"
  | "text-right"
  | "split-left"
  | "split-right"
  | "image-grid-right"
  | "image-grid-left";

export type TextOverlayVariant =
  | "none"
  | "gradient"
  | "glass"
  | "solid"
  | "text-shadow";

export type TextOverlayColorMode = "auto" | "dark" | "light";

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
  variant?: HeroVariant;
  /** Image URL for split layouts (separate from background) */
  heroImage?: string;
  /** Focal point for hero image (0-100 percentage) */
  heroImageFocalPoint?: ImageFocalPoint;
  /** Secondary images for image-grid layouts */
  gridImages?: string[];
  /** Focal points for grid images (0-100 percentage each) */
  gridImagesFocalPoints?: (ImageFocalPoint | null)[];
  /** Text overlay variant for readability over images */
  textOverlay?: TextOverlayVariant;
  /** Text overlay intensity (0-100) */
  textOverlayIntensity?: number;
  /** Text overlay color mode */
  textOverlayColorMode?: TextOverlayColorMode;
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
  variant?: string;
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
  variant?: string;
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

export type ImageAspectRatio =
  | "original"
  | "1:1"
  | "4:3"
  | "3:2"
  | "16:9"
  | "21:9"
  | "9:16";

export type ImageObjectFit = "cover" | "contain" | "fill" | "none";

export interface ImageFocalPoint {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

export interface ImageBlockContent {
  src: string;
  alt: string;
  link?: string;
  caption?: string;
  aspectRatio?: ImageAspectRatio;
  objectFit?: ImageObjectFit;
  focalPoint?: ImageFocalPoint;
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
  // Responsive columns per breakpoint
  mobileColumns?: number;
  tabletColumns?: number;
  tabletLgColumns?: number;
  laptopColumns?: number;
  // Layout overrides (optional)
  mobileLayout?: ColumnLayout;
  tabletLayout?: ColumnLayout;
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

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQAccordionContent {
  heading?: string;
  subheading?: string;
  items: FAQItem[];
  allowMultiple: boolean;
  defaultOpenFirst: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
  badge?: string;
}

export interface PricingTableContent {
  heading?: string;
  subheading?: string;
  tiers: PricingTier[];
  columns: 2 | 3 | 4;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface StatsContent {
  heading?: string;
  subheading?: string;
  stats: StatItem[];
  columns: 2 | 3 | 4;
  style: "simple" | "cards" | "bordered";
}

export interface LogoItem {
  id: string;
  name: string;
  image: string;
  link?: string;
}

export interface LogoCloudContent {
  heading?: string;
  logos: LogoItem[];
  columns: 3 | 4 | 5 | 6;
  grayscale: boolean;
  showNames: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface TeamGridContent {
  heading?: string;
  subheading?: string;
  members: TeamMember[];
  columns: 2 | 3 | 4;
  showBio: boolean;
  showSocial: boolean;
}

export interface VideoContent {
  url: string;
  provider: "youtube" | "vimeo" | "custom";
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
  aspectRatio: "16:9" | "4:3" | "1:1" | "9:16";
  thumbnail?: string;
  caption?: string;
}

export interface TabItem {
  id: string;
  label: string;
  content: string;
  icon?: string;
}

export interface TabsContent {
  tabs: TabItem[];
  defaultTab: number;
  variant: "underline" | "pills" | "boxed";
  alignment: "left" | "center" | "stretch";
}

export interface FeatureItem {
  id: string;
  icon?: string;
  title: string;
  description: string;
  link?: string;
}

export interface FeatureGridContent {
  heading?: string;
  subheading?: string;
  features: FeatureItem[];
  columns: 2 | 3 | 4;
  iconStyle: "none" | "circle" | "square" | "rounded";
  alignment: "left" | "center";
}

// E-commerce specific blocks

export interface VideoHotspot {
  id: string;
  productId: string;
  productTitle?: string;
  productImage?: string;
  productPrice?: string;
  /** Timestamp in seconds when the hotspot appears */
  startTime: number;
  /** Timestamp in seconds when the hotspot disappears */
  endTime: number;
  /** Position on video (percentage) */
  position: {
    x: number;
    y: number;
  };
  label?: string;
}

export interface ShoppableVideoContent {
  videoUrl: string;
  provider: "youtube" | "vimeo" | "custom" | "hosted";
  thumbnail?: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
  aspectRatio: "16:9" | "4:3" | "1:1" | "9:16";
  hotspots: VideoHotspot[];
  showHotspots: "always" | "paused" | "never";
  hotspotStyle: "dot" | "plus" | "pulse" | "tag";
  hotspotColor: string;
}

export interface SizeRow {
  id: string;
  size: string;
  measurements: Record<string, string>;
}

export interface SizeGuideContent {
  heading?: string;
  subheading?: string;
  measurementColumns: string[];
  sizes: SizeRow[];
  unit: "cm" | "in";
  showUnitToggle: boolean;
  showHowToMeasure: boolean;
  howToMeasureContent?: string;
  howToMeasureImage?: string;
  tableStyle: "simple" | "striped" | "bordered";
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  email?: string;
  hours?: string;
  lat: number;
  lng: number;
  image?: string;
  features?: string[];
}

export interface StoreLocatorContent {
  heading?: string;
  subheading?: string;
  stores: StoreLocation[];
  defaultZoom: number;
  defaultCenter?: { lat: number; lng: number };
  showSearch: boolean;
  showList: boolean;
  listPosition: "left" | "right" | "bottom";
  mapStyle: "standard" | "silver" | "dark" | "retro";
  markerColor: string;
  showDirectionsLink: boolean;
  showPhoneLink: boolean;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  permalink: string;
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp?: string;
}

export interface InstagramFeedContent {
  heading?: string;
  subheading?: string;
  username: string;
  accessToken?: string;
  posts: InstagramPost[];
  columns: 3 | 4 | 5 | 6;
  mobileColumns: 2 | 3;
  gap: number;
  showCaption: "hover" | "always" | "never";
  limit: number;
  layout: "grid" | "masonry" | "carousel";
  showFollowButton: boolean;
  followButtonText?: string;
  aspectRatio: "square" | "original";
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
  | BeforeAfterContent
  | FAQAccordionContent
  | PricingTableContent
  | StatsContent
  | LogoCloudContent
  | TeamGridContent
  | VideoContent
  | TabsContent
  | FeatureGridContent
  | ShoppableVideoContent
  | SizeGuideContent
  | StoreLocatorContent
  | InstagramFeedContent;

export interface PageBlock {
  id: string;
  type: BlockType;
  /**
   * Localized content for this block.
   * Structure: { locale: { ...content fields } }
   * Example: { de: { heading: "Hallo" }, fr: { heading: "Bonjour" } }
   */
  content: LocalizedContent;
  /** Style is NOT localized - same across all languages */
  style: BlockStyle;
  responsive: ResponsiveOverrides;
  children?: PageBlock[];
  locked?: boolean;
  hidden?: boolean;
}

/**
 * Legacy block format with non-localized content
 * Used for migration from old format
 */
export interface LegacyPageBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  style: BlockStyle;
  responsive: ResponsiveOverrides;
  children?: LegacyPageBlock[];
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

export type PageStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "published"
  | "archived";

/**
 * Workflow metadata for a page
 */
export interface PageWorkflow {
  /** User who submitted for review */
  submittedBy?: string;
  /** When the page was submitted for review */
  submittedAt?: string;
  /** User who reviewed the page */
  reviewedBy?: string;
  /** When the page was reviewed */
  reviewedAt?: string;
  /** Review note (approval/rejection reason) */
  reviewNote?: string;
  /** User who published the page */
  publishedBy?: string;
  /** Future publish date (for scheduled publishing) */
  scheduledFor?: string;
}

export interface Page {
  id: string;
  /** Localized page title */
  title: LocalizedString;
  /** URL slug (not localized - same across languages) */
  slug: string;
  status: PageStatus;
  blocks: PageBlock[];
  /** Localized SEO settings */
  seo: LocalizedSEOSettings;
  /** Translation metadata */
  translations: PageTranslations;
  /** Workflow metadata (review, approval, scheduling) */
  workflow?: PageWorkflow;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  versions: PageVersion[];
}

/**
 * Legacy page format with non-localized content
 * Used for migration from old format
 */
export interface LegacyPage {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  blocks: LegacyPageBlock[];
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
  /** Currently active locale for editing (e.g., 'de', 'fr') */
  activeLocale: string;
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
    payload: {
      blockId: string;
      /**
       * Updates to apply. Content is BlockContent (not LocalizedContent)
       * because the reducer will automatically apply it to the active locale.
       */
      updates: Partial<Omit<PageBlock, "content">> & {
        content?: Partial<BlockContent>;
      };
    };
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
  | { type: "UPDATE_SEO"; payload: Partial<LocalizedSEOSettings> }
  | {
    type: "UPDATE_PAGE_META";
    payload: { title?: LocalizedString; slug?: string; status?: PageStatus };
  }
  | { type: "SET_ACTIVE_LOCALE"; payload: string }
  | {
    type: "UPDATE_TRANSLATION_STATUS";
    payload: { locale: string; status: Partial<TranslationStatus> };
  }
  | {
    type: "COPY_CONTENT_TO_LOCALE";
    payload: { fromLocale: string; toLocale: string };
  };
