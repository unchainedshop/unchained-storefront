# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js e-commerce storefront that connects to the Unchained Engine backend. It's a modular, internationalized SPA with full e-commerce functionality including product browsing, cart management, checkout, and order tracking.

## Commands

### Development
```bash
# Start development server (connects to staging by default)
npm run dev

# Start with local Unchained instance (port 4010)
npm run dev:local

# Update GraphQL schema from local Unchained instance
npm run update-schema
```

### Code Quality
```bash
# Run linting (ESLint + Prettier)
npm run lint

# Build for production
npm run build
```

### Internationalization
```bash
# Extract translatable strings
npm run extract-translation

# Compile translations
npm run compile-translation
```

## Architecture

### Module Structure
The codebase follows a modular architecture in `/modules/`:
- `apollo/` - GraphQL client configuration and type policies
- `assortment/` - Product categories and navigation
- `auth/` - Authentication (password, WebAuthn, guest checkout)
- `cart/` - Shopping cart state and operations
- `checkout/` - Multi-step checkout flow with payment integrations
- `common/` - Shared components and utilities
- `products/` - Product listing and detail pages
- `orders/` - Order management and history
- `layout/` - Page layout components (Header, Footer)
- `i18n/` - Internationalization setup

### Key Patterns

1. **GraphQL Operations**: All data fetching uses Apollo Client with generated TypeScript types
   - Queries/mutations are colocated with components
   - Use fragments for reusable query parts
   - Server-side proxy at `/app/graphql/route.ts` handles authentication

2. **State Management**: 
   - Apollo Client cache for server state
   - React Context for UI state (see `modules/cart/CartContext.tsx`)
   - Local component state with hooks

3. **Routing**: File-based routing in `/pages/` with dynamic routes for products and orders

4. **Styling**: Tailwind CSS v4 with custom theme configuration
   - Dark mode support built-in

5. **Payment Integration**: Multiple providers supported
   - Stripe (credit cards)
   - Datatrans (Swiss payments)
   - Cryptopay (cryptocurrency)
   - Invoice payment

## Environment Configuration

Required environment variable:
- `UNCHAINED_ENDPOINT` - GraphQL endpoint URL

Optional configuration:
- `THEME_*` - Theme customization variables
- `DATATRANS_*` - Datatrans payment configuration
- `SKIP_*` - Disable specific features

## Common Development Tasks

### Adding a new GraphQL query/mutation
1. Write the query in the component file
2. Run `npm run update-schema` to update types
3. Import and use the generated types

### Creating a new module
1. Create directory under `/modules/`
2. Add components, fragments, and utilities
3. Export from module index file

### Modifying checkout flow
- Checkout steps are in `modules/checkout/`
- Payment methods in `modules/checkout/components/DatatransPayment.tsx`, `StripePayment.tsx`, etc.

### Working with translations
1. Use `useIntl` hook and `formatMessage` for translations
2. Run `npm run extract-translation` after adding new strings
3. Update translation files in `translations/`

## Testing Approach

The project uses manual testing for development. When adding features:
1. Test with both staging and local Unchained instances
2. Verify responsive design (mobile/desktop)
3. Check internationalization with different locales
4. Test payment flows in test mode

## Important Notes

- **Node Version**: Requires Node.js 22.x (enforced by .nvmrc and engines field)
- **TypeScript**: Configured with strict mode but `strictNullChecks` is disabled
- **Authentication**: Handled via HTTP-only cookies through the GraphQL proxy
- **Image Optimization**: Use Next.js Image component for all images
- **Theme**: Runtime configurable via theme.json or environment variables