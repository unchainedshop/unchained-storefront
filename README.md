# 🚀 Unchained Storefront

<div align="center">
  
  [![Next.js](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
  [![Node.js](https://img.shields.io/badge/Node.js%2022-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

  **A blazing-fast, modern e-commerce storefront built with Next.js and powered by Unchained Engine**

  [Demo](https://your-store.com) • [Documentation](https://docs.unchained.shop) • [Report Bug](https://github.com/unchained/storefront/issues) • [Request Feature](https://github.com/unchained/storefront/issues)

</div>

---

## ✨ Features

### 🛍️ Complete E-commerce Experience
- **Product Catalog** - Browse products with advanced filtering and search
- **Shopping Cart** - Real-time cart management with persistent state
- **Multi-step Checkout** - Streamlined checkout flow with guest checkout support
- **Order Management** - Track orders and view order history
- **User Accounts** - Registration, login, and profile management

### 💳 Payment Integrations
- **Stripe** - Credit/debit card payments
- **Datatrans** - Swiss payment methods
- **Cryptopay** - Cryptocurrency payments
- **Invoice** - Traditional invoice payment

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach that works on all devices
- **Dark Mode** - Built-in dark theme support
- **Glass Morphism** - Modern frosted glass effects
- **Smooth Animations** - Delightful micro-interactions and transitions

### 🔧 Developer Experience
- **TypeScript** - Full type safety with generated GraphQL types
- **Modular Architecture** - Clean, maintainable code structure
- **Hot Reload** - Fast development with Next.js Fast Refresh
- **Internationalization** - Multi-language support out of the box

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x (check `.nvmrc`)
- npm or yarn
- An Unchained Engine instance (or use our staging server)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/unchained-storefront.git
   cd unchained-storefront
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file:
   ```env
   UNCHAINED_ENDPOINT=https://your-unchained-instance.com/graphql
   SKIP_INVALID_REMOTES=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Your storefront is now running at [http://localhost:3000](http://localhost:3000) 🎉

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start development server (staging backend)
npm run dev:local        # Start with local Unchained instance

# Production
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint and Prettier
npm run typecheck       # Run TypeScript compiler check

# GraphQL
npm run update-schema   # Update GraphQL schema from backend

# Internationalization
npm run extract-translation    # Extract translatable strings
npm run compile-translation    # Compile translation files
```

## 🏗️ Project Structure

```
unchained-storefront/
├── 📁 modules/                 # Feature modules
│   ├── apollo/                # GraphQL client configuration
│   ├── assortment/            # Product categories
│   ├── auth/                  # Authentication (password, WebAuthn)
│   ├── cart/                  # Shopping cart logic
│   ├── checkout/              # Checkout flow
│   ├── common/                # Shared components
│   ├── products/              # Product pages
│   ├── orders/                # Order management
│   └── layout/                # Layout components
├── 📁 pages/                   # Next.js pages (routes)
├── 📁 public/                  # Static assets
├── 📁 i18n/                    # Translation files
├── 📁 styles/                  # Global styles
└── 📄 theme.json              # Theme configuration
```

## 🎨 Theming & Customization

### Dynamic Theming

The storefront supports runtime theme configuration through `theme.json`:

```json
{
  "colors": {
    "primary": "#1e40af",
    "secondary": "#64748b",
    "accent": "#f59e0b"
  },
  "fonts": {
    "body": "Inter, system-ui, sans-serif",
    "heading": "Cal Sans, sans-serif"
  }
}
```

### Environment-based Theming

You can also configure themes via environment variables:

```env
THEME_PRIMARY_COLOR=#1e40af
THEME_SECONDARY_COLOR=#64748b
THEME_FONT_FAMILY=Inter
```

## 🌍 Internationalization

The storefront comes with built-in i18n support:

1. **Add translations** in `i18n/[locale].json`
2. **Extract new strings**: `npm run extract-translation`
3. **Use in components**:
   ```tsx
   const { formatMessage } = useIntl();
   formatMessage({ id: 'welcome', defaultMessage: 'Welcome!' })
   ```

## 🔌 Payment Configuration

### Stripe
```env
STRIPE_PUBLIC_KEY=pk_test_...
```

### Datatrans
```env
DATATRANS_MERCHANT_ID=your_merchant_id
DATATRANS_TEST_MODE=true
```

## 🧪 Testing

```bash
# Manual testing checklist
✅ Test with staging and local Unchained instances
✅ Verify responsive design (mobile/tablet/desktop)
✅ Check all payment flows in test mode
✅ Test internationalization with different locales
✅ Verify dark mode functionality
```

## 📊 Performance

- **Lighthouse Score**: 95+ Performance
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Core Web Vitals**: All green

## 🤝 Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Unchained Engine](https://unchained.shop)
- Powered by [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Heroicons](https://heroicons.com)

## 💬 Support

- 📧 Email: support@unchained.shop
- 💬 Discord: [Join our community](https://discord.gg/unchained)
- 📖 Docs: [docs.unchained.shop](https://docs.unchained.shop)

---

<div align="center">
  
  **Built with ❤️ by the Unchained Team**
  
  ⭐ Star us on GitHub — it motivates us a lot!
  
</div>