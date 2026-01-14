/**
 * Block Renderer
 * Renders the appropriate component for each block type
 */

import React from "react";
import type { PageBlock } from "../../types";
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

interface BlockRendererProps {
  block: PageBlock;
  children?: React.ReactNode;
  isPreview?: boolean;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<PageBlock>) => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  children,
  isPreview = false,
  isSelected = false,
  onUpdate,
}) => {
  const commonProps = {
    block,
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

    default:
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
          Unknown block type: {block.type}
        </div>
      );
  }
};

export default BlockRenderer;
