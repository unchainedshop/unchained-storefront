# Visual CMS - SaaS Strategy

## Business Model

**Open-Core Model:**
- Self-hosted = Free, open-source
- Cloud-hosted = Paid (revenue source)

Similar to: Supabase, Plausible, PostHog, n8n, GitLab

---

## Current State

### What We Have (Strong Foundation)

**Visual Page Builder**
- 28+ block types with drag-and-drop
- CSS Grid visual editor with spanning areas
- Inline editing, real-time preview
- Multi-language per-block localization
- Git-based versioning
- Editorial workflow (draft → review → publish)
- Scheduled publishing

**Content Infrastructure**
- Collections with custom schemas
- Form builder with submissions
- Menu builder (multi-level)
- Media library (DAM) with folders/tagging

**UI/UX Quality**
- Modern glassmorphism design
- Smooth animations
- Responsive viewport preview
- Collaboration indicators (Yjs integration)

**E-commerce Native**
- Shoppable images with hotspots
- Product grids, size guides
- Unchained Engine integration

---

## Requirements for Open-Source Success

### 1. Easy Self-Hosting (Critical)

```
Current:  Tied to Unchained, complex setup
Needed:
  - One-line Docker deploy
  - docker-compose.yml that "just works"
  - Railway/Render one-click templates
  - Clear docs: "5 min to running"
```

### 2. Standalone Mode

```
Current:  Requires Unchained Engine
Needed:
  - SQLite/Postgres adapter (no external deps)
  - Works without e-commerce backend
  - Optional: connect to Shopify/Unchained/etc
```

### 3. Cloud Advantages (Why Pay?)

| Free Self-Host | Paid Cloud ($29-99/mo) |
|----------------|------------------------|
| Full CMS features | Zero setup |
| Unlimited sites | Managed hosting |
| Community support | Auto backups |
| | CDN included |
| | Image optimization |
| | Team collaboration |
| | Priority support |
| | Custom domains |
| | Analytics dashboard |

---

## Minimal Additions for Launch

| Feature | Why | Effort |
|---------|-----|--------|
| Docker one-liner | Self-hosters need this | 1 week |
| SQLite adapter | Remove Unchained dependency | 2 weeks |
| Basic docs site | Adoption requires docs | 1 week |
| GitHub README | First impression | 2 days |
| Landing page | Explain the product | 1 week |
| Cloud signup flow | Start making money | 2 weeks |

**Total: ~6-8 weeks to launchable state**

---

## Why This Model Works

1. **Free marketing** - Open-source gets GitHub stars, HN posts, tweets
2. **Trust** - "I can see the code, I can leave anytime"
3. **Community** - Contributors fix bugs, add features
4. **Enterprise sales** - "We love it self-hosted, now we need support"
5. **Low CAC** - Developers discover → try → love → company pays

---

## Competitive Landscape

| Product | Strength | Weakness | Pricing |
|---------|----------|----------|---------|
| **Webflow** | Visual design, hosting | Expensive, learning curve | $14-212/mo |
| **Builder.io** | Headless, any framework | Complex setup | Free-$400/mo |
| **Contentful** | Enterprise, scalable | Not visual, expensive | $300+/mo |
| **Sanity** | Developer flexibility | Steep learning curve | Free-$949/mo |
| **Storyblok** | Visual + headless | Limited design freedom | €9-€449/mo |
| **Payload** | Code-first, TypeScript | No visual builder | Self-hosted |

### Our Position: "Visual Page Builder for E-commerce"

- Webflow is too generic and expensive
- Shopify's builder is limited
- Builder.io requires dev setup
- No one does shoppable images well

---

## Suggested Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Self-hosted, full features, community support |
| **Pro** | $29/mo | Cloud hosted, 3 sites, 10 users, custom domain |
| **Team** | $99/mo | 10 sites, unlimited users, collaboration, API |
| **Enterprise** | Custom | Self-hosted support, SSO, SLA, dedicated support |

---

## Future Differentiators

1. **Shopify App** - Instant distribution to millions of merchants
2. **AI-powered** - Generate landing pages from product descriptions
3. **Conversion optimization** - Built-in heatmaps, A/B testing
4. **One-click templates** - "Black Friday sale page in 30 seconds"

---

## Success Formula

```
Great DX + Easy self-host + Clear cloud upgrade path = 💰
```

**Focus on:**
- README that makes people star instantly
- Docker setup that works first try
- Cloud that's obviously worth $29/mo

---

## Roadmap

### Phase 1: Open-Source Launch (6-8 weeks)
- [ ] Docker one-liner setup
- [ ] SQLite/Postgres standalone adapter
- [ ] Documentation site
- [ ] GitHub README & landing page

### Phase 2: Cloud Launch (4-6 weeks)
- [ ] Signup/onboarding flow
- [ ] Stripe billing integration
- [ ] Template gallery
- [ ] Basic analytics

### Phase 3: Growth (ongoing)
- [ ] SSO & team management
- [ ] Collaboration (comments, mentions)
- [ ] Integrations (Shopify, GA, Mailchimp)
- [ ] Custom domains
- [ ] AI features

---

## Technology Scaling Issues

### 1. Real-time Collaboration (Yjs) - HIGH RISK

```
Problem:
  - Each user = persistent WebSocket connection
  - 1000 users editing = 1000 open sockets
  - Yjs state syncs between all editors on same doc

Bottlenecks:
  - WebSocket servers can't horizontally scale easily
  - Need sticky sessions (user → same server)
  - Memory grows with concurrent editors
  - Cross-server sync is complex

Solutions:
  - y-redis or y-mongodb for distributed state
  - Cloudflare Durable Objects
  - Limit concurrent editors per doc (5-10)
  - Partykit or Liveblocks (managed service)
```

### 2. Media Library - HIGH RISK

```
Problem:
  - Users upload large images/videos
  - Need multiple sizes (thumbnail, preview, full)
  - Storage costs explode
  - Serving globally = latency

Bottlenecks:
  - Image processing is CPU intensive
  - Storage: 100 users × 1GB = 100GB, 10K users = 10TB
  - Egress bandwidth costs

Solutions:
  - Cloudflare R2 (no egress fees)
  - Cloudflare Images or imgix (resize on-the-fly)
  - Upload size limits per tier
  - Lazy processing (resize on first request)
```

### 3. Database / Content Storage - MEDIUM RISK

```
Problem:
  - Git-based versioning = every save = new version
  - 1 page × 100 edits = 100 versions stored
  - Multi-tenant queries need isolation
  - Full-text search across content

Bottlenecks:
  - Database size grows fast
  - Queries slow without proper indexing
  - No search infrastructure currently

Solutions:
  - Version pruning (keep last 50 versions)
  - PostgreSQL with row-level security (multi-tenant)
  - Meilisearch or Typesense for search
  - Read replicas for scaling reads
```

### 4. Next.js SSR - MEDIUM RISK

```
Problem:
  - Server-side rendering is CPU intensive
  - Each page render = server work
  - Preview mode hits server, not cache

Bottlenecks:
  - Cold starts on serverless
  - Memory per request (~50-100MB)
  - Can't cache authenticated previews

Solutions:
  - ISR (Incremental Static Regeneration) for published pages
  - Edge rendering (Vercel Edge, Cloudflare Workers)
  - Aggressive caching for public pages
  - Separate preview from production
```

### 5. Multi-tenancy - MEDIUM RISK

```
Problem:
  - All customers share infrastructure
  - One bad actor can affect others
  - Data must be strictly isolated

Bottlenecks:
  - Noisy neighbor (one site doing heavy work)
  - Data leaks between tenants
  - Per-tenant resource limits

Solutions:
  - Database: schema-per-tenant or row-level security
  - Rate limiting per tenant
  - Resource quotas (API calls, storage, bandwidth)
  - Isolated workers for heavy tasks
```

### 6. API / GraphQL - LOW-MEDIUM RISK

```
Problem:
  - Content delivery API for headless usage
  - Complex queries can be expensive
  - No rate limiting currently

Bottlenecks:
  - N+1 queries in GraphQL
  - Large payloads (full page JSON)
  - DDoS vulnerability without limits

Solutions:
  - Query complexity limits
  - Persisted queries (whitelist allowed queries)
  - CDN caching for content API
  - Rate limiting per API key
```

### 7. Background Jobs - LOW RISK (but needed)

```
Problem:
  - Scheduled publishing
  - Image processing
  - Email notifications
  - Webhook deliveries

Currently: Not implemented?

Solutions:
  - BullMQ + Redis for job queue
  - Inngest or Trigger.dev (managed)
  - Vercel Cron for simple schedules
```

---

## Scaling Architecture

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   (CDN + WAF)   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
       │  Next.js    │ │  API      │ │  WebSocket  │
       │  (Vercel)   │ │  (Edge)   │ │  (Partykit) │
       └──────┬──────┘ └─────┬─────┘ └──────┬──────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
       │  PostgreSQL │ │  R2       │ │  Redis      │
       │  (Neon)     │ │  (Media)  │ │  (Upstash)  │
       └─────────────┘ └───────────┘ └─────────────┘
```

---

## Cost Scaling Estimate

| Users | DB | Storage | Bandwidth | Compute | Total/mo |
|-------|-----|---------|-----------|---------|----------|
| 100 | $20 | $5 | $10 | $20 | ~$55 |
| 1,000 | $50 | $50 | $100 | $100 | ~$300 |
| 10,000 | $200 | $500 | $500 | $500 | ~$1,700 |
| 100,000 | $1,000 | $2,000 | $2,000 | $3,000 | ~$8,000 |

At $29/user average, 1000 users = $29K revenue vs $300 cost = healthy margin

---

## Priority Fixes Before Scaling

1. **Add rate limiting** - Protect API endpoints
2. **Move media to R2/S3** - Don't store in DB
3. **Add caching layer** - Redis for sessions, content cache
4. **Database indexing** - Audit slow queries
5. **Yjs scaling plan** - Choose distributed provider
