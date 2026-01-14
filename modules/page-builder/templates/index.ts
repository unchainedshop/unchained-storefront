/**
 * Page Templates
 * Pre-built page layouts users can start from
 */

// Simple block definition for templates (without all required fields)
// These get converted to full PageBlocks when loaded
interface TemplateBlock {
  id: string;
  type: string;
  content?: Record<string, unknown>;
  style?: Record<string, unknown>;
  children?: TemplateBlock[];
}

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: "landing" | "product" | "content" | "marketing";
  thumbnail: string;
  blocks: TemplateBlock[];
}

// Helper to generate unique IDs
const uid = () =>
  `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const pageTemplates: PageTemplate[] = [
  {
    id: "blank",
    name: "Blank Page",
    description: "Start from scratch with an empty canvas",
    category: "content",
    thumbnail: "/templates/blank.svg",
    blocks: [],
  },
  {
    id: "homepage-hero",
    name: "Homepage with Hero",
    description:
      "Classic homepage with hero banner, featured products, and newsletter",
    category: "landing",
    thumbnail: "/templates/homepage-hero.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Welcome to Our Store",
          subheading: "Discover amazing products at unbeatable prices",
          buttonText: "Shop Now",
          buttonLink: "/products",
          secondaryButtonText: "Learn More",
          secondaryButtonLink: "/about",
        },
        style: {
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          minHeight: 500,
          alignmentX: "center",
          alignmentY: "center",
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
        },
      },
      {
        id: uid(),
        type: "product-grid",
        content: {
          heading: "Featured Products",
          source: "auto",
          limit: 4,
          columns: 4,
          mobileColumns: 2,
          showSaleBadge: true,
          showQuickAdd: true,
        },
        style: {
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
      },
      {
        id: uid(),
        type: "newsletter",
        content: {
          heading: "Stay in the Loop",
          subheading: "Subscribe to get special offers and updates",
          buttonText: "Subscribe",
          placeholder: "Enter your email",
          showConsent: true,
        },
        style: {
          backgroundColor: "#f1f5f9",
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
      },
    ],
  },
  {
    id: "product-landing",
    name: "Product Landing",
    description: "Showcase a product with features and testimonials",
    category: "product",
    thumbnail: "/templates/product-landing.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Introducing Our New Product",
          subheading: "The perfect solution for your needs",
          buttonText: "Buy Now",
          buttonLink: "#",
        },
        style: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          minHeight: 450,
          alignmentX: "center",
          alignmentY: "center",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
        },
      },
      {
        id: uid(),
        type: "columns",
        content: {
          columns: 3,
          gap: 32,
          layout: "equal",
        },
        style: {
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
        children: [
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Fast Delivery\n\nGet your order delivered within 2-3 business days.",
              headingLevel: "h3",
            },
            style: {
              alignmentX: "center",
            },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Premium Quality\n\nMade with the finest materials for lasting durability.",
              headingLevel: "h3",
            },
            style: {
              alignmentX: "center",
            },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### 30-Day Returns\n\nNot satisfied? Return it within 30 days for a full refund.",
              headingLevel: "h3",
            },
            style: {
              alignmentX: "center",
            },
          },
        ],
      },
      {
        id: uid(),
        type: "testimonials",
        content: {
          heading: "What Our Customers Say",
          testimonials: [
            {
              quote:
                "This product exceeded my expectations. Highly recommended!",
              author: "Sarah J.",
              role: "Verified Buyer",
            },
            {
              quote: "Amazing quality and fast shipping. Will buy again.",
              author: "Mike T.",
              role: "Verified Buyer",
            },
          ],
        },
        style: {
          backgroundColor: "#f8fafc",
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
      },
    ],
  },
  {
    id: "sale-campaign",
    name: "Sale Campaign",
    description: "Promotional page with countdown and featured deals",
    category: "marketing",
    thumbnail: "/templates/sale-campaign.svg",
    blocks: [
      {
        id: uid(),
        type: "promo-bar",
        content: {
          text: "FREE SHIPPING on orders over $50",
          link: "/products",
        },
        style: {
          backgroundColor: "#dc2626",
          textColor: "#ffffff",
        },
      },
      {
        id: uid(),
        type: "countdown-timer",
        content: {
          heading: "Summer Sale Ends In",
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          buttonText: "Shop the Sale",
          buttonLink: "/sale",
          expiredMessage: "Sale has ended",
        },
        style: {
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
        },
      },
      {
        id: uid(),
        type: "product-grid",
        content: {
          heading: "Top Deals",
          source: "auto",
          limit: 8,
          columns: 4,
          mobileColumns: 2,
          showSaleBadge: true,
        },
        style: {
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
        },
      },
      {
        id: uid(),
        type: "newsletter",
        content: {
          heading: "Get Exclusive Deals",
          subheading: "Be the first to know about our sales",
          buttonText: "Sign Up",
          placeholder: "Your email address",
        },
        style: {
          backgroundColor: "#f1f5f9",
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
        },
      },
    ],
  },
  {
    id: "about-page",
    name: "About Us",
    description: "Tell your brand story with text and images",
    category: "content",
    thumbnail: "/templates/about-page.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Our Story",
          subheading: "Building quality products since 2010",
        },
        style: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          minHeight: 350,
          alignmentX: "center",
          alignmentY: "center",
        },
      },
      {
        id: uid(),
        type: "columns",
        content: {
          columns: 2,
          gap: 48,
          layout: "equal",
        },
        style: {
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
        children: [
          {
            id: uid(),
            type: "image",
            content: {
              src: "",
              alt: "About us image",
              aspectRatio: "4:3",
            },
            style: {
              borderRadius: 12,
            },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "## Who We Are\n\nWe are a passionate team dedicated to creating products that make a difference in people's lives.\n\nFounded in 2010, we've grown from a small startup to a trusted brand serving customers worldwide.\n\nOur mission is simple: deliver exceptional quality at fair prices while treating our customers like family.",
              headingLevel: "h2",
            },
            style: {
              alignmentY: "center",
            },
          },
        ],
      },
      {
        id: uid(),
        type: "text-content",
        content: {
          content: "## Our Values",
          headingLevel: "h2",
        },
        style: {
          alignmentX: "center",
          padding: { top: 32, right: 24, bottom: 16, left: 24 },
        },
      },
      {
        id: uid(),
        type: "columns",
        content: {
          columns: 3,
          gap: 32,
          layout: "equal",
        },
        style: {
          padding: { top: 16, right: 24, bottom: 64, left: 24 },
        },
        children: [
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Quality First\n\nWe never compromise on quality. Every product is crafted with care.",
              headingLevel: "h3",
            },
            style: {
              alignmentX: "center",
            },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Customer Focus\n\nYour satisfaction is our priority. We're here to help 24/7.",
              headingLevel: "h3",
            },
            style: {
              alignmentX: "center",
            },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Sustainability\n\nWe're committed to reducing our environmental footprint.",
              headingLevel: "h3",
            },
            style: {
              alignmentX: "center",
            },
          },
        ],
      },
    ],
  },
  {
    id: "category-landing",
    name: "Category Page",
    description: "Category landing with banner and product grid",
    category: "product",
    thumbnail: "/templates/category-landing.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Shop Collection",
          subheading: "Explore our curated selection",
        },
        style: {
          backgroundColor: "#334155",
          textColor: "#ffffff",
          minHeight: 300,
          alignmentX: "center",
          alignmentY: "center",
        },
      },
      {
        id: uid(),
        type: "product-grid",
        content: {
          source: "collection",
          limit: 12,
          columns: 4,
          mobileColumns: 2,
          showSaleBadge: true,
          showQuickAdd: true,
        },
        style: {
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
        },
      },
    ],
  },
];

export const getTemplateById = (id: string): PageTemplate | undefined => {
  return pageTemplates.find((t) => t.id === id);
};

export const getTemplatesByCategory = (
  category: PageTemplate["category"],
): PageTemplate[] => {
  return pageTemplates.filter((t) => t.category === category);
};
