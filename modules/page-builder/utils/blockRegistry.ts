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

  grid: {
    type: "grid",
    label: "Grid",
    description: "CSS Grid layout with precise cell placement and spanning",
    icon: "table-cells",
    category: "layout",
    allowChildren: true,
    maxChildren: 12,
    defaultContent: {
      template: {
        desktop: {
          columns: ["1fr", "1fr"],
          rows: ["1fr"],
        },
      },
      gap: 24,
      childPlacements: [],
      autoFlow: "row",
      justifyItems: "stretch",
      alignItems: "stretch",
    },
    defaultStyle: {
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      minHeight: 300,
    },
    nesting: {
      canBeNested: true,
      allowedParents: ["section"], // Grids can only go in sections
      forbiddenParents: ["columns", "grid"], // No nested grids or inside columns
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
      aspectRatio: "original",
      objectFit: "cover",
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

  // New blocks
  "faq-accordion": {
    type: "faq-accordion",
    label: "FAQ Accordion",
    description: "Expandable Q&A sections",
    icon: "question-mark-circle",
    category: "content",
    defaultContent: {
      heading: "Frequently Asked Questions",
      subheading: "",
      items: [
        {
          id: "faq_1",
          question: "What is your return policy?",
          answer: "We offer a 30-day hassle-free return policy on all items.",
        },
        {
          id: "faq_2",
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 3-5 business days. Express shipping is available.",
        },
      ],
      allowMultiple: false,
      defaultOpenFirst: true,
    },
    defaultStyle: {
      padding: { top: 64, right: 24, bottom: 64, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },

  "pricing-table": {
    type: "pricing-table",
    label: "Pricing Table",
    description: "Compare pricing tiers with features",
    icon: "currency-dollar",
    category: "marketing",
    defaultContent: {
      heading: "Simple, Transparent Pricing",
      subheading: "Choose the plan that works for you",
      columns: 3,
      tiers: [
        {
          id: "tier_1",
          name: "Starter",
          price: "$9",
          period: "month",
          description: "Perfect for getting started",
          features: ["5 projects", "Basic support", "1GB storage"],
          buttonText: "Get Started",
          buttonLink: "#",
        },
        {
          id: "tier_2",
          name: "Pro",
          price: "$29",
          period: "month",
          description: "Best for growing teams",
          features: [
            "Unlimited projects",
            "Priority support",
            "10GB storage",
            "Advanced analytics",
          ],
          buttonText: "Start Free Trial",
          buttonLink: "#",
          highlighted: true,
          badge: "Most Popular",
        },
        {
          id: "tier_3",
          name: "Enterprise",
          price: "$99",
          period: "month",
          description: "For large organizations",
          features: [
            "Everything in Pro",
            "Custom integrations",
            "Dedicated support",
            "SLA guarantee",
          ],
          buttonText: "Contact Sales",
          buttonLink: "#",
        },
      ],
    },
    defaultStyle: {
      padding: { top: 64, right: 24, bottom: 64, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },

  stats: {
    type: "stats",
    label: "Stats",
    description: "Display metrics with big numbers",
    icon: "chart-bar",
    category: "content",
    defaultContent: {
      heading: "",
      subheading: "",
      columns: 4,
      style: "simple",
      stats: [
        { id: "stat_1", value: "10K", label: "Customers", suffix: "+" },
        { id: "stat_2", value: "99", label: "Uptime", suffix: "%" },
        { id: "stat_3", value: "24", label: "Support", suffix: "/7" },
        { id: "stat_4", value: "50", label: "Countries", suffix: "+" },
      ],
    },
    defaultStyle: {
      padding: { top: 64, right: 24, bottom: 64, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },

  "logo-cloud": {
    type: "logo-cloud",
    label: "Logo Cloud",
    description: "Display partner or press logos",
    icon: "building-office",
    category: "marketing",
    defaultContent: {
      heading: "Trusted by leading companies",
      columns: 5,
      grayscale: true,
      showNames: false,
      logos: [],
    },
    defaultStyle: {
      padding: { top: 48, right: 24, bottom: 48, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },

  "team-grid": {
    type: "team-grid",
    label: "Team Grid",
    description: "Display team members with photos",
    icon: "user-group",
    category: "content",
    defaultContent: {
      heading: "Meet Our Team",
      subheading: "The people behind the product",
      columns: 3,
      showBio: true,
      showSocial: true,
      members: [],
    },
    defaultStyle: {
      padding: { top: 64, right: 24, bottom: 64, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },

  video: {
    type: "video",
    label: "Video",
    description: "Embed YouTube, Vimeo, or custom video",
    icon: "play",
    category: "content",
    defaultContent: {
      url: "",
      provider: "youtube",
      autoplay: false,
      muted: false,
      loop: false,
      controls: true,
      aspectRatio: "16:9",
      thumbnail: "",
      caption: "",
    },
    defaultStyle: {
      borderRadius: 12,
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: true,
    },
  },

  tabs: {
    type: "tabs",
    label: "Tabs",
    description: "Tabbed content sections",
    icon: "rectangle-stack",
    category: "content",
    defaultContent: {
      defaultTab: 0,
      variant: "underline",
      alignment: "left",
      tabs: [
        {
          id: "tab_1",
          label: "Overview",
          content: "This is the overview content.",
        },
        {
          id: "tab_2",
          label: "Features",
          content: "This is the features content.",
        },
        { id: "tab_3", label: "Specs", content: "This is the specs content." },
      ],
    },
    defaultStyle: {
      padding: { top: 48, right: 24, bottom: 48, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },

  "feature-grid": {
    type: "feature-grid",
    label: "Feature Grid",
    description: "Icon + title + description cards",
    icon: "squares-plus",
    category: "content",
    defaultContent: {
      heading: "Why Choose Us",
      subheading: "Everything you need to succeed",
      columns: 3,
      iconStyle: "circle",
      alignment: "center",
      features: [
        {
          id: "feat_1",
          icon: "bolt",
          title: "Lightning Fast",
          description: "Optimized for speed and performance.",
        },
        {
          id: "feat_2",
          icon: "shield-check",
          title: "Secure by Default",
          description: "Enterprise-grade security built in.",
        },
        {
          id: "feat_3",
          icon: "sparkles",
          title: "Easy to Use",
          description: "Intuitive interface for everyone.",
        },
      ],
    },
    defaultStyle: {
      padding: { top: 64, right: 24, bottom: 64, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },

  // E-commerce specific blocks
  "shoppable-video": {
    type: "shoppable-video",
    label: "Shoppable Video",
    description: "Video with clickable product hotspots at timestamps",
    icon: "video-camera",
    category: "ecommerce",
    defaultContent: {
      videoUrl: "",
      provider: "custom",
      thumbnail: "",
      autoplay: false,
      muted: true,
      loop: true,
      controls: true,
      aspectRatio: "16:9",
      hotspots: [],
      showHotspots: "always",
      hotspotStyle: "tag",
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

  "size-guide": {
    type: "size-guide",
    label: "Size Guide",
    description: "Interactive size chart with measurement table",
    icon: "table-cells",
    category: "ecommerce",
    defaultContent: {
      heading: "Size Guide",
      subheading: "Find your perfect fit",
      measurementColumns: ["Chest", "Waist", "Hips", "Length"],
      sizes: [
        {
          id: "size_xs",
          size: "XS",
          measurements: { Chest: "86", Waist: "71", Hips: "91", Length: "66" },
        },
        {
          id: "size_s",
          size: "S",
          measurements: { Chest: "91", Waist: "76", Hips: "96", Length: "68" },
        },
        {
          id: "size_m",
          size: "M",
          measurements: { Chest: "97", Waist: "81", Hips: "102", Length: "70" },
        },
        {
          id: "size_l",
          size: "L",
          measurements: {
            Chest: "102",
            Waist: "86",
            Hips: "107",
            Length: "72",
          },
        },
        {
          id: "size_xl",
          size: "XL",
          measurements: {
            Chest: "107",
            Waist: "91",
            Hips: "112",
            Length: "74",
          },
        },
      ],
      unit: "cm",
      showUnitToggle: true,
      showHowToMeasure: true,
      howToMeasureContent:
        "<p><strong>Chest:</strong> Measure around the fullest part of your chest.</p><p><strong>Waist:</strong> Measure around your natural waistline.</p><p><strong>Hips:</strong> Measure around the fullest part of your hips.</p>",
      howToMeasureImage: "",
      tableStyle: "striped",
    },
    defaultStyle: {
      padding: { top: 48, right: 24, bottom: 48, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },

  "store-locator": {
    type: "store-locator",
    label: "Store Locator",
    description: "Interactive map with store locations and search",
    icon: "map-pin",
    category: "ecommerce",
    defaultContent: {
      heading: "Find a Store",
      subheading: "Visit us in person",
      stores: [],
      defaultZoom: 12,
      defaultCenter: { lat: 40.7128, lng: -74.006 },
      showSearch: true,
      showList: true,
      listPosition: "left",
      mapStyle: "standard",
      markerColor: "#3B82F6",
      showDirectionsLink: true,
      showPhoneLink: true,
    },
    defaultStyle: {
      padding: { top: 48, right: 24, bottom: 48, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },

  "instagram-feed": {
    type: "instagram-feed",
    label: "Instagram Feed",
    description: "Display Instagram posts in a grid or carousel",
    icon: "camera",
    category: "ecommerce",
    defaultContent: {
      heading: "Follow Us on Instagram",
      subheading: "",
      username: "",
      accessToken: "",
      posts: [],
      columns: 4,
      mobileColumns: 2,
      gap: 8,
      showCaption: "hover",
      limit: 8,
      layout: "grid",
      showFollowButton: true,
      followButtonText: "",
      aspectRatio: "square",
    },
    defaultStyle: {
      padding: { top: 48, right: 24, bottom: 48, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },

  "collection-list": {
    type: "collection-list",
    label: "Collection List",
    description:
      "Display entries from a content collection (Blog, FAQ, Team, etc.)",
    icon: "rectangle-stack",
    category: "collections",
    defaultContent: {
      collectionSlug: "",
      heading: "",
      subheading: "",
      layout: "grid",
      columns: 3,
      mobileColumns: 1,
      limit: 6,
      sortBy: "createdAt",
      sortOrder: "desc",
      publishedOnly: true,
      displayFields: [],
      showImage: true,
      showExcerpt: true,
      showReadMore: true,
      readMoreText: "Read more",
      linkPattern: "",
      gap: 24,
    },
    defaultStyle: {
      padding: { top: 64, right: 24, bottom: 64, left: 24 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    nesting: {
      canBeNested: false,
    },
  },
};

export const blockCategories = [
  { id: "layout", label: "Layout", icon: "view-columns" },
  { id: "content", label: "Content", icon: "document-text" },
  { id: "collections", label: "Collections", icon: "rectangle-stack" },
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
    id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    type,
    content: { ...definition.defaultContent, ...overrides?.content },
    style: { ...definition.defaultStyle, ...overrides?.style },
    responsive: {},
    children: definition.allowChildren ? [] : undefined,
  };
};
