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
    documentation: {
      helpText:
        "Sections are the main building blocks of your page. They act as full-width containers that hold other blocks and can have background colors, images, or gradients. Think of them as horizontal strips that stack vertically to form your page.",
      tips: [
        "Use sections to visually separate different content areas",
        "Add background images with overlays for hero-style sections",
        "Set an anchor ID to create jump links from navigation menus",
        "Choose the right semantic HTML tag (section, article, aside) for better SEO",
      ],
      useCases: [
        "Hero section with background image at the top of a landing page",
        "Alternating light/dark sections to create visual rhythm",
        "Full-width colored banner to highlight promotions",
      ],
      keySettings: [
        {
          name: "Container Width",
          description:
            "Controls how wide the content inside stretches - 'container' for centered content, 'full' for edge-to-edge",
        },
        {
          name: "Anchor ID",
          description:
            "Add an ID like 'about' to link directly to this section with #about URLs",
        },
      ],
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
    documentation: {
      helpText:
        "Columns let you place content side-by-side. Perfect for image + text combinations, feature comparisons, or any layout where you need horizontal arrangement. Columns automatically stack on mobile for better readability.",
      tips: [
        "Use 2 columns for image + text layouts",
        "3 columns work well for feature cards or team members",
        "Adjust the gap to control spacing between columns",
        "Use asymmetric layouts (1/3 + 2/3) for sidebar-style designs",
      ],
      useCases: [
        "Product image on left, description on right",
        "Three feature cards side by side",
        "Contact form next to a map",
      ],
      keySettings: [
        {
          name: "Layout",
          description:
            "Choose equal widths or asymmetric (e.g., 1/3 + 2/3) for different column sizes",
        },
        {
          name: "Gap",
          description: "Space between columns in pixels",
        },
      ],
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
    documentation: {
      helpText:
        "Grid provides advanced CSS Grid layouts for complex designs. Unlike Columns, Grid allows items to span multiple rows and columns, enabling magazine-style layouts, bento boxes, and asymmetric designs. Blocks can be precisely positioned in specific cells.",
      tips: [
        "Use '1fr' units for flexible columns that share space equally",
        "Combine fixed (px) and flexible (fr) units for hybrid layouts",
        "Drag blocks to specific grid cells for precise placement",
        "Items can span multiple columns/rows for featured content",
      ],
      useCases: [
        "Bento-box style feature showcase",
        "Magazine layout with large hero + smaller thumbnails",
        "Dashboard-style widgets of varying sizes",
      ],
      keySettings: [
        {
          name: "Columns/Rows",
          description:
            "Define grid structure using fr (fractional), px, or % units",
        },
        {
          name: "Auto Flow",
          description:
            "How items fill empty cells - 'row' fills left-to-right, 'dense' packs tightly",
        },
      ],
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
    documentation: {
      helpText:
        "Spacer adds empty vertical space between blocks. Use it to create breathing room and visual separation without adding a full section. You can set different heights for desktop and mobile to ensure good proportions on all devices.",
      tips: [
        "Use 48-64px for major content separations",
        "Use 24-32px for minor spacing within sections",
        "Set smaller mobile heights to save screen space on phones",
        "Consider using section padding instead for consistent spacing",
      ],
      useCases: [
        "Add breathing room between a heading and content",
        "Create separation between unrelated blocks in the same section",
        "Push content down for visual balance",
      ],
      keySettings: [
        {
          name: "Height",
          description: "Desktop spacing in pixels",
        },
        {
          name: "Mobile Height",
          description: "Separate height for mobile devices (usually smaller)",
        },
      ],
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
    documentation: {
      helpText:
        "Text block provides rich text editing with formatting options like bold, italic, links, and lists. Click on the text in the preview to edit inline, or use the settings panel for more control. Perfect for paragraphs, descriptions, and any written content.",
      tips: [
        "Double-click text in preview to start inline editing",
        "Use headings (H1-H6) to create hierarchy and improve SEO",
        "Add links by selecting text and clicking the link button",
        "Keep paragraphs short for better readability on mobile",
      ],
      useCases: [
        "Product descriptions and details",
        "About us content and company story",
        "Terms, policies, and legal text",
      ],
      keySettings: [
        {
          name: "Heading Level",
          description:
            "Set as H1-H6 for headings (affects SEO) or P for regular paragraphs",
        },
      ],
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
    documentation: {
      helpText:
        "Display a single image with optional caption and link. Images can be selected from the media library or uploaded directly. Set aspect ratios to maintain consistent proportions, and always add alt text for accessibility and SEO.",
      tips: [
        "Always add descriptive alt text for screen readers and SEO",
        "Use 'cover' fit to fill the container while cropping",
        "Use 'contain' fit to show the entire image without cropping",
        "Add a link to make the image clickable",
      ],
      useCases: [
        "Hero images within columns layout",
        "Illustrative images alongside text content",
        "Clickable banners linking to promotions",
      ],
      keySettings: [
        {
          name: "Aspect Ratio",
          description:
            "Force a specific ratio (16:9, 4:3, square) or use original image dimensions",
        },
        {
          name: "Object Fit",
          description:
            "'Cover' crops to fill, 'contain' fits whole image, 'fill' stretches",
        },
      ],
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
    documentation: {
      helpText:
        "Hero Banner creates impactful full-width banners with large headings, subtext, and call-to-action buttons over background images or colors. Typically used at the top of landing pages to capture attention immediately.",
      tips: [
        "Use high-quality images at least 1920px wide",
        "Add a dark overlay (30-50%) to ensure text readability",
        "Keep headings short and action-oriented",
        "Button text should clearly state what happens when clicked",
      ],
      useCases: [
        "Homepage hero with seasonal campaign",
        "Category landing page header",
        "Sale or promotion announcement",
      ],
      keySettings: [
        {
          name: "Min Height",
          description:
            "Minimum height in pixels - 400-600px typical for heroes",
        },
        {
          name: "Background Overlay",
          description: "Darkens the image to improve text contrast (0-100%)",
        },
      ],
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
    documentation: {
      helpText:
        "Product Grid dynamically displays products from your catalog in a responsive grid layout. Products can be automatically selected (bestsellers, new arrivals) or manually curated. Links directly to product pages.",
      tips: [
        "4 columns on desktop, 2 on mobile is a common setup",
        "Use 'bestselling' or 'newest' for automatic curation",
        "Enable Quick Add for products without variants",
        "Show sale badges to highlight discounted items",
      ],
      useCases: [
        "Featured products on homepage",
        "Related products section",
        "New arrivals or bestsellers showcase",
      ],
      keySettings: [
        {
          name: "Source",
          description:
            "Auto (algorithm-based) or manual (hand-picked products)",
        },
        {
          name: "Sort By",
          description:
            "How to order products: bestselling, newest, price, etc.",
        },
      ],
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
    documentation: {
      helpText:
        "Product Carousel displays products in a horizontally scrollable slider. Users can swipe or click arrows to browse products. Takes less vertical space than a grid while showing more products.",
      tips: [
        "Show arrows for desktop users, dots for mobile orientation",
        "Autoplay can increase engagement but may annoy some users",
        "8-12 products is a good range for carousels",
        "Consider disabling autoplay if products need attention",
      ],
      useCases: [
        "Recently viewed products",
        "You may also like recommendations",
        "Category preview on homepage",
      ],
      keySettings: [
        {
          name: "Auto Play",
          description: "Automatically scroll through products",
        },
        {
          name: "Auto Play Speed",
          description: "Milliseconds between slides when auto-playing",
        },
      ],
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
    documentation: {
      helpText:
        "Category Grid displays product category cards in a visual grid layout. Each card links to its category page, helping users navigate to product listings. Use compelling category images to encourage exploration.",
      tips: [
        "Use high-quality, representative images for each category",
        "3 columns works well for most category counts",
        "Keep category names short and clear",
        "Consider seasonal or featured categories first",
      ],
      useCases: [
        "Shop by category section on homepage",
        "Department navigation",
        "Gift guide categories",
      ],
      keySettings: [
        {
          name: "Category IDs",
          description: "Select which categories to display",
        },
        {
          name: "Layout",
          description: "Grid style or masonry for varied image sizes",
        },
      ],
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
    documentation: {
      helpText:
        "Countdown Timer creates urgency by showing time remaining until a sale, launch, or event ends. Displays days, hours, minutes, and seconds counting down to your target date. Shows a custom message when the countdown expires.",
      tips: [
        "Use for limited-time offers to create urgency",
        "Set a clear expired message explaining what to do next",
        "Pair with a strong CTA button",
        "Don't overuse - too many countdowns reduce effectiveness",
      ],
      useCases: [
        "Flash sale countdown",
        "Product launch timer",
        "Event registration deadline",
      ],
      keySettings: [
        {
          name: "End Date",
          description: "When the countdown reaches zero",
        },
        {
          name: "Expired Message",
          description: "Text shown after countdown ends",
        },
      ],
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
    documentation: {
      helpText:
        "Newsletter block captures email addresses for your mailing list. Includes heading, email input, submit button, and optional GDPR-compliant consent checkbox. Shows success message after submission.",
      tips: [
        "Offer an incentive (discount, free guide) to increase signups",
        "Enable consent checkbox for GDPR compliance in EU",
        "Keep the form simple - just email is usually enough",
        "Place in footer or as a dedicated section",
      ],
      useCases: [
        "Email list building on homepage",
        "Footer newsletter signup",
        "Pop-up or slide-in signup form",
      ],
      keySettings: [
        {
          name: "Show Consent",
          description: "Display GDPR consent checkbox (required in EU)",
        },
        {
          name: "Success Message",
          description: "Text shown after successful subscription",
        },
      ],
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
    documentation: {
      helpText:
        "Promo Bar displays a slim banner for announcements, typically at the very top of the page. Users can dismiss it with a close button. Great for shipping thresholds, sale announcements, or important notices.",
      tips: [
        "Keep message very short - one sentence max",
        "Use contrasting colors to stand out",
        "Make dismissible so users can close it",
        "Include a link if there's a related action",
      ],
      useCases: [
        "Free shipping threshold announcement",
        "Sale or discount notification",
        "Holiday hours or shipping deadlines",
      ],
      keySettings: [
        {
          name: "Dismissible",
          description: "Whether users can close the bar",
        },
        {
          name: "Link",
          description: "Optional URL to make the entire bar clickable",
        },
      ],
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
    documentation: {
      helpText:
        "Testimonials showcase customer reviews and quotes to build trust and social proof. Display in a carousel or grid layout with optional star ratings and customer photos.",
      tips: [
        "Use real customer names and photos when possible",
        "Include specific details that make testimonials believable",
        "Show star ratings to reinforce positive sentiment",
        "3-5 testimonials is ideal for most pages",
      ],
      useCases: [
        "Social proof section on landing pages",
        "Customer success stories",
        "Product review highlights",
      ],
      keySettings: [
        {
          name: "Layout",
          description: "Carousel (scroll through) or grid (show all at once)",
        },
        {
          name: "Show Rating",
          description: "Display star ratings with each testimonial",
        },
      ],
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
    documentation: {
      helpText:
        "Custom HTML lets you add raw HTML and CSS code for widgets, embeds, or custom functionality not covered by other blocks. Use with caution - bad HTML can break your page layout.",
      tips: [
        "Use for third-party embeds (calendars, forms, widgets)",
        "Test thoroughly - HTML isn't validated",
        "Scope CSS to avoid affecting other page elements",
        "Consider security implications of embedded scripts",
      ],
      useCases: [
        "Third-party widget embeds (Calendly, Typeform)",
        "Custom animations or interactive elements",
        "Legacy code that needs to be preserved",
      ],
      keySettings: [
        {
          name: "HTML",
          description: "Raw HTML code to render",
        },
        {
          name: "CSS",
          description: "Scoped CSS styles for the HTML content",
        },
      ],
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
    documentation: {
      helpText:
        "Shoppable Image adds clickable hotspots to lifestyle images, linking to products. When users hover or click on hotspots, they see product details and can add to cart. Great for showing products in context.",
      tips: [
        "Use lifestyle photos showing products in real settings",
        "Place hotspots precisely on each product in the image",
        "Don't overcrowd - 3-5 hotspots per image is ideal",
        "Pulsing hotspots draw attention but can be distracting",
      ],
      useCases: [
        "Shop the look - fashion/outfit images",
        "Room scene with furniture products",
        "Recipe image with ingredient products",
      ],
      keySettings: [
        {
          name: "Show Labels",
          description: "When to show product names: always, on hover, or never",
        },
        {
          name: "Hotspot Style",
          description: "Visual style: pulse animation, static dot, or numbered",
        },
      ],
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
    documentation: {
      helpText:
        "Before/After creates an interactive slider to compare two images. Users can drag the handle to reveal either image. Great for showing transformations, product improvements, or comparing options.",
      tips: [
        "Use images with the same dimensions for best results",
        "Align subjects in both images for dramatic reveals",
        "Set initial position to highlight the most impactful view",
        "Vertical orientation works well for tall subjects",
      ],
      useCases: [
        "Product before/after usage results",
        "Room renovation or makeover reveals",
        "Design iteration comparisons",
      ],
      keySettings: [
        {
          name: "Initial Position",
          description: "Where the slider starts (0-100%, 50% = centered)",
        },
        {
          name: "Orientation",
          description:
            "Horizontal (left/right) or vertical (top/bottom) comparison",
        },
      ],
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
    documentation: {
      helpText:
        "FAQ Accordion displays questions and answers in a collapsible format. Users click to expand answers, keeping the page compact while making information discoverable. Great for support pages and product details.",
      tips: [
        "Keep questions short and scannable",
        "Front-load important FAQs at the top",
        "Use 'allow multiple' to let users open several at once",
        "Adding structured data (FAQ schema) can improve search visibility",
      ],
      useCases: [
        "Product FAQs on detail pages",
        "Shipping and returns information",
        "Support/help center content",
      ],
      keySettings: [
        {
          name: "Allow Multiple",
          description: "Whether users can expand multiple answers at once",
        },
        {
          name: "Default Open First",
          description: "Automatically expand the first question on page load",
        },
      ],
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
    documentation: {
      helpText:
        "Pricing Table displays subscription or product tiers in a side-by-side comparison format. Highlight your recommended tier with a badge. Each tier shows price, features, and a CTA button.",
      tips: [
        "Highlight the tier you want most customers to choose",
        "Use odd number of tiers (3 is ideal) for visual balance",
        "Put the recommended tier in the middle",
        "Keep feature lists scannable with similar lengths",
      ],
      useCases: [
        "SaaS subscription pricing page",
        "Membership tier comparison",
        "Service package options",
      ],
      keySettings: [
        {
          name: "Highlighted",
          description: "Make a tier visually stand out as recommended",
        },
        {
          name: "Badge",
          description: "Label like 'Most Popular' or 'Best Value'",
        },
      ],
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
    documentation: {
      helpText:
        "Stats displays impressive numbers with labels to build credibility and trust. Use large, bold numbers for metrics like customers served, years in business, or satisfaction rates. Numbers draw attention and communicate scale quickly.",
      tips: [
        "Use round numbers (10K vs 9,847) for easier comprehension",
        "Add suffixes like '+' or '%' to add context",
        "4 stats in a row works well for most designs",
        "Choose metrics that matter to your audience",
      ],
      useCases: [
        "Company achievements section",
        "Product performance metrics",
        "Trust indicators (customers, ratings, years)",
      ],
      keySettings: [
        {
          name: "Style",
          description: "Visual style: simple, bordered, or with icons",
        },
        {
          name: "Columns",
          description: "How many stats to show per row",
        },
      ],
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
    documentation: {
      helpText:
        "Logo Cloud displays logos of partners, clients, or press mentions in a row. Builds credibility by showing recognizable brands you work with. Logos can be grayscale for a cohesive, professional look.",
      tips: [
        "Use grayscale to prevent colorful logos from clashing",
        "5-8 logos per row works well visually",
        "Get proper permission to display other brands' logos",
        "Use SVG logos for best quality at any size",
      ],
      useCases: [
        "Featured in press mentions",
        "Client logo showcase",
        "Partnership and integration logos",
      ],
      keySettings: [
        {
          name: "Grayscale",
          description: "Convert all logos to grayscale for visual consistency",
        },
        {
          name: "Show Names",
          description: "Display company names below each logo",
        },
      ],
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
    documentation: {
      helpText:
        "Team Grid showcases your team members with photos, names, roles, and optional bios. Humanizes your brand by putting faces to your company. Can include social media links for each member.",
      tips: [
        "Use consistent photo styles (same background, lighting, crop)",
        "Keep bios brief - 1-2 sentences max",
        "3-4 columns work best for most team sizes",
        "Consider using a Team collection for easier management",
      ],
      useCases: [
        "About us page team showcase",
        "Leadership team on corporate pages",
        "Department or project team introductions",
      ],
      keySettings: [
        {
          name: "Show Bio",
          description: "Display short biography text for each member",
        },
        {
          name: "Show Social",
          description: "Display social media links (LinkedIn, Twitter, etc.)",
        },
      ],
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
    documentation: {
      helpText:
        "Video block embeds videos from YouTube, Vimeo, or your own hosted files. Videos can autoplay (muted), loop, and display custom thumbnails. Great for product demos, tutorials, and brand storytelling.",
      tips: [
        "Use a custom thumbnail for better visual appeal before play",
        "Autoplay only works when video is muted (browser restriction)",
        "16:9 is standard for most videos, use 9:16 for vertical/mobile",
        "Add captions for accessibility and silent browsing",
      ],
      useCases: [
        "Product demonstration videos",
        "Customer testimonial videos",
        "Background video in hero sections (muted, looping)",
      ],
      keySettings: [
        {
          name: "Provider",
          description: "YouTube, Vimeo, or custom (self-hosted) video source",
        },
        {
          name: "Aspect Ratio",
          description:
            "Video dimensions - 16:9 (widescreen), 4:3, 1:1, or 9:16 (vertical)",
        },
      ],
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
    documentation: {
      helpText:
        "Tabs organize related content into switchable panels, keeping the page compact while allowing access to multiple sections. Users click tab headers to switch between content without page reload.",
      tips: [
        "Keep tab labels short (1-2 words)",
        "Use 3-5 tabs maximum to avoid overwhelming users",
        "Put the most important content in the first tab",
        "Each tab content can include rich text formatting",
      ],
      useCases: [
        "Product details (Overview, Specs, Reviews)",
        "Service comparisons",
        "Multi-part content on a single page",
      ],
      keySettings: [
        {
          name: "Variant",
          description: "Visual style: underline, pills, or bordered tabs",
        },
        {
          name: "Default Tab",
          description: "Which tab is shown when the page loads (0 = first tab)",
        },
      ],
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
    documentation: {
      helpText:
        "Feature Grid displays a set of features or benefits with icons, titles, and descriptions in a grid layout. Perfect for highlighting key selling points, service offerings, or product capabilities.",
      tips: [
        "Use consistent, meaningful icons that represent each feature",
        "Keep descriptions to 1-2 sentences",
        "3 or 6 features work best for visual balance",
        "Center alignment works for most designs",
      ],
      useCases: [
        "Product or service benefits overview",
        "Why choose us section",
        "Feature comparison highlights",
      ],
      keySettings: [
        {
          name: "Icon Style",
          description:
            "How icons are displayed: plain, circle background, or outlined",
        },
        {
          name: "Alignment",
          description: "Text alignment within each feature card",
        },
      ],
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
    documentation: {
      helpText:
        "Shoppable Video combines video content with clickable product hotspots that appear at specific timestamps. As products appear in the video, hotspots let viewers shop without leaving the video experience.",
      tips: [
        "Plan product appearances when creating video content",
        "Set hotspots to appear when products are clearly visible",
        "Keep videos short (30-60 seconds) for best engagement",
        "Use muted autoplay for background video effect",
      ],
      useCases: [
        "Product demo videos with buy buttons",
        "Fashion runway with shoppable outfits",
        "Tutorial videos with featured products",
      ],
      keySettings: [
        {
          name: "Show Hotspots",
          description:
            "When hotspots appear: always visible or at specific timestamps",
        },
        {
          name: "Hotspot Style",
          description: "Visual style: tag label, dot, or product card popup",
        },
      ],
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
    documentation: {
      helpText:
        "Size Guide displays a measurement table with unit conversion (cm/inches) and instructions on how to measure. Reduces returns by helping customers choose the right size before purchase.",
      tips: [
        "Include all relevant measurements for your product type",
        "Add 'How to Measure' instructions with an illustration",
        "Enable cm/inch toggle for international customers",
        "Use striped tables for better readability",
      ],
      useCases: [
        "Apparel product pages",
        "Footwear sizing information",
        "Accessories with size variants",
      ],
      keySettings: [
        {
          name: "Unit",
          description: "Default measurement unit: cm or inches",
        },
        {
          name: "Show Unit Toggle",
          description: "Allow users to switch between cm and inches",
        },
      ],
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
    documentation: {
      helpText:
        "Store Locator shows an interactive map with all your physical store locations. Users can search by address or zip code, view store details, get directions, and call stores directly.",
      tips: [
        "Include store hours, phone, and address for each location",
        "Set default center to your primary market",
        "Enable directions link for one-click navigation",
        "Add photos of storefronts for visual recognition",
      ],
      useCases: [
        "Retail store finder page",
        "Service center locations",
        "Dealer/partner locator",
      ],
      keySettings: [
        {
          name: "Default Zoom",
          description: "Initial map zoom level (8-15, higher = closer)",
        },
        {
          name: "List Position",
          description: "Where the store list appears relative to the map",
        },
      ],
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
    documentation: {
      helpText:
        "Instagram Feed pulls in your latest Instagram posts and displays them in a grid or carousel. Connects your social presence to your website and encourages followers. Requires Instagram API access token.",
      tips: [
        "Refresh your access token before it expires (60 days)",
        "Use square aspect ratio for consistent grid appearance",
        "8 posts (2 rows of 4) is a common layout",
        "Enable the follow button to grow your audience",
      ],
      useCases: [
        "Social proof section on homepage",
        "User-generated content showcase",
        "Behind-the-scenes brand content",
      ],
      keySettings: [
        {
          name: "Access Token",
          description:
            "Instagram API token (get from Facebook Developer Portal)",
        },
        {
          name: "Show Caption",
          description: "When to show post captions: always, on hover, or never",
        },
      ],
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
    documentation: {
      helpText:
        "Collection List dynamically displays entries from your custom content collections (Blog, Team, FAQ, etc.). Unlike hardcoded content, collection items are managed separately and automatically appear when published.",
      tips: [
        "Create a collection first, then reference it here",
        "Use link patterns to define how entry URLs are generated",
        "Filter to published only for live pages",
        "Sort by date for blogs, by order for curated lists",
      ],
      useCases: [
        "Blog post listing on homepage",
        "Team member grid from Team collection",
        "Dynamic FAQ from FAQ collection",
      ],
      keySettings: [
        {
          name: "Collection Slug",
          description: "Which collection to pull entries from",
        },
        {
          name: "Link Pattern",
          description: "URL template like /blog/{slug} for entry links",
        },
      ],
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

// Generate a unique ID for items
export const generateItemId = (prefix: string = "item"): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
