/**
 * Page Templates
 * Pre-built page layouts users can start from
 */

// Simple block definition for templates
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
  // ============ BLANK ============
  {
    id: "blank",
    name: "Blank Page",
    description: "Start from scratch with an empty canvas",
    category: "content",
    thumbnail: "/templates/blank.svg",
    blocks: [],
  },

  // ============ LANDING PAGES ============
  {
    id: "homepage-modern",
    name: "Modern Homepage",
    description: "Clean split-layout hero with product showcase",
    category: "landing",
    thumbnail: "/templates/homepage-modern.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Crafted for Those Who Appreciate Quality",
          subheading:
            "Discover our curated collection of premium products, designed to elevate your everyday experience.",
          buttonText: "Shop Collection",
          buttonLink: "/shop",
          secondaryButtonText: "Our Story",
          secondaryButtonLink: "/about",
          variant: "split-left",
        },
        style: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          minHeight: 600,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      },
      {
        id: uid(),
        type: "spacer",
        content: { height: 80, mobileHeight: 48 },
        style: {},
      },
      {
        id: uid(),
        type: "text-content",
        content: {
          content: "## Bestsellers",
          headingLevel: "h2",
        },
        style: {
          alignmentX: "center",
          padding: { top: 0, right: 24, bottom: 24, left: 24 },
        },
      },
      {
        id: uid(),
        type: "product-grid",
        content: {
          source: "auto",
          limit: 4,
          columns: 4,
          mobileColumns: 2,
          showSaleBadge: true,
          showQuickAdd: true,
        },
        style: {
          padding: { top: 0, right: 24, bottom: 64, left: 24 },
        },
      },
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "New Season Arrivals",
          subheading: "Fresh styles just landed. Be the first to shop.",
          buttonText: "View New In",
          buttonLink: "/new",
          variant: "split-right",
        },
        style: {
          backgroundColor: "#f8fafc",
          textColor: "#0f172a",
          minHeight: 450,
        },
      },
      {
        id: uid(),
        type: "spacer",
        content: { height: 64, mobileHeight: 48 },
        style: {},
      },
      {
        id: uid(),
        type: "columns",
        content: {
          columns: 3,
          gap: 32,
          layout: "equal",
          stackOnMobile: true,
        },
        style: {
          padding: { top: 0, right: 24, bottom: 64, left: 24 },
        },
        children: [
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Free Shipping\n\nComplimentary delivery on all orders over $75. No code needed.",
            },
            style: { alignmentX: "center" },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Easy Returns\n\n30-day hassle-free returns. We'll cover the shipping both ways.",
            },
            style: { alignmentX: "center" },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Secure Checkout\n\nYour payment info is encrypted and secure. Shop with confidence.",
            },
            style: { alignmentX: "center" },
          },
        ],
      },
      {
        id: uid(),
        type: "newsletter",
        content: {
          heading: "Join the Community",
          subheading:
            "Get 15% off your first order plus exclusive access to new arrivals and special offers.",
          buttonText: "Subscribe",
          placeholder: "Enter your email",
          showConsent: true,
          consentText: "I agree to receive marketing emails",
        },
        style: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
        },
      },
    ],
  },
  {
    id: "homepage-visual",
    name: "Visual Homepage",
    description: "Image-forward design with grid layout hero",
    category: "landing",
    thumbnail: "/templates/homepage-visual.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Spring Collection 2024",
          subheading:
            "Thoughtfully designed. Sustainably made. Built to last.",
          buttonText: "Explore",
          buttonLink: "/collection/spring",
          variant: "image-grid-right",
        },
        style: {
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          minHeight: 550,
        },
      },
      {
        id: uid(),
        type: "spacer",
        content: { height: 64, mobileHeight: 40 },
        style: {},
      },
      {
        id: uid(),
        type: "category-grid",
        content: {
          categoryIds: [],
          columns: 3,
          mobileColumns: 1,
          showTitle: true,
          layout: "grid",
        },
        style: {
          padding: { top: 0, right: 24, bottom: 64, left: 24 },
        },
      },
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Designed Different",
          subheading:
            "We obsess over every detail so you don't have to. From premium materials to precision engineering.",
          buttonText: "Learn More",
          buttonLink: "/about",
          variant: "text-left",
        },
        style: {
          backgroundColor: "#fef3c7",
          textColor: "#1e293b",
          minHeight: 400,
        },
      },
      {
        id: uid(),
        type: "product-carousel",
        content: {
          source: "auto",
          limit: 8,
          autoPlay: false,
          showArrows: true,
          showDots: true,
        },
        style: {
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
      },
      {
        id: uid(),
        type: "testimonials",
        content: {
          testimonials: [
            {
              id: "t1",
              quote:
                "The quality is outstanding. These are the only products I trust for my daily routine.",
              author: "Alexandra M.",
              role: "Verified Customer",
              rating: 5,
            },
            {
              id: "t2",
              quote:
                "Finally found a brand that matches my values. Sustainable, beautiful, and built to last.",
              author: "James K.",
              role: "Verified Customer",
              rating: 5,
            },
            {
              id: "t3",
              quote:
                "Customer service is exceptional. They went above and beyond to make sure I was happy.",
              author: "Sarah L.",
              role: "Verified Customer",
              rating: 5,
            },
          ],
          layout: "carousel",
          showRating: true,
          showAvatar: true,
        },
        style: {
          backgroundColor: "#f8fafc",
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
      },
    ],
  },

  // ============ PRODUCT PAGES ============
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Showcase a new product with features and social proof",
    category: "product",
    thumbnail: "/templates/product-launch.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Introducing the Next Generation",
          subheading:
            "Two years in the making. Every detail refined. This is what perfection looks like.",
          buttonText: "Pre-Order Now",
          buttonLink: "#order",
          buttonVariant: "primary",
          secondaryButtonText: "Watch Video",
          secondaryButtonLink: "#video",
          secondaryButtonVariant: "secondary",
          variant: "split-left",
        },
        style: {
          backgroundColor: "#000000",
          textColor: "#ffffff",
          minHeight: 650,
        },
      },
      {
        id: uid(),
        type: "spacer",
        content: { height: 100, mobileHeight: 60 },
        style: {},
      },
      {
        id: uid(),
        type: "text-content",
        content: {
          content: "## Why You'll Love It",
          headingLevel: "h2",
        },
        style: {
          alignmentX: "center",
          padding: { top: 0, right: 24, bottom: 48, left: 24 },
        },
      },
      {
        id: uid(),
        type: "columns",
        content: {
          columns: 3,
          gap: 48,
          layout: "equal",
          stackOnMobile: true,
        },
        style: {
          padding: { top: 0, right: 48, bottom: 80, left: 48 },
        },
        children: [
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Precision Engineered\n\nEvery component is machined to within 0.01mm tolerance. You can feel the difference the moment you pick it up.",
            },
            style: { alignmentX: "center" },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### All-Day Battery\n\nPowered by our most advanced battery technology yet. 72 hours of continuous use on a single charge.",
            },
            style: { alignmentX: "center" },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Sustainable Materials\n\n100% recycled aluminum body. Carbon-neutral manufacturing. Zero plastic packaging.",
            },
            style: { alignmentX: "center" },
          },
        ],
      },
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "See It In Action",
          subheading: "Real results from real customers who made the switch.",
          buttonText: "View Gallery",
          buttonLink: "#gallery",
          variant: "image-grid-left",
        },
        style: {
          backgroundColor: "#f1f5f9",
          textColor: "#0f172a",
          minHeight: 450,
        },
      },
      {
        id: uid(),
        type: "testimonials",
        content: {
          testimonials: [
            {
              id: "t1",
              quote:
                "This is hands-down the best purchase I've made all year. The build quality is insane.",
              author: "Chris R.",
              role: "Early Adopter",
              rating: 5,
            },
            {
              id: "t2",
              quote:
                "I was skeptical at first, but it completely exceeded my expectations. Worth every penny.",
              author: "Emma T.",
              role: "Beta Tester",
              rating: 5,
            },
          ],
          layout: "grid",
          showRating: true,
          showAvatar: true,
        },
        style: {
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
        },
      },
      {
        id: uid(),
        type: "countdown-timer",
        content: {
          heading: "Limited Launch Pricing Ends",
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          buttonText: "Secure Your Order",
          buttonLink: "#order",
          expiredMessage: "Launch pricing has ended",
        },
        style: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
      },
    ],
  },
  {
    id: "collection-page",
    name: "Collection Page",
    description: "Category landing with hero and product grid",
    category: "product",
    thumbnail: "/templates/collection-page.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "The Essentials Collection",
          subheading:
            "Timeless pieces designed to work together. Build your perfect wardrobe.",
          buttonText: "Shop All",
          buttonLink: "#products",
          variant: "text-left",
        },
        style: {
          backgroundColor: "#292524",
          textColor: "#ffffff",
          minHeight: 400,
        },
      },
      {
        id: uid(),
        type: "spacer",
        content: { height: 48, mobileHeight: 32 },
        style: {},
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
          sortBy: "bestselling",
        },
        style: {
          padding: { top: 0, right: 24, bottom: 64, left: 24 },
        },
      },
      {
        id: uid(),
        type: "newsletter",
        content: {
          heading: "Be the First to Know",
          subheading: "New arrivals and exclusive offers, straight to your inbox.",
          buttonText: "Sign Up",
          placeholder: "Your email",
          showConsent: false,
        },
        style: {
          backgroundColor: "#f5f5f4",
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
      },
    ],
  },

  // ============ MARKETING PAGES ============
  {
    id: "flash-sale",
    name: "Flash Sale",
    description: "Urgent promotional page with countdown timer",
    category: "marketing",
    thumbnail: "/templates/flash-sale.svg",
    blocks: [
      {
        id: uid(),
        type: "promo-bar",
        content: {
          text: "FLASH SALE: Up to 50% off everything. Limited time only!",
          link: "#deals",
          dismissible: false,
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
          heading: "Sale Ends In",
          subheading: "Don't miss out on our biggest sale of the year",
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          buttonText: "Shop Now",
          buttonLink: "#deals",
          expiredMessage: "This sale has ended. Check back for future deals!",
        },
        style: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          padding: { top: 60, right: 24, bottom: 60, left: 24 },
        },
      },
      {
        id: uid(),
        type: "text-content",
        content: {
          content: "## Top Deals",
          headingLevel: "h2",
        },
        style: {
          alignmentX: "center",
          padding: { top: 48, right: 24, bottom: 24, left: 24 },
        },
      },
      {
        id: uid(),
        type: "product-grid",
        content: {
          source: "auto",
          limit: 8,
          columns: 4,
          mobileColumns: 2,
          showSaleBadge: true,
          showQuickAdd: true,
        },
        style: {
          padding: { top: 0, right: 24, bottom: 48, left: 24 },
        },
      },
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Extra 10% Off",
          subheading: "Use code FLASH10 at checkout for an additional discount",
          buttonText: "Copy Code",
          buttonLink: "#",
          variant: "centered",
        },
        style: {
          backgroundColor: "#fef3c7",
          textColor: "#92400e",
          minHeight: 250,
        },
      },
      {
        id: uid(),
        type: "newsletter",
        content: {
          heading: "Never Miss a Sale",
          subheading: "Get early access to exclusive deals and promotions",
          buttonText: "Subscribe",
          placeholder: "Email address",
          showConsent: true,
        },
        style: {
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
      },
    ],
  },
  {
    id: "coming-soon",
    name: "Coming Soon",
    description: "Launch announcement with email capture",
    category: "marketing",
    thumbnail: "/templates/coming-soon.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Something Big Is Coming",
          subheading:
            "We've been working on something special. Be the first to know when we launch.",
          variant: "centered",
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
        type: "countdown-timer",
        content: {
          heading: "Launching In",
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          expiredMessage: "We're live! Explore now.",
        },
        style: {
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
        },
      },
      {
        id: uid(),
        type: "newsletter",
        content: {
          heading: "Get Early Access",
          subheading:
            "Join the waitlist and be the first to experience what we've been building.",
          buttonText: "Join Waitlist",
          placeholder: "Enter your email",
          successMessage: "You're on the list! We'll be in touch soon.",
          showConsent: true,
          consentText: "I agree to receive launch updates via email",
        },
        style: {
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
        },
      },
      {
        id: uid(),
        type: "columns",
        content: {
          columns: 3,
          gap: 32,
          layout: "equal",
          stackOnMobile: true,
        },
        style: {
          backgroundColor: "#f8fafc",
          padding: { top: 64, right: 24, bottom: 64, left: 24 },
        },
        children: [
          {
            id: uid(),
            type: "text-content",
            content: {
              content: "### 10,000+\n\nPeople already on the waitlist",
            },
            style: { alignmentX: "center" },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content: "### 2 Years\n\nIn development and testing",
            },
            style: { alignmentX: "center" },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content: "### $0\n\nDeposit required to join",
            },
            style: { alignmentX: "center" },
          },
        ],
      },
    ],
  },

  // ============ CONTENT PAGES ============
  {
    id: "about-us",
    name: "About Us",
    description: "Tell your brand story with text and imagery",
    category: "content",
    thumbnail: "/templates/about-us.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Our Story",
          subheading: "What started in a garage is now serving customers worldwide",
          variant: "centered",
        },
        style: {
          backgroundColor: "#1c1917",
          textColor: "#ffffff",
          minHeight: 400,
        },
      },
      {
        id: uid(),
        type: "spacer",
        content: { height: 80, mobileHeight: 48 },
        style: {},
      },
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Founded on a Simple Belief",
          subheading:
            "We believe everyone deserves access to beautifully designed, high-quality products. In 2015, we set out to make that a reality.\n\nWhat began as a side project has grown into something much bigger—a community of makers, dreamers, and people who refuse to settle for ordinary.",
          variant: "split-right",
        },
        style: {
          backgroundColor: "#ffffff",
          textColor: "#1e293b",
          minHeight: 450,
        },
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
          padding: { top: 80, right: 24, bottom: 40, left: 24 },
        },
      },
      {
        id: uid(),
        type: "columns",
        content: {
          columns: 3,
          gap: 40,
          layout: "equal",
          stackOnMobile: true,
        },
        style: {
          padding: { top: 0, right: 48, bottom: 80, left: 48 },
        },
        children: [
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Quality Over Quantity\n\nWe'd rather make one thing exceptionally well than a hundred things that are just okay.",
            },
            style: { alignmentX: "center" },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### People First\n\nBehind every order is a real person. We never forget that.",
            },
            style: { alignmentX: "center" },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Constant Improvement\n\nWe're never done learning. Every day is a chance to get better.",
            },
            style: { alignmentX: "center" },
          },
        ],
      },
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "The Team Behind It All",
          subheading:
            "We're a small but mighty team of 12 based in Portland, Oregon. We love what we do, and we hope it shows in every product we ship.",
          variant: "image-grid-right",
        },
        style: {
          backgroundColor: "#f8fafc",
          textColor: "#1e293b",
          minHeight: 400,
        },
      },
      {
        id: uid(),
        type: "newsletter",
        content: {
          heading: "Stay Connected",
          subheading:
            "Join our journey. Get updates on new products and behind-the-scenes stories.",
          buttonText: "Subscribe",
          placeholder: "Your email address",
          showConsent: true,
        },
        style: {
          backgroundColor: "#1c1917",
          textColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
        },
      },
    ],
  },
  {
    id: "contact-page",
    name: "Contact Page",
    description: "Simple contact page with information blocks",
    category: "content",
    thumbnail: "/templates/contact-page.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Get In Touch",
          subheading:
            "Have a question, feedback, or just want to say hello? We'd love to hear from you.",
          variant: "centered",
        },
        style: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          minHeight: 300,
        },
      },
      {
        id: uid(),
        type: "spacer",
        content: { height: 64, mobileHeight: 40 },
        style: {},
      },
      {
        id: uid(),
        type: "columns",
        content: {
          columns: 3,
          gap: 48,
          layout: "equal",
          stackOnMobile: true,
        },
        style: {
          padding: { top: 0, right: 48, bottom: 80, left: 48 },
        },
        children: [
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Email Us\n\nFor general inquiries:\nhello@example.com\n\nFor support:\nsupport@example.com",
            },
            style: { alignmentX: "center" },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Call Us\n\nMon-Fri, 9am-6pm PST:\n+1 (555) 123-4567\n\nWe typically respond within 2 hours.",
            },
            style: { alignmentX: "center" },
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "### Visit Us\n\n123 Main Street\nSuite 456\nPortland, OR 97201",
            },
            style: { alignmentX: "center" },
          },
        ],
      },
      {
        id: uid(),
        type: "text-content",
        content: {
          content:
            "## Frequently Asked Questions\n\nBefore reaching out, you might find your answer below.",
          headingLevel: "h2",
        },
        style: {
          alignmentX: "center",
          padding: { top: 40, right: 24, bottom: 32, left: 24 },
        },
      },
      {
        id: uid(),
        type: "columns",
        content: {
          columns: 2,
          gap: 40,
          layout: "equal",
          stackOnMobile: true,
        },
        style: {
          padding: { top: 0, right: 48, bottom: 80, left: 48 },
        },
        children: [
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "**How long does shipping take?**\n\nDomestic orders typically arrive in 3-5 business days. International shipping varies by location.",
            },
            style: {},
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "**What is your return policy?**\n\nWe offer 30-day hassle-free returns on all unused items in original packaging.",
            },
            style: {},
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "**Do you ship internationally?**\n\nYes! We ship to over 50 countries. Shipping rates are calculated at checkout.",
            },
            style: {},
          },
          {
            id: uid(),
            type: "text-content",
            content: {
              content:
                "**How can I track my order?**\n\nOnce shipped, you'll receive a tracking number via email. You can also check order status in your account.",
            },
            style: {},
          },
        ],
      },
    ],
  },
  {
    id: "lookbook",
    name: "Lookbook",
    description: "Visual storytelling with large imagery",
    category: "content",
    thumbnail: "/templates/lookbook.svg",
    blocks: [
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Summer 2024",
          subheading: "A collection inspired by coastal living",
          variant: "centered",
        },
        style: {
          backgroundColor: "#0c4a6e",
          textColor: "#ffffff",
          minHeight: 500,
        },
      },
      {
        id: uid(),
        type: "spacer",
        content: { height: 80, mobileHeight: 48 },
        style: {},
      },
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Effortless Style",
          subheading:
            "Pieces designed to transition seamlessly from beach to city. Natural fabrics, relaxed silhouettes, timeless appeal.",
          buttonText: "Shop the Look",
          buttonLink: "/collection/summer",
          variant: "split-left",
        },
        style: {
          backgroundColor: "#ffffff",
          textColor: "#1e293b",
          minHeight: 500,
        },
      },
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Sunset Hues",
          subheading:
            "Our palette draws from golden hour—warm terracotta, soft coral, and sun-bleached neutrals.",
          buttonText: "Explore Colors",
          buttonLink: "/collection/colors",
          variant: "split-right",
        },
        style: {
          backgroundColor: "#fff7ed",
          textColor: "#1e293b",
          minHeight: 500,
        },
      },
      {
        id: uid(),
        type: "product-grid",
        content: {
          source: "collection",
          limit: 4,
          columns: 4,
          mobileColumns: 2,
          showSaleBadge: false,
          showQuickAdd: true,
        },
        style: {
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
        },
      },
      {
        id: uid(),
        type: "hero-banner",
        content: {
          heading: "Made to Last",
          subheading:
            "Every piece is crafted from premium, sustainable materials. Because quality never goes out of style.",
          buttonText: "Learn More",
          buttonLink: "/sustainability",
          variant: "image-grid-left",
        },
        style: {
          backgroundColor: "#f5f5f4",
          textColor: "#1e293b",
          minHeight: 450,
        },
      },
      {
        id: uid(),
        type: "newsletter",
        content: {
          heading: "First Access",
          subheading: "Be first to shop new collections and get exclusive offers.",
          buttonText: "Join",
          placeholder: "Email",
          showConsent: false,
        },
        style: {
          backgroundColor: "#0c4a6e",
          textColor: "#ffffff",
          padding: { top: 80, right: 24, bottom: 80, left: 24 },
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
