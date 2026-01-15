/**
 * Hero Banner Presets
 * 10 different hero banner configurations to choose from
 */

export interface HeroPreset {
  id: string;
  name: string;
  description: string;
  preview: string; // CSS gradient or color for preview thumbnail
  content: {
    heading: string;
    subheading: string;
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
  };
  style: {
    minHeight: number;
    padding: { top: number; right: number; bottom: number; left: number };
    alignmentX: "left" | "center" | "right";
    alignmentY: "top" | "center" | "bottom";
    textColor: string;
    backgroundColor?: string;
    backgroundOverlay: number;
    backgroundOverlayColor: string;
  };
}

export const heroPresets: HeroPreset[] = [
  {
    id: "classic-centered",
    name: "Classic Centered",
    description: "Timeless centered layout with bold CTA",
    preview: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    content: {
      heading: "Welcome to Our Store",
      subheading: "Discover amazing products at great prices",
      buttonText: "Shop Now",
      buttonLink: "/shop",
    },
    style: {
      minHeight: 500,
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      alignmentX: "center",
      alignmentY: "center",
      textColor: "#ffffff",
      backgroundOverlay: 40,
      backgroundOverlayColor: "#000000",
    },
  },
  {
    id: "left-aligned",
    name: "Left Aligned",
    description: "Modern left-aligned hero with dual CTAs",
    preview: "linear-gradient(135deg, #a8a29e 0%, #78716c 100%)",
    content: {
      heading: "New Collection",
      subheading: "Explore our latest arrivals and trending styles",
      buttonText: "Explore Now",
      buttonLink: "/new-arrivals",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/about",
    },
    style: {
      minHeight: 600,
      padding: { top: 100, right: 24, bottom: 100, left: 48 },
      alignmentX: "left",
      alignmentY: "center",
      textColor: "#ffffff",
      backgroundOverlay: 50,
      backgroundOverlayColor: "#1e1e1e",
    },
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    description: "Clean dark aesthetic with subtle overlay",
    preview: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
    content: {
      heading: "Less is More",
      subheading: "Premium quality, minimalist design",
      buttonText: "View Collection",
      buttonLink: "/collection",
    },
    style: {
      minHeight: 550,
      padding: { top: 120, right: 24, bottom: 120, left: 24 },
      alignmentX: "center",
      alignmentY: "center",
      textColor: "#ffffff",
      backgroundColor: "#111111",
      backgroundOverlay: 20,
      backgroundOverlayColor: "#000000",
    },
  },
  {
    id: "soft-gradient",
    name: "Soft Gradient",
    description: "Gentle gradient with warm tones",
    preview: "linear-gradient(135deg, #d6d3d1 0%, #a8a29e 50%, #78716c 100%)",
    content: {
      heading: "Summer Sale",
      subheading: "Up to 70% off on selected items",
      buttonText: "Shop Sale",
      buttonLink: "/sale",
      secondaryButtonText: "See All Deals",
      secondaryButtonLink: "/deals",
    },
    style: {
      minHeight: 480,
      padding: { top: 80, right: 24, bottom: 80, left: 24 },
      alignmentX: "center",
      alignmentY: "center",
      textColor: "#1c1917",
      backgroundOverlay: 0,
      backgroundOverlayColor: "#000000",
    },
  },
  {
    id: "split-bottom",
    name: "Bottom Aligned",
    description: "Content anchored to bottom for impact",
    preview: "linear-gradient(180deg, #334155 0%, #1e293b 100%)",
    content: {
      heading: "Discover Excellence",
      subheading: "Crafted with passion, delivered with care",
      buttonText: "Start Shopping",
      buttonLink: "/shop",
    },
    style: {
      minHeight: 650,
      padding: { top: 24, right: 48, bottom: 80, left: 48 },
      alignmentX: "left",
      alignmentY: "bottom",
      textColor: "#ffffff",
      backgroundOverlay: 35,
      backgroundOverlayColor: "#0a0a0a",
    },
  },
  {
    id: "elegant-light",
    name: "Elegant Light",
    description: "Sophisticated light theme with dark text",
    preview: "linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)",
    content: {
      heading: "Timeless Elegance",
      subheading: "Where style meets sophistication",
      buttonText: "Discover",
      buttonLink: "/discover",
    },
    style: {
      minHeight: 520,
      padding: { top: 100, right: 24, bottom: 100, left: 24 },
      alignmentX: "center",
      alignmentY: "center",
      textColor: "#1c1917",
      backgroundOverlay: 10,
      backgroundOverlayColor: "#ffffff",
    },
  },
  {
    id: "muted-right",
    name: "Muted Right",
    description: "Right-aligned for unique layouts",
    preview: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
    content: {
      heading: "Fresh Arrivals",
      subheading: "Be the first to discover our newest products",
      buttonText: "Shop New",
      buttonLink: "/new",
      secondaryButtonText: "View Catalog",
      secondaryButtonLink: "/catalog",
    },
    style: {
      minHeight: 550,
      padding: { top: 80, right: 48, bottom: 80, left: 24 },
      alignmentX: "right",
      alignmentY: "center",
      textColor: "#ffffff",
      backgroundOverlay: 45,
      backgroundOverlayColor: "#0d1117",
    },
  },
  {
    id: "compact-promo",
    name: "Compact Promo",
    description: "Shorter hero for promotional banners",
    preview: "linear-gradient(135deg, #57534e 0%, #44403c 100%)",
    content: {
      heading: "Flash Sale Today",
      subheading: "24 hours only - don't miss out!",
      buttonText: "Shop Now",
      buttonLink: "/flash-sale",
    },
    style: {
      minHeight: 350,
      padding: { top: 60, right: 24, bottom: 60, left: 24 },
      alignmentX: "center",
      alignmentY: "center",
      textColor: "#ffffff",
      backgroundOverlay: 30,
      backgroundOverlayColor: "#000000",
    },
  },
  {
    id: "immersive-tall",
    name: "Immersive Full",
    description: "Full viewport height for maximum impact",
    preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    content: {
      heading: "Experience the Extraordinary",
      subheading: "Premium products for discerning customers",
      buttonText: "Explore",
      buttonLink: "/explore",
      secondaryButtonText: "Our Story",
      secondaryButtonLink: "/story",
    },
    style: {
      minHeight: 700,
      padding: { top: 120, right: 24, bottom: 120, left: 24 },
      alignmentX: "center",
      alignmentY: "center",
      textColor: "#ffffff",
      backgroundOverlay: 50,
      backgroundOverlayColor: "#000000",
    },
  },
  {
    id: "top-aligned",
    name: "Top Aligned",
    description: "Content at top for below-fold emphasis",
    preview: "linear-gradient(135deg, #71717a 0%, #52525b 100%)",
    content: {
      heading: "Welcome Back",
      subheading: "Continue where you left off",
      buttonText: "My Account",
      buttonLink: "/account",
      secondaryButtonText: "Browse All",
      secondaryButtonLink: "/shop",
    },
    style: {
      minHeight: 580,
      padding: { top: 80, right: 24, bottom: 24, left: 24 },
      alignmentX: "center",
      alignmentY: "top",
      textColor: "#ffffff",
      backgroundOverlay: 40,
      backgroundOverlayColor: "#1a1a1a",
    },
  },
];

export const getHeroPreset = (id: string): HeroPreset | undefined => {
  return heroPresets.find((preset) => preset.id === id);
};
