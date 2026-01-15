# Visual Page Builder: Feature Comparison

A comprehensive comparison of the Unchained Visual Page Builder against popular CMS and page builder solutions.

## Overview

| Feature | **Unchained** | **Gutenberg** | **Directus** | **Strapi** | **Cockpit** |
|---------|---------------|---------------|--------------|------------|-------------|
| **Type** | Integrated e-commerce builder | WordPress block editor | Headless CMS | Headless CMS | Headless CMS |
| **Blocks** | 28 types | 90+ core blocks | N/A (fields) | N/A (fields) | N/A (fields) |
| **E-commerce blocks** | 9 dedicated | Via plugins | Manual setup | Via plugins | Manual setup |
| **Visual editing** | WYSIWYG canvas | WYSIWYG canvas | Form-based | Form-based | Form-based |
| **Real-time collab** | Yes (Yjs/CRDT) | No (draft lock only) | No | No | No |
| **Version control** | Git-based | Revisions (DB) | Activity log | Draft versions | Git sync |
| **i18n approach** | Per-block localized | Per-post multilingual | Field-level | Field-level | Collection-level |
| **Media management** | Built-in DAM | Media library | Full DAM | Media library | Assets manager |
| **Workflow** | 5-stage + scheduled | Draft/Pending/Published | Custom stages | Draft/Published | No workflow |
| **Audit logging** | Full audit trail | Revisions only | Activity tracking | Audit logs (EE) | No |
| **Form builder** | Visual drag-drop | Plugin (Contact Form 7, etc.) | No (needs extension) | No (needs plugin) | No |
| **Redirects manager** | Built-in 301/302 | Plugin (Redirection) | No | No | No |
| **Menu builder** | Visual drag-drop | Native menus | No | No | No |
| **Role-based access** | Built-in RBAC | Capability system | Granular RBAC | RBAC + conditions | Basic ACL |
| **Self-hosted** | Yes | Yes | Yes | Yes | Yes |
| **License** | Proprietary | GPL | BSL 1.1 | MIT/EE | MIT |

---

## Detailed Comparison

### 1. Block/Content Architecture

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Content model | Block tree with nesting rules | Block tree (unlimited nesting) | Relational fields | Collection types + components | Collections + singletons |
| Schema definition | TypeScript types + block registry | block.json + PHP/JS | GUI + migrations | GUI + code | JSON schema |
| Nesting control | Explicit rules (allowedParents/Children) | innerBlocks template | Relations | Component zones | Nested sets |
| Reusable patterns | Block templates | Reusable blocks + patterns | Reusable fields | Components | Repeaters |

**Unchained advantage**: Purpose-built e-commerce blocks (Shoppable Image, Size Guide, Store Locator) that don't exist in general-purpose CMS.

**Gutenberg advantage**: Massive ecosystem with 90+ core blocks and thousands of third-party blocks.

**Headless CMS advantage** (Directus/Strapi/Cockpit): More flexible data modeling for complex relational content.

---

### 2. Visual Editing Experience

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Canvas type | Full WYSIWYG with viewport preview | WYSIWYG (full page context) | Form fields | Form fields | Form fields |
| Drag-drop | Block reordering + nested drop zones | Full drag-drop | Field reordering | Component reorder | Field reorder |
| Inline editing | Rich text + property panels | True inline (contentEditable) | No | No | No |
| Responsive preview | 7 breakpoints with zoom | Basic responsive toggle | N/A | N/A | N/A |
| Focus mode | Yes | Yes | N/A | N/A | N/A |
| Keyboard shortcuts | 10+ shortcuts | 30+ shortcuts | Minimal | Minimal | Minimal |

**Gutenberg advantage**: Deepest inline editing - edit text directly on the page with formatting shortcuts.

**Unchained advantage**: 7-breakpoint responsive preview with zoom control; purpose-built for landing pages and e-commerce.

**Headless CMS trade-off**: Form-based editing is faster for structured data but lacks visual context.

---

### 3. Internationalization (i18n)

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Architecture | LocalizedContent per block | Plugin-dependent (WPML, Polylang) | Built-in translations | Built-in i18n plugin | Collection-level locales |
| Translation status | Per-locale completion % tracking | Plugin feature | Field-level status | Per-entry status | No tracking |
| Source change detection | Yes (flags outdated translations) | Plugin feature | No | No | No |
| Fallback chain | Requested -> default -> first available | Plugin-dependent | Fallback locale | Fallback locale | No fallback |
| SEO per locale | Full LocalizedSEOSettings | Plugin-dependent | Via relations | Via localized fields | Manual |

**Unchained advantage**: Translation completeness tracking with "needs update" detection when source changes - critical for maintaining translation quality.

**Strapi/Directus advantage**: More mature i18n plugins with established workflows.

---

### 4. Workflow & Publishing

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Statuses | draft -> in_review -> approved -> published -> archived | Draft -> Pending -> Scheduled -> Published | Custom flows (Directus Flows) | Draft -> Published (EE: custom) | Published only |
| Scheduled publishing | Yes (scheduledFor field) | Yes (native) | Via Flows | Yes | No |
| Review notes | Yes (reviewNote field) | No (comments separate) | Via comments | No | No |
| Role-based permissions | Not implemented yet | Capability system | Granular RBAC | RBAC + conditions | Basic ACL |

**Directus advantage**: Directus Flows enables custom multi-stage workflows with automations.

**WordPress/Gutenberg advantage**: Mature user role and capability system.

**Unchained advantage**: Built-in review workflow with submitter/reviewer tracking and notes.

---

### 5. Version Control & History

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Storage | File-based JSON + Git | Database revisions | Database + activity | Database versions | File-based + Git sync |
| History depth | Unlimited (Git) | Configurable revisions | Activity log | Draft versions only | Unlimited (Git) |
| Diff view | Git diff (text-based) | Visual revision compare | Field-level changes | No diff | Git diff |
| Restore | Full page restore from any commit | Restore any revision | Revert activity | No restore | Git restore |
| Undo/Redo | 50-entry client-side + Git server-side | Browser-level | No | No | No |

**Unchained & Cockpit advantage**: Git-based versioning provides true version control with branching potential.

**WordPress advantage**: Visual revision comparison side-by-side.

**Limitation**: Unchained's diff is text-based JSON - not visual block comparison.

---

### 6. Real-Time Collaboration

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Concurrent editing | Yes (Yjs CRDT) | No (lock-based) | No | No | No |
| Presence awareness | User avatars + cursor tracking | No | No | No | No |
| Block locking | Automatic with timeout | Post-level lock only | Row-level lock | No | No |
| Conflict resolution | CRDT merge | Last save wins | Last save wins | Last save wins | Git merge |

**Unchained advantage**: Only solution with true real-time collaboration using Yjs CRDTs - similar to Notion/Google Docs.

---

### 7. Media Management (DAM)

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Folder organization | Yes | No (flat + filters) | Yes | Yes | Yes |
| Focal point | Yes | No (via plugins) | Yes | No | No |
| Custom crops | Named crops per aspect ratio | Image editor | Transformations | No | No |
| Usage tracking | Yes (where used) | No | Yes | No | No |
| Tags/metadata | Yes | Alt text only | Full metadata | Tags + alt | Basic |

**Directus advantage**: Most powerful media transformations with on-the-fly processing.

**Unchained advantage**: Usage tracking ("where is this image used?") is valuable for cleanup.

---

### 8. E-Commerce Integration

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Product blocks | 9 native (grid, carousel, shoppable) | WooCommerce plugin | Build yourself | Via plugins | Build yourself |
| Cart integration | Native (Apollo cache) | WooCommerce | Custom | Custom | Custom |
| Checkout flows | Built-in | WooCommerce | Custom | Custom | Custom |
| Inventory awareness | Native | WooCommerce | Custom | Custom | Custom |

**Unchained advantage**: Purpose-built for e-commerce with specialized blocks:

- **Shoppable Image**: Lifestyle images with product hotspots
- **Shoppable Video**: Time-based product hotspots in video
- **Size Guide**: Interactive measurement tables
- **Store Locator**: Map-based store finder
- **Product Grid/Carousel**: With filtering, sorting, quick-add

None of the general-purpose CMS have these out of the box.

---

### 9. Audit Logging

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Actions logged | 12 action types | Revisions only | Activity log | Audit logs (Enterprise) | No |
| User tracking | Full (who, when, what) | Author only | Yes | Yes (EE) | No |
| Query/filter | By user, action, entity, date | No | Yes | Yes (EE) | No |
| Export | JSON files | No | CSV/JSON | API | No |

**Directus advantage**: Activity tracking is built into the core with excellent filtering.

**Unchained advantage**: 12 specific action types (create, publish, approve, reject, restore, etc.) with monthly file organization.

---

### 10. Form Builder

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Builder type | Visual drag-drop | Plugin-dependent | N/A | N/A | N/A |
| Field types | 10 (text, email, tel, number, textarea, select, radio, checkbox, date, file) | Plugin-dependent | N/A | N/A | N/A |
| Validation | Required, min/max, pattern | Plugin-dependent | N/A | N/A | N/A |
| Submissions inbox | Built-in with status | Plugin-dependent | N/A | N/A | N/A |
| Email notifications | Configurable recipients | Plugin-dependent | N/A | N/A | N/A |
| Spam filtering | Status-based (mark as spam) | Plugin-dependent | N/A | N/A | N/A |

**Unchained advantage**: Native form builder with visual drag-drop, submission management, and email notifications - no plugins required.

**WordPress advantage**: Large ecosystem of form plugins (Contact Form 7, Gravity Forms, WPForms) with extensive integrations.

**Headless CMS gap**: Directus, Strapi, and Cockpit don't provide form building - requires custom implementation or third-party services.

---

### 11. URL Redirects Management

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Redirect types | 301 (permanent), 302 (temporary) | Plugin (Redirection) | N/A | N/A | N/A |
| Admin UI | Built-in manager | Plugin-dependent | N/A | N/A | N/A |
| Enable/disable | Per-redirect toggle | Plugin-dependent | N/A | N/A | N/A |
| Middleware | Next.js middleware integration | .htaccess / PHP | N/A | N/A | N/A |

**Unchained advantage**: Built-in redirect management with instant toggle and Next.js middleware - essential for SEO during site migrations.

---

### 12. Menu Builder

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Visual editor | Drag-drop with nesting | Native menu editor | N/A | N/A | N/A |
| Nesting levels | 3 levels supported | Unlimited | N/A | N/A | N/A |
| Link types | Page, Category, External, Submenu | Custom links, pages, categories | N/A | N/A | N/A |
| Localization | Per-locale labels | Plugin-dependent | N/A | N/A | N/A |
| Visibility toggle | Per-item | No | N/A | N/A | N/A |

**Unchained advantage**: Purpose-built menu builder with drag-drop nesting, localization, and visibility controls.

**WordPress advantage**: Native menu system with theme integration and extensive customization.

**Headless CMS gap**: Menu management typically requires custom implementation.

---

### 13. User Roles & Permissions

| Aspect | Unchained | Gutenberg | Directus | Strapi | Cockpit |
|--------|-----------|-----------|----------|--------|---------|
| Role management | Built-in admin UI | Capability system | Granular RBAC | RBAC + conditions | Basic ACL |
| Permission granularity | 18 permissions across 8 groups | ~70 capabilities | Field-level | Collection + field | Collection-level |
| System roles | Admin, Editor, Viewer (protected) | Admin, Editor, Author, Contributor, Subscriber | Configurable | Configurable | Admin only |
| Custom roles | Yes | Via plugins | Yes | Yes | No |

**Permission groups in Unchained**:
- Pages (read, write, delete, publish)
- Media (read, write, delete)
- Menus (read, write, delete)
- Collections (read, write, delete)
- Settings (read, write)
- Roles (read, write)
- Redirects (read, write)

**Directus advantage**: Most granular permissions with field-level access control.

**Unchained advantage**: Simple, purpose-built permission system covering all CMS features.

---

## Summary

### Where Unchained Excels

1. **E-commerce focus**: 9 dedicated e-commerce blocks that don't exist elsewhere
2. **Real-time collaboration**: Only solution with Yjs-based concurrent editing
3. **Translation quality tracking**: Completion % + source change detection
4. **Git-based versioning**: True version control (not just DB snapshots)
5. **Responsive preview**: 7 breakpoints with zoom control
6. **Integrated workflow**: Review -> approve -> publish with notes
7. **Built-in form builder**: Visual drag-drop with submissions inbox - no plugins needed
8. **SEO redirects**: Native 301/302 redirect management with Next.js middleware
9. **Menu builder**: Drag-drop with 3-level nesting and localization
10. **Complete RBAC**: 18 permissions across all CMS features out of the box

### Where Competitors Excel

| System | Strengths |
|--------|-----------|
| **Gutenberg** | Largest block ecosystem, deepest inline editing, mature permissions |
| **Directus** | Most flexible data modeling, powerful DAM, custom workflows via Flows |
| **Strapi** | Developer-friendly, strong plugin ecosystem, good TypeScript support |
| **Cockpit** | Lightweight, Git sync, simple deployment |

### Gaps to Consider

1. **Visual diff**: Block-level visual comparison (like Notion's version history)
2. **AI content assistance**: Gutenberg has AI writing tools emerging
3. **Component marketplace**: No block/template sharing ecosystem
4. **API-first patterns**: Could expose blocks as headless content API
5. **Webhooks**: No outbound notifications on content changes (Directus has Flows)
6. **Content scheduling calendar**: Visual calendar view for scheduled content

---

## Available Block Types (28 total)

### Layout (3)
- **Section** - Container for grouping blocks with background styling
- **Columns** - Multi-column layout (up to 4 columns)
- **Spacer** - Vertical spacing with responsive height control

### Content (7)
- **Text Content** - Rich text with heading levels
- **Image** - Images with aspect ratio, focal point, captions
- **Video** - YouTube, Vimeo, or custom video embeds
- **Tabs** - Tabbed content sections
- **Feature Grid** - Icon + title + description cards
- **FAQ Accordion** - Expandable Q&A sections
- **Before/After** - Image comparison slider

### E-Commerce (9)
- **Product Grid** - Responsive grid with sorting and filtering
- **Product Carousel** - Scrollable product showcase
- **Category Grid** - Display categories in grid or masonry
- **Shoppable Image** - Lifestyle images with product hotspots
- **Shoppable Video** - Videos with time-based product hotspots
- **Size Guide** - Interactive measurement tables
- **Store Locator** - Interactive map with store locations
- **Instagram Feed** - Display Instagram posts

### Marketing (6)
- **Hero Banner** - Full-width hero with 7 layout variants
- **Countdown Timer** - Sale countdown
- **Newsletter** - Email signup form
- **Promo Bar** - Dismissible promotional banner
- **Testimonials** - Customer reviews carousel or grid
- **Pricing Table** - Compare pricing tiers

### Custom (1)
- **Custom HTML** - Custom HTML and CSS code

---

## Technical Architecture

```
+----------------------------------------------------------+
|                   Page Builder UI Layer                   |
|  (PageBuilder.tsx, Canvas, Toolbar, Sidebars)            |
+-----------------------------+----------------------------+
                              |
+-----------------------------v----------------------------+
|          PageBuilderContext (State Management)           |
|  (Redux-like reducer pattern for editor state)           |
+-----------------------------+----------------------------+
                              |
        +----------+----------+----------+----------+
        |          |          |          |          |
+-------v----+ +---v---+ +---v---+ +----v-----+
| Block Tree | |History| |Collab | | Undo/Redo|
| Management | |Timeline| |System | | (50 max) |
+------------+ +-------+ +-------+ +----------+
        |
+-------v----------------------------------------------------+
|         Content Layer                                       |
| Localized content per locale, SEO, Workflow                |
+-------v----------------------------------------------------+
        |
        +-- File Storage: content/pages/*.json
        +-- Git History: Full version control
        +-- Autosave: 2000ms debounce
        +-- Audit Log: Monthly JSON files

+-----------------------------------------------------------+
|       Media Management (DAM)                               |
| Folders, Assets, Tags, Usage Tracking, Cropping           |
+-----------------------------------------------------------+

+-----------------------------------------------------------+
|       Additional CMS Features                              |
+-----------------------------------------------------------+
|                                                           |
| Form Builder          | Menu Builder      | Settings      |
| ├─ 10 field types     | ├─ Drag-drop      | ├─ CMS config |
| ├─ Validation rules   | ├─ 3-level nest   | ├─ Branding   |
| ├─ Submissions inbox  | ├─ Localization   | ├─ Redirects  |
| └─ Email notifications| └─ Publish flow   | └─ User roles |
|                                                           |
+-----------------------------------------------------------+
|       API Layer (/api/*)                                   |
+-----------------------------------------------------------+
| /api/forms/*          | /api/menus/*      | /api/roles/*  |
| /api/redirects/*      | /api/media/*      | /api/settings |
| /api/pages/*          | /api/collections/*|               |
+-----------------------------------------------------------+
```
