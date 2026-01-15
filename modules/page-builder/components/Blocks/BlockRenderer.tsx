/**
 * Block Renderer
 * Renders the appropriate component for each block type
 * Handles content localization by resolving content to active locale
 */

import React, { useMemo, useContext } from "react";
import type { PageBlock, LocalizedContent, BlockContent } from "../../types";
import PageBuilderContext from "../../context/PageBuilderContext";
import { getLocalizedContent } from "../../utils/localization";
import { cmsConfig } from "../../../../lib/cms.config";
import HeroBanner from "./HeroBanner/HeroBanner";
import ProductGrid from "./ProductGrid/ProductGrid";
import ProductCarousel from "./ProductCarousel/ProductCarousel";
import CategoryGrid from "./CategoryGrid/CategoryGrid";
import TextContent from "./TextContent/TextContent";
import ImageBlock from "./ImageBlock/ImageBlock";
import CountdownTimer from "./CountdownTimer/CountdownTimer";
import Newsletter from "./Newsletter/Newsletter";
import PromoBar from "./PromoBar/PromoBar";
import Testimonials from "./Testimonials/Testimonials";
import Spacer from "./Spacer/Spacer";
import CustomHtml from "./CustomHtml/CustomHtml";
import Section from "./Section/Section";
import Columns from "./Columns/Columns";
import Grid from "./Grid/Grid";
import ShoppableImage from "./ShoppableImage/ShoppableImage";
import BeforeAfter from "./BeforeAfter/BeforeAfter";
import FAQAccordion from "./FAQAccordion/FAQAccordion";
import PricingTable from "./PricingTable/PricingTable";
import Stats from "./Stats/Stats";
import LogoCloud from "./LogoCloud/LogoCloud";
import TeamGrid from "./TeamGrid/TeamGrid";
import Video from "./Video/Video";
import Tabs from "./Tabs/Tabs";
import FeatureGrid from "./FeatureGrid/FeatureGrid";
import ShoppableVideo from "./ShoppableVideo/ShoppableVideo";
import SizeGuide from "./SizeGuide/SizeGuide";
import StoreLocator from "./StoreLocator/StoreLocator";
import InstagramFeed from "./InstagramFeed/InstagramFeed";
import CollectionList from "./CollectionList/CollectionList";

/**
 * Resolve a block's localized content to a single locale
 * This creates a "resolved" block that can be used by block components
 * without them needing to know about localization
 */
interface ResolvedPageBlock extends Omit<PageBlock, "content" | "children"> {
  content: BlockContent;
  children?: ResolvedPageBlock[];
}

function resolveBlockContent(
  block: PageBlock,
  locale: string,
  fallbackLocale: string,
): ResolvedPageBlock {
  const localizedContent = block.content as LocalizedContent<BlockContent>;
  const resolvedContent =
    getLocalizedContent(localizedContent, locale, fallbackLocale) ||
    ({} as BlockContent);

  return {
    ...block,
    content: resolvedContent,
    children: block.children?.map((child) =>
      resolveBlockContent(child, locale, fallbackLocale),
    ),
  };
}

interface BlockRendererProps {
  block: PageBlock;
  children?: React.ReactNode;
  isPreview?: boolean;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<PageBlock>) => void;
  locale?: string; // Optional locale for frontend preview (no context)
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  children,
  isPreview = false,
  locale: propLocale,
}) => {
  // Get context (may be null in frontend preview mode)
  const context = useContext(PageBuilderContext);

  // Use locale from: prop > context > default
  const activeLocale =
    propLocale || context?.activeLocale || cmsConfig.defaultLocale;

  // Resolve block content to active locale
  // This converts LocalizedContent to BlockContent for the active locale
  const resolvedBlock = useMemo(
    () => resolveBlockContent(block, activeLocale, cmsConfig.fallbackLocale),
    [block, activeLocale],
  );

  // Use resolved block for rendering - blocks receive plain BlockContent
  const commonProps = {
    block: resolvedBlock as unknown as PageBlock,
    isPreview,
  };

  switch (block.type) {
    case "hero-banner":
      return <HeroBanner {...commonProps} />;

    case "product-grid":
      return <ProductGrid {...commonProps} />;

    case "product-carousel":
      return <ProductCarousel {...commonProps} />;

    case "category-grid":
      return <CategoryGrid {...commonProps} />;

    case "text-content":
      return <TextContent {...commonProps} />;

    case "image":
      return <ImageBlock {...commonProps} />;

    case "countdown-timer":
      return <CountdownTimer {...commonProps} />;

    case "newsletter":
      return <Newsletter {...commonProps} />;

    case "promo-bar":
      return <PromoBar {...commonProps} />;

    case "testimonials":
      return <Testimonials {...commonProps} />;

    case "spacer":
      return <Spacer {...commonProps} />;

    case "custom-html":
      return <CustomHtml {...commonProps} />;

    case "section":
      return <Section {...commonProps}>{children}</Section>;

    case "columns":
      return <Columns {...commonProps}>{children}</Columns>;

    case "grid":
      return <Grid {...commonProps}>{children}</Grid>;

    case "shoppable-image":
      return <ShoppableImage {...commonProps} />;

    case "before-after":
      return <BeforeAfter {...commonProps} />;

    case "faq-accordion":
      return <FAQAccordion {...commonProps} />;

    case "pricing-table":
      return <PricingTable {...commonProps} />;

    case "stats":
      return <Stats {...commonProps} />;

    case "logo-cloud":
      return <LogoCloud {...commonProps} />;

    case "team-grid":
      return <TeamGrid {...commonProps} />;

    case "video":
      return <Video {...commonProps} />;

    case "tabs":
      return <Tabs {...commonProps} />;

    case "feature-grid":
      return <FeatureGrid {...commonProps} />;

    case "shoppable-video":
      return <ShoppableVideo {...commonProps} />;

    case "size-guide":
      return <SizeGuide {...commonProps} />;

    case "store-locator":
      return <StoreLocator {...commonProps} />;

    case "instagram-feed":
      return <InstagramFeed {...commonProps} />;

    case "collection-list":
      return <CollectionList {...commonProps} />;

    default:
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
          Unknown block type: {block.type}
        </div>
      );
  }
};

export default BlockRenderer;
