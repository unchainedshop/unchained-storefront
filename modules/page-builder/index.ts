/**
 * Page Builder Module
 * Visual page editor for e-commerce storefronts
 */

// Main components
export { default as PageBuilder } from "./components/PageBuilder";
export { default as BlockRenderer } from "./components/Blocks/BlockRenderer";
export { default as PageRenderer } from "./components/Preview/PageRenderer";

// Context
export {
  PageBuilderProvider,
  usePageBuilder,
} from "./context/PageBuilderContext";

// Hooks
export { useDragDrop } from "./hooks/useDragDrop";

// Utils
export {
  blockRegistry,
  blockCategories,
  getBlocksByCategory,
  getBlockDefinition,
  createBlock,
} from "./utils/blockRegistry";

// Storage (server-side only)
export * from "./utils/pageStorage";
export * from "./utils/gitHistory";

// Types
export type {
  Page,
  PageBlock,
  PageStatus,
  PageVersion,
  BlockType,
  BlockStyle,
  BlockContent,
  BlockDefinition,
  Viewport,
  EditorState,
  EditorAction,
  SEOSettings,
  // Content types
  HeroBannerContent,
  ProductGridContent,
  ProductCarouselContent,
  CategoryGridContent,
  TextContentBlock,
  ImageBlockContent,
  CountdownTimerContent,
  NewsletterContent,
  PromoBarContent,
  TestimonialsContent,
  SpacerContent,
  CustomHtmlContent,
  SectionContent,
  ColumnsContent,
} from "./types";
