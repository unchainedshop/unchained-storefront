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
  | "grid"
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
  | "instagram-feed"
  | "collection-list"
  | "freeform-canvas";

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
  /** Custom color for primary button (defaults to textColor) */
  buttonColor?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonVariant?: ButtonVariant;
  /** Custom color for secondary button (defaults to textColor) */
  secondaryButtonColor?: string;
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
  htmlTag?: "section" | "div" | "article" | "aside" | "header" | "footer";
  anchorId?: string;
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

// =============================================================================
// GRID BLOCK TYPES
// =============================================================================

/** Grid cell placement for a child block */
export interface GridCellPlacement {
  /** Starting column (1-indexed, CSS Grid style) */
  colStart: number;
  /** Starting row (1-indexed) */
  rowStart: number;
  /** Number of columns to span (default: 1) */
  colSpan?: number;
  /** Number of rows to span (default: 1) */
  rowSpan?: number;
}

// =============================================================================
// CELL STYLE PRESETS & ANIMATIONS (Revolutionary Grid Features)
// =============================================================================

/** Style preset types for grid cells */
export type CellStylePreset =
  | "none"
  | "glass"
  | "glass-dark"
  | "neumorphic"
  | "gradient"
  | "gradient-radial"
  | "pattern-dots"
  | "pattern-grid"
  | "pattern-noise"
  | "blur";

/** Gradient configuration for cells */
export interface CellGradient {
  from: string;
  to: string;
  via?: string; // Optional middle color
  angle?: number; // For linear gradients (default: 135)
  type?: "linear" | "radial" | "conic";
}

/** Pattern configuration for cells */
export interface CellPattern {
  type: "dots" | "grid" | "lines" | "noise" | "waves" | "crosses";
  color?: string;
  opacity?: number; // 0-100
  size?: number; // Pattern size in px
}

/** Scroll reveal animation types */
export type ScrollRevealType =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "blur"
  | "flip";

/** Scroll animation configuration */
export interface CellScrollAnimation {
  type: ScrollRevealType;
  duration?: number; // ms (default: 600)
  delay?: number; // ms (default: 0)
  easing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "spring";
  /** Trigger threshold (0-1, default: 0.2) */
  threshold?: number;
  /** Only animate once vs every time in view */
  once?: boolean;
}

/** Hover effect types */
export type CellHoverEffect =
  | "none"
  | "lift"
  | "scale"
  | "glow"
  | "darken"
  | "lighten"
  | "border-glow";

/** Cell-specific styling */
export interface GridCellStyle {
  /** Self-alignment within cell */
  justifySelf?: "start" | "center" | "end" | "stretch";
  alignSelf?: "start" | "center" | "end" | "stretch";
  /** Cell-specific background */
  backgroundColor?: string;
  /** Cell-specific padding */
  padding?: { top: number; right: number; bottom: number; left: number };
  /** Z-index for overlapping cells */
  zIndex?: number;

  // === NEW: Style Presets ===
  /** Quick style preset */
  preset?: CellStylePreset;
  /** Custom gradient (overrides preset gradient) */
  gradient?: CellGradient;
  /** Background pattern overlay */
  pattern?: CellPattern;
  /** Blur intensity for glass effect (px) */
  blurIntensity?: number;
  /** Border radius override */
  borderRadius?: number;
  /** Border glow color and intensity */
  borderGlow?: { color: string; intensity: number };
  /** Box shadow override */
  boxShadow?: string;

  // === NEW: Animations ===
  /** Scroll reveal animation */
  scrollAnimation?: CellScrollAnimation;
  /** Hover effect */
  hoverEffect?: CellHoverEffect;
}

/** Child placement metadata (stored in Grid content, NOT in child block) */
export interface GridChildPlacement {
  /** The block ID this placement belongs to */
  blockId: string;
  /** Cell placement information */
  placement: GridCellPlacement;
  /** Cell-specific styling */
  cellStyle?: GridCellStyle;
}

/** Track size types for grid columns/rows */
export type GridTrackSize =
  | `${number}fr`
  | `${number}px`
  | "auto"
  | "min-content"
  | "max-content";

/** Grid template for a breakpoint */
export interface GridTemplate {
  /** Column definitions - e.g., ["1fr", "2fr", "1fr"] */
  columns: GridTrackSize[];
  /** Row definitions - e.g., ["auto", "1fr", "auto"] */
  rows: GridTrackSize[];
}

/** Main grid content */
export interface GridContent {
  /** Grid template for each breakpoint */
  template: {
    desktop: GridTemplate;
    laptop?: GridTemplate;
    tablet?: GridTemplate;
    mobile?: GridTemplate;
  };
  /** Gap between cells (pixels) */
  gap: number;
  /** Row gap if different from column gap */
  rowGap?: number;
  /** Horizontal padding on the sides (pixels) */
  sidePadding?: number;
  /** Child placement metadata - keyed by child block ID */
  childPlacements: GridChildPlacement[];
  /** Auto-flow direction when children exceed explicit placements */
  autoFlow?: "row" | "column" | "dense";
  /** Grid alignment */
  justifyItems?: "start" | "center" | "end" | "stretch";
  alignItems?: "start" | "center" | "end" | "stretch";
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

export interface CollectionListContent {
  /** Collection slug to display entries from */
  collectionSlug: string;
  /** Heading above the list */
  heading?: string;
  /** Subheading/description */
  subheading?: string;
  /** Display layout */
  layout: "grid" | "list" | "cards" | "carousel";
  /** Number of columns (for grid/cards layout) */
  columns: 2 | 3 | 4;
  /** Mobile columns */
  mobileColumns: 1 | 2;
  /** Maximum entries to display */
  limit: number;
  /** Sort field */
  sortBy: "createdAt" | "updatedAt" | "order" | "title";
  /** Sort direction */
  sortOrder: "asc" | "desc";
  /** Only show published entries */
  publishedOnly: boolean;
  /** Fields to display from entries */
  displayFields: string[];
  /** Show entry image (if available) */
  showImage: boolean;
  /** Show entry excerpt/description */
  showExcerpt: boolean;
  /** Show read more link */
  showReadMore: boolean;
  /** Read more button text */
  readMoreText?: string;
  /** Link pattern for entries (e.g., "/blog/{{slug}}") */
  linkPattern?: string;
  /** Gap between items (in pixels) */
  gap: number;
}

// =============================================================================
// FREEFORM CANVAS BLOCK TYPES
// =============================================================================

/** Element type within the freeform canvas */
export type FreeformElementType =
  | "rectangle"
  | "text"
  | "image"
  | "button"
  | "icon";

/** Position and dimensions of a freeform element */
export interface FreeformElementBounds {
  /** X position from left in pixels */
  x: number;
  /** Y position from top in pixels */
  y: number;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Rotation in degrees (optional) */
  rotation?: number;
}

/** Style properties for freeform elements */
export interface FreeformElementStyle {
  /** Background color (supports rgba) */
  backgroundColor?: string;
  /** Background gradient */
  backgroundGradient?: {
    type: "linear" | "radial";
    angle?: number;
    stops: Array<{ color: string; position: number }>;
  };
  /** Border properties */
  border?: {
    width: number;
    color: string;
    style: "solid" | "dashed" | "dotted";
  };
  /** Border radius in pixels */
  borderRadius?: number;
  /** Box shadow */
  boxShadow?: {
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
  };
  /** Opacity (0-1) */
  opacity?: number;
  /** Blur backdrop effect in pixels */
  backdropBlur?: number;
}

/** Text-specific properties */
export interface FreeformTextProps {
  /** Text content (supports basic HTML) */
  content: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font weight */
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  /** Text color */
  color?: string;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
  /** Line height multiplier */
  lineHeight?: number;
  /** Padding inside the text box */
  padding?: number;
}

/** Image-specific properties */
export interface FreeformImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Object fit behavior */
  objectFit?: "cover" | "contain" | "fill";
  /** Focal point for object-fit: cover */
  focalPoint?: { x: number; y: number };
}

/** Button-specific properties */
export interface FreeformButtonProps {
  /** Button label text */
  label: string;
  /** Link URL */
  href?: string;
  /** Button variant */
  variant?: "primary" | "secondary" | "outline" | "ghost";
  /** Text color */
  textColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Font size */
  fontSize?: number;
  /** Padding */
  padding?: { x: number; y: number };
}

/** Icon-specific properties */
export interface FreeformIconProps {
  /** Icon name (from icon set) */
  name: string;
  /** Icon size in pixels */
  size?: number;
  /** Icon color */
  color?: string;
}

/** A single element within the freeform canvas */
export interface FreeformElement {
  /** Unique element ID */
  id: string;
  /** Element type */
  type: FreeformElementType;
  /** Position and dimensions */
  bounds: FreeformElementBounds;
  /** Visual styling */
  style: FreeformElementStyle;
  /** Type-specific properties */
  props:
    | FreeformTextProps
    | FreeformImageProps
    | FreeformButtonProps
    | FreeformIconProps
    | Record<string, never>; // Empty object for rectangle
  /** Z-index for layering */
  zIndex: number;
  /** Whether element is locked from editing */
  locked?: boolean;
  /** Whether element is hidden */
  hidden?: boolean;
  /** Optional name/label for the element */
  name?: string;
}

/** Snap guide configuration */
export interface FreeformSnapConfig {
  /** Snap to other element edges */
  snapToElements: boolean;
  /** Snap to canvas center */
  snapToCenter: boolean;
  /** Snap to grid */
  snapToGrid: boolean;
  /** Grid size in pixels */
  gridSize: number;
  /** Snap threshold in pixels */
  threshold: number;
}

/** Canvas content for the freeform block */
export interface FreeformCanvasContent {
  /** Canvas width in pixels */
  canvasWidth: number;
  /** Canvas height in pixels */
  canvasHeight: number;
  /** Background color of canvas */
  backgroundColor?: string;
  /** Background image of canvas */
  backgroundImage?: string;
  /** All elements on the canvas */
  elements: FreeformElement[];
  /** Snap configuration */
  snapConfig: FreeformSnapConfig;
  /** Whether to show grid in editor */
  showGrid: boolean;
  /** Grid size for display */
  gridSize: number;
  /** Whether canvas should scale responsively */
  responsive: boolean;
  /** Minimum scale factor for responsive mode */
  minScale?: number;
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
  | GridContent
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
  | InstagramFeedContent
  | CollectionListContent
  | FreeformCanvasContent;

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
  | "scheduled"
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
  showSiteFrame: boolean;
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
  /** Currently hovered block ID (for showing toolbar on single block) */
  hoveredBlockId: string | null;
  /** Current error state */
  error: PageBuilderError | null;
  /** Section to focus in settings panel (e.g., 'seo') */
  focusSection: string | null;
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

/** Documentation for a block - provides help text shown in the editor */
export interface BlockDocumentation {
  /** Detailed explanation of what this block does (2-3 sentences) */
  helpText: string;
  /** Quick tips for using the block effectively */
  tips?: string[];
  /** Example use cases to inspire users */
  useCases?: string[];
  /** Settings that are important to understand */
  keySettings?: Array<{
    name: string;
    description: string;
  }>;
}

// Block definition for registry
export interface BlockDefinition {
  type: BlockType;
  label: string;
  description?: string;
  icon: string;
  category:
    | "layout"
    | "content"
    | "collections"
    | "ecommerce"
    | "marketing"
    | "custom";
  defaultContent: BlockContent;
  defaultStyle: BlockStyle;
  allowChildren?: boolean;
  maxChildren?: number;
  /** Nesting rules for this block */
  nesting?: NestingConfig;
  /** Detailed documentation for the block */
  documentation?: BlockDocumentation;
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
  | { type: "TOGGLE_SITE_FRAME"; payload?: boolean }
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
    }
  | { type: "SET_HOVERED_BLOCK"; payload: string | null }
  | { type: "SET_ERROR"; payload: PageBuilderError | null }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_FOCUS_SECTION"; payload: string | null };

// =============================================================================
// ERROR TYPES
// =============================================================================

export type ErrorSeverity = "info" | "warning" | "error";

export type ErrorCode =
  | "SAVE_FAILED"
  | "LOAD_FAILED"
  | "DELETE_FAILED"
  | "DUPLICATE_FAILED"
  | "WORKFLOW_FAILED"
  | "VALIDATION_FAILED"
  | "NETWORK_ERROR"
  | "PERMISSION_DENIED"
  | "CONFLICT"
  | "UNKNOWN";

export interface PageBuilderError {
  code: ErrorCode;
  message: string;
  severity: ErrorSeverity;
  details?: string;
  timestamp: number;
  retryAction?: () => Promise<void>;
}
