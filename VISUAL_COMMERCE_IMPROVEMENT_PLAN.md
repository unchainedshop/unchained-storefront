# Visual Content & Commerce Editing - Improvement Plan

> Generated: January 2026
> Based on industry research and codebase analysis

## Executive Summary

This plan outlines strategic improvements to the visual content and commerce editing capabilities of the Unchained Storefront. Recommendations are based on 2025-2026 visual commerce trends and analysis of the existing page builder and media management systems.

---

## Current State Analysis

### Existing Capabilities

#### Page Builder (`modules/page-builder/`)
- **14 block types** across 5 categories (Layout, Content, E-Commerce, Marketing, Custom)
- **Drag-and-drop editing** with `@dnd-kit` library
- **Real-time collaboration** via Yjs + WebSocket
- **Version history** with Git integration
- **Responsive preview** (mobile, tablet, desktop viewports)
- **Block nesting rules** with validation
- **Settings panel** with content, style, and advanced tabs

#### Media Management (`modules/media/`)
- **File-based DAM** with JSON index
- **Upload support** for images, video, documents, audio (50MB max)
- **Automatic thumbnail generation** (300x300px)
- **Folder organization** with date-based structure
- **Metadata management** (alt text, title, description, tags)
- **Search and filtering** by type, tags, filename
- **Usage tracking** across the site

#### Product Display (`modules/products/`)
- **Image gallery** with `react-image-gallery`
- **Grid and compact list views**
- **Bundle product visualization**
- **Star ratings** with half-star support
- **Customer reviews** section

### Identified Gaps

| Gap | Industry Trend | Business Impact |
|-----|---------------|-----------------|
| No AI-assisted editing | 40% cost reduction with AI workflows | High |
| No 3D/AR visualization | 5% reduction in returns with AR | High |
| Limited video support | 88% increase in time-on-page with video | High |
| No inline image editing | Expected standard in modern DAMs | Medium |
| No shoppable images | Social commerce driving impulse purchases | Medium |
| No automated optimization | Performance affects 20% of conversions | Medium |
| No personalization | Market growing to $2.41B by 2033 | Lower |

---

## Improvement Roadmap

### Phase 1: Foundation (Weeks 1-4)

#### 1.1 Inline Image Editor

Add non-destructive editing directly in the media manager.

**Features:**
```
┌─────────────────────────────────────────────────────────────┐
│  Crop & Resize     │  Adjustments      │  Overlays         │
├────────────────────┼───────────────────┼───────────────────┤
│  • Aspect ratios   │  • Brightness     │  • Text overlay   │
│    - 1:1 (square)  │  • Contrast       │  • Watermarks     │
│    - 4:3           │  • Saturation     │  • Sale badges    │
│    - 16:9          │  • White balance  │  • "New" badges   │
│    - 21:9          │  • Exposure       │  • Borders        │
│  • Free crop       │  • Highlights     │  • Rounded corners│
│  • Focal point     │  • Shadows        │                   │
└────────────────────┴───────────────────┴───────────────────┘
```

**Technical Implementation:**

```typescript
// modules/media/types/index.ts - Extend MediaAsset
interface ImageEdits {
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
    aspectRatio?: string;
  };
  focalPoint?: { x: number; y: number };
  adjustments?: {
    brightness: number;    // -100 to 100
    contrast: number;      // -100 to 100
    saturation: number;    // -100 to 100
    exposure: number;      // -100 to 100
  };
  overlays?: Array<{
    type: 'text' | 'badge' | 'watermark';
    content: string;
    position: { x: number; y: number };
    style: Record<string, string>;
  }>;
}

interface MediaAsset {
  // ... existing fields
  edits?: ImageEdits;           // Non-destructive edit parameters
  variants?: MediaVariant[];     // Generated variants
}

interface MediaVariant {
  id: string;
  purpose: 'thumbnail' | 'webp' | 'social' | 'optimized';
  url: string;
  width: number;
  height: number;
  format: string;
}
```

**New Components:**
- `modules/media/components/ImageEditor/ImageEditor.tsx` - Main editor canvas
- `modules/media/components/ImageEditor/CropTool.tsx` - Crop interface
- `modules/media/components/ImageEditor/AdjustmentPanel.tsx` - Sliders
- `modules/media/components/ImageEditor/OverlayTool.tsx` - Text/badge overlay
- `modules/media/components/ImageEditor/FocalPointSelector.tsx` - Click to set

**Libraries:**
- `react-image-crop` or `react-advanced-cropper` for crop UI
- `fabric.js` for canvas overlays (optional)
- Sharp for server-side processing

**Files to Create/Modify:**
```
modules/media/
├── components/
│   └── ImageEditor/
│       ├── ImageEditor.tsx
│       ├── CropTool.tsx
│       ├── AdjustmentPanel.tsx
│       ├── OverlayTool.tsx
│       ├── FocalPointSelector.tsx
│       └── index.ts
├── hooks/
│   └── useImageEditor.ts
└── utils/
    └── imageTransforms.ts
```

---

#### 1.2 Automated Visual Pipeline

Create consistent imagery automatically on upload.

**Pipeline Flow:**
```
Upload
   │
   ▼
┌──────────────┐
│   Validate   │ ← Size limits, format checks, malware scan
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Process    │ ← Extract metadata, optimize, generate hash
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Variants    │ ← Thumbnail, WebP, social sizes, blur placeholder
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Index     │ ← Update JSON index, track usage
└──────────────┘
```

**Variant Generation:**

| Variant | Dimensions | Format | Purpose |
|---------|-----------|--------|---------|
| `thumbnail` | 300x300 | JPEG | Media picker preview |
| `webp` | Original | WebP | Modern browser optimization |
| `social-square` | 1200x1200 | JPEG | Instagram, Facebook |
| `social-landscape` | 1200x630 | JPEG | Twitter, LinkedIn, OG |
| `blur-placeholder` | 20x20 | Base64 | Progressive loading |
| `optimized` | max 2000px | JPEG 85% | Production display |

**Implementation:**

```typescript
// modules/media/utils/variantGenerator.ts
interface VariantConfig {
  name: string;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: string;
  format: 'jpeg' | 'webp' | 'png' | 'avif';
  quality: number;
  fit: 'cover' | 'contain' | 'fill';
}

const VARIANT_CONFIGS: VariantConfig[] = [
  { name: 'thumbnail', maxWidth: 300, maxHeight: 300, format: 'jpeg', quality: 80, fit: 'cover' },
  { name: 'webp', format: 'webp', quality: 85, fit: 'contain' },
  { name: 'social-square', maxWidth: 1200, maxHeight: 1200, aspectRatio: '1:1', format: 'jpeg', quality: 90, fit: 'cover' },
  { name: 'social-landscape', maxWidth: 1200, maxHeight: 630, aspectRatio: '1.91:1', format: 'jpeg', quality: 90, fit: 'cover' },
  { name: 'optimized', maxWidth: 2000, maxHeight: 2000, format: 'jpeg', quality: 85, fit: 'contain' },
];

async function generateVariants(
  sourcePath: string,
  assetId: string
): Promise<MediaVariant[]>;
```

**API Updates:**
- `POST /api/media/upload` - Trigger variant generation
- `GET /api/media/[id]/variants` - List available variants
- `POST /api/media/[id]/regenerate` - Regenerate variants with new settings

---

### Phase 2: Video & Rich Media (Weeks 5-8)

#### 2.1 Video Support Enhancement

Extend media manager and page builder for video-first content.

**Media Manager Updates:**

```typescript
// modules/media/types/index.ts
interface VideoMetadata {
  duration: number;        // seconds
  width: number;
  height: number;
  codec: string;
  bitrate: number;
  hasAudio: boolean;
  thumbnailTimestamps: number[];  // Generated preview frames
}

interface MediaAsset {
  // ... existing
  video?: VideoMetadata;
}
```

**Video Processing:**
- Extract metadata with `ffprobe` (via `fluent-ffmpeg`)
- Generate thumbnail at 0%, 25%, 50%, 75% timestamps
- Create preview GIF (optional)
- Transcode to web-optimized MP4 if needed

**New Page Builder Blocks:**

```typescript
// modules/page-builder/types/index.ts

// Video Hero - Full-width background video
interface VideoHeroContent {
  videoUrl: string;
  posterImage: string;
  heading: string;
  subheading: string;
  cta: { label: string; url: string };
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
  autoplay: boolean;
  loop: boolean;
  muted: boolean;  // Required for autoplay
}

// Product Video - Demo with CTA
interface ProductVideoContent {
  videoUrl: string;
  posterImage: string;
  title: string;
  description: string;
  productId?: string;
  ctaLabel: string;
  ctaUrl: string;
  layout: 'left' | 'right' | 'overlay';
}

// Video Gallery - Multiple videos
interface VideoGalleryContent {
  videos: Array<{
    url: string;
    poster: string;
    title: string;
    duration?: number;
  }>;
  layout: 'grid' | 'carousel' | 'featured';
  columns: 2 | 3 | 4;
  autoplay: boolean;
}
```

**Embed Support:**
- YouTube URL parsing and embed
- Vimeo URL parsing and embed
- Native video player with custom controls
- Lazy loading with poster images

**Files to Create:**
```
modules/page-builder/components/Blocks/
├── VideoHero/
│   └── VideoHero.tsx
├── ProductVideo/
│   └── ProductVideo.tsx
└── VideoGallery/
    └── VideoGallery.tsx

modules/media/components/
├── VideoPlayer/
│   ├── VideoPlayer.tsx
│   └── VideoControls.tsx
└── VideoUploader/
    └── VideoUploader.tsx

modules/media/utils/
└── videoProcessing.ts
```

---

#### 2.2 Video in Product Pages

Enhance product display with video content.

**GraphQL Fragment Update:**
```graphql
# modules/products/fragments/ProductFragment.ts
fragment ProductFragment on Product {
  # ... existing fields
  media {
    _id
    file {
      _id
      name
      url
      type  # 'image' | 'video'
    }
  }
}
```

**Product Gallery Enhancement:**
- Mixed media support (images + videos)
- Video thumbnail with play button overlay
- Inline video playback in gallery
- Fullscreen video support

---

### Phase 3: AI Enhancement (Weeks 9-12)

#### 3.1 AI-Powered Image Tools

Integrate AI services for image enhancement and generation.

**Features:**

| Feature | Description | API Option |
|---------|-------------|------------|
| Background Removal | One-click product isolation | Remove.bg, PhotoRoom |
| Background Generation | Lifestyle/context backgrounds | Stability AI, Replicate |
| Image Upscaling | AI-enhanced resolution | Replicate (Real-ESRGAN) |
| Auto Enhancement | Lighting, color, sharpness | Replicate, Cloudinary |
| Object Detection | Auto-crop to product focus | TensorFlow.js, Cloudinary |

**UI Integration:**

```
┌─────────────────────────────────────────────────────────────┐
│  Media Editor                                    [AI Tools ▼]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    [Product Image]                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  AI Enhancement Panel                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Remove     │ │  Generate   │ │  Upscale    │           │
│  │  Background │ │  Background │ │  Image      │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  Background Options:                                        │
│  [Studio White] [Lifestyle] [Outdoor] [Custom Prompt...]    │
│                                                             │
│  ⚠️ AI-generated content will be labeled                    │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**

```typescript
// modules/media/services/aiImageService.ts

interface AIServiceConfig {
  provider: 'removebg' | 'stability' | 'replicate' | 'cloudinary';
  apiKey: string;
  endpoint?: string;
}

interface BackgroundRemovalResult {
  success: boolean;
  outputUrl: string;
  processingTime: number;
}

interface BackgroundGenerationOptions {
  prompt: string;
  style: 'studio' | 'lifestyle' | 'outdoor' | 'custom';
  preserveProduct: boolean;
}

interface BackgroundGenerationResult {
  success: boolean;
  outputUrl: string;
  isAIGenerated: true;  // Always mark AI content
  prompt: string;
}

class AIImageService {
  async removeBackground(imageUrl: string): Promise<BackgroundRemovalResult>;
  async generateBackground(
    imageUrl: string,
    options: BackgroundGenerationOptions
  ): Promise<BackgroundGenerationResult>;
  async upscaleImage(imageUrl: string, scale: 2 | 4): Promise<string>;
  async enhanceImage(imageUrl: string): Promise<string>;
}
```

**AI Disclosure:**
- Store `isAIGenerated: boolean` on MediaAsset
- Display badge on AI-generated images in media picker
- Include disclosure in image metadata for frontend
- 61.5% of consumers want AI content labeled

**Environment Variables:**
```env
AI_IMAGE_PROVIDER=replicate
AI_IMAGE_API_KEY=...
REMOVEBG_API_KEY=...
```

---

#### 3.2 AI-Assisted Content Creation

Extend AI to page builder content.

**Features:**
- Generate hero banner copy from product data
- Suggest image compositions
- Auto-generate alt text for accessibility
- A/B test headline suggestions

---

### Phase 4: Interactive Commerce (Weeks 13-16)

#### 4.1 Shoppable Images

Add interactive product discovery within images.

**Data Model:**

```typescript
// modules/page-builder/types/index.ts

interface ProductHotspot {
  id: string;
  productId: string;
  position: {
    x: number;  // Percentage 0-100
    y: number;  // Percentage 0-100
  };
  label?: string;
  style: 'dot' | 'plus' | 'tag' | 'pulse';
}

interface ShoppableImageContent {
  image: string;
  altText: string;
  hotspots: ProductHotspot[];
  showLabels: 'always' | 'hover' | 'never';
  hotspotStyle: 'minimal' | 'card' | 'tooltip';
}

// New block type
type ShoppableImageBlock = {
  type: 'shoppable-image';
  content: ShoppableImageContent;
  style: BlockStyle;
  responsive: ResponsiveOverrides;
};
```

**Editor UX:**
1. Select "Shoppable Image" block
2. Upload/select lifestyle image
3. Click on image to place hotspot
4. Search and select product for each hotspot
5. Configure hotspot appearance
6. Preview hover behavior

**Frontend Behavior:**
- Hotspots pulse subtly to indicate interactivity
- Hover reveals product card with:
  - Product image thumbnail
  - Product name
  - Price
  - "Quick Add" button
- Click hotspot navigates to product page

**Components:**
```
modules/page-builder/components/Blocks/ShoppableImage/
├── ShoppableImage.tsx        # Main block component
├── HotspotMarker.tsx         # Individual hotspot UI
├── HotspotEditor.tsx         # Placement interface
├── ProductCard.tsx           # Hover card display
└── ProductSearchPopover.tsx  # Product selection
```

---

#### 4.2 Before/After Comparison

Add image comparison slider block.

```typescript
interface BeforeAfterContent {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  initialPosition: number;  // 0-100, default 50
  orientation: 'horizontal' | 'vertical';
}
```

**Use Cases:**
- Product transformations
- Cleaning/restoration results
- Makeup/skincare before/after
- Room staging comparisons

---

### Phase 5: 3D & AR (Weeks 17-24)

#### 5.1 360° Product Spin

Enable multi-angle product photography.

**Data Model:**

```typescript
// modules/products/types/index.ts

interface Product360View {
  productId: string;
  frames: string[];        // Array of image URLs (36-72 frames typical)
  autoRotate: boolean;
  rotateSpeed: number;     // Degrees per second
  allowManualRotation: boolean;
  startFrame: number;
}
```

**Implementation:**
- Use `react-360-view` or custom implementation
- Preload frames for smooth rotation
- Touch/drag support for mobile
- Keyboard arrow key support
- Auto-rotate on hover option

**Media Manager Support:**
- Batch upload for 360° sequences
- Auto-detect numbered sequences (e.g., `product_001.jpg` - `product_036.jpg`)
- Preview spin in media picker

---

#### 5.2 3D Model Viewer

Support GLB/GLTF 3D models for products.

**Integration:**
- Use Google's `<model-viewer>` web component
- Support GLB/GLTF file uploads
- AR Quick Look for iOS
- Scene Viewer for Android

```typescript
// modules/media/types/index.ts

interface Model3DMetadata {
  format: 'glb' | 'gltf' | 'usdz';
  polyCount: number;
  hasAnimations: boolean;
  materials: string[];
  dimensions: { x: number; y: number; z: number };
}

interface MediaAsset {
  // ... existing
  model3d?: Model3DMetadata;
}
```

**Product Page Integration:**
```tsx
// modules/products/components/Product3DViewer.tsx

interface Product3DViewerProps {
  modelUrl: string;
  posterImage: string;
  enableAR: boolean;
  autoRotate: boolean;
  cameraControls: boolean;
}
```

**AR Button:**
- "View in Your Space" button on supported devices
- Falls back to 3D viewer on unsupported devices
- Track AR engagement analytics

---

### Phase 6: Personalization (Weeks 25-30)

#### 6.1 Segment-Based Visual Content

Deliver different visuals based on user segments.

**Segments:**
- New vs returning visitors
- Geographic location
- Device type
- Referral source
- Purchase history

**Implementation:**

```typescript
// modules/page-builder/types/index.ts

interface BlockVisibilityRule {
  segment: string;
  condition: 'equals' | 'not_equals' | 'contains' | 'greater_than';
  value: string | number | boolean;
}

interface PageBlock {
  // ... existing
  visibility?: {
    rules: BlockVisibilityRule[];
    operator: 'and' | 'or';
    fallbackBlockId?: string;  // Show alternative if rules don't match
  };
}
```

**Example Rules:**
- Show winter imagery to users in cold climates
- Show "Welcome Back" hero to returning visitors
- Show mobile-optimized layout on small screens

---

#### 6.2 A/B Testing for Visuals

Test visual variants to optimize conversion.

**Features:**
- Create block variants
- Define traffic split (50/50, 70/30, etc.)
- Track engagement metrics
- Statistical significance calculation
- Auto-promote winner

---

## Implementation Priority Matrix

```
                         Business Impact
                              High
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           │   PHASE 1         │   PHASE 3         │
           │   • Inline Editor │   • AI Enhancement│
           │   • Auto Pipeline │                   │
           │                   │   PHASE 5         │
           │   PHASE 2         │   • 3D/AR         │
           │   • Video Support │                   │
           │                   │                   │
           │   PHASE 4         │   PHASE 6         │
           │   • Shoppable     │   • Personalize   │
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                              Low
              Low ─────────────┼───────────────── High
                         Implementation Effort
```

**Recommended Order:**

| Priority | Phase | Rationale |
|----------|-------|-----------|
| 1 | Phase 1: Foundation | Enables all subsequent features |
| 2 | Phase 2: Video | Highest ROI, proven 88% engagement boost |
| 3 | Phase 3: AI | Differentiator, API-based = faster delivery |
| 4 | Phase 4: Interactive | Commerce-specific value, builds on Phase 1-2 |
| 5 | Phase 5: 3D/AR | Longer term, highest impact on returns |
| 6 | Phase 6: Personalization | Requires data infrastructure |

---

## Technical Dependencies

### New Packages

```json
{
  "dependencies": {
    "react-advanced-cropper": "^0.19.0",
    "fabric": "^5.3.0",
    "@google/model-viewer": "^3.4.0",
    "fluent-ffmpeg": "^2.1.2",
    "react-360-view": "^1.2.0"
  },
  "devDependencies": {
    "@types/fluent-ffmpeg": "^2.1.24"
  }
}
```

### Environment Configuration

```env
# AI Services
AI_IMAGE_PROVIDER=replicate
REPLICATE_API_KEY=...
REMOVEBG_API_KEY=...

# Video Processing
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe

# 3D/AR
ENABLE_AR_FEATURES=true
```

### Infrastructure Considerations

| Feature | Requirement |
|---------|-------------|
| Video Processing | FFmpeg binary on server |
| AI Enhancement | External API access |
| 3D Models | CDN for large GLB files |
| Real-time Collab | WebSocket server (already exists) |

---

## Success Metrics

### Key Performance Indicators

| Metric | Current | Target | Phase |
|--------|---------|--------|-------|
| Time on product page | Baseline | +40% | 2, 5 |
| Product return rate | Baseline | -5% | 5 |
| Image production time | Baseline | -40% | 1, 3 |
| Page builder adoption | Baseline | +50% | 1, 2, 4 |
| Conversion rate | Baseline | +15% | All |

### Tracking Implementation

- Analytics events for video plays, AR activations, hotspot clicks
- A/B test framework integration
- Time-on-page tracking per block type
- Heatmaps for shoppable image engagement

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI service downtime | Graceful fallback to manual editing |
| Large video files | Chunked upload, background processing |
| Browser AR support | Feature detection, fallback to 3D viewer |
| Performance impact | Lazy loading, CDN, image optimization |
| AI content trust | Clear labeling, human review workflow |

---

## Appendix: File Structure

```
modules/
├── media/
│   ├── components/
│   │   ├── ImageEditor/
│   │   │   ├── ImageEditor.tsx
│   │   │   ├── CropTool.tsx
│   │   │   ├── AdjustmentPanel.tsx
│   │   │   ├── OverlayTool.tsx
│   │   │   └── FocalPointSelector.tsx
│   │   ├── VideoPlayer/
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── VideoControls.tsx
│   │   └── Model3DViewer/
│   │       └── Model3DViewer.tsx
│   ├── services/
│   │   ├── aiImageService.ts
│   │   └── videoProcessingService.ts
│   └── utils/
│       ├── variantGenerator.ts
│       └── imageTransforms.ts
│
├── page-builder/
│   ├── components/
│   │   └── Blocks/
│   │       ├── VideoHero/
│   │       ├── ProductVideo/
│   │       ├── VideoGallery/
│   │       ├── ShoppableImage/
│   │       ├── BeforeAfter/
│   │       └── Product360/
│   └── types/
│       └── index.ts (extended)
│
└── products/
    └── components/
        ├── Product3DViewer.tsx
        ├── Product360Spin.tsx
        └── ProductVideoGallery.tsx

pages/api/
├── media/
│   ├── process.ts        # Variant generation
│   ├── ai/
│   │   ├── remove-bg.ts
│   │   ├── generate-bg.ts
│   │   └── upscale.ts
│   └── video/
│       └── process.ts
```

---

## References

- [GemPages: eCommerce Design Trends 2026](https://gempages.net/blogs/shopify/ecommerce-design-trends)
- [Imagine.io: Visual Trend Report 2025](https://resources.imagine.io/blog/ecommerce-visual-trend-report-2025)
- [Strapi: Headless CMS for eCommerce](https://strapi.io/blog/headless-cms-for-ecommerce)
- [Vendure: Top 5 Headless CMS 2025](https://vendure.io/resources/top-5-headless-cms-for-ecommerce-in-2025-complete-guide)
- [Pixelz: E-commerce Visual Trend Report](https://www.pixelz.com/whitepaper/evtr/)
- [Wiser Review: 50 Emerging eCommerce Trends](https://wiserreview.com/blog/ecommerce-trends/)
