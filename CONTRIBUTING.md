# Contributing to Unchained Storefront

First off, thank you for considering contributing to Unchained Storefront! 🎉 

It's people like you that make Unchained Storefront such a great tool for the e-commerce community. We welcome contributions from everyone, regardless of their level of experience.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to support@unchained.shop.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js 22.x installed (check `.nvmrc`)
- Git installed
- A GitHub account
- Basic knowledge of TypeScript, React, and Next.js

### Finding Issues to Work On

- Look for issues labeled `good first issue` - these are perfect for beginners
- Issues labeled `help wanted` need attention
- Check issues labeled `bug` if you enjoy debugging
- `enhancement` labels indicate feature requests

Don't see an issue for what you want to work on? Create one! We'd love to hear your ideas.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, please include:

- **Clear and descriptive title**
- **Steps to reproduce** the issue
- **Expected behavior** - what you expected to happen
- **Actual behavior** - what actually happened
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

**Bug Report Template:**
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 22.x]
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear and descriptive title**
- **Detailed description** of the proposed enhancement
- **Use cases** - explain why this enhancement would be useful
- **Possible implementation** approach (if you have ideas)

### Contributing Code

#### Your First Code Contribution

1. **Fork the repository** and create your branch from `main`
2. **Set up your development environment** (see below)
3. **Make your changes** following our style guidelines
4. **Write or update tests** if applicable
5. **Ensure all tests pass**
6. **Submit a pull request**

## 💻 Development Setup

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/your-username/unchained-storefront.git
cd unchained-storefront

# Add upstream remote
git remote add upstream https://github.com/unchainedshop/unchained-storefront.git

# Install dependencies
npm install

# Copy environment example
cp .env.example .env

# Start development server
npm run dev
```

### Development Workflow

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes and test locally
npm run dev

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Build to ensure no build errors
npm run build
```

### Working with GraphQL

When modifying GraphQL queries or mutations:

```bash
# Update GraphQL schema types
npm run update-schema

# This will regenerate TypeScript types from the schema
```

### Working with Translations

When adding new UI strings:

```bash
# Extract new translation strings
npm run extract-translation

# Add translations to i18n/*.json files

# Compile translations
npm run compile-translation
```

## 🎨 Style Guidelines

### Code Style

We use ESLint and Prettier to maintain code quality. Configuration is already set up in the project.

#### TypeScript/JavaScript

- Use TypeScript for all new code
- Prefer functional components with hooks
- Use meaningful variable and function names
- Add type definitions for all props and function parameters

```typescript
// Good
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Component logic
};

// Avoid
const ProductCard = ({ product, onAddToCart }) => {
  // Missing types
};
```

#### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistency with existing design patterns
- Support dark mode for all new components

```tsx
// Good - responsive and dark mode aware
<div className="p-4 bg-white dark:bg-slate-900 md:p-6 lg:p-8">
  <h2 className="text-lg font-semibold text-slate-900 dark:text-white md:text-xl">
    Title
  </h2>
</div>
```

### File Organization

```
modules/
└── feature-name/
    ├── components/       # React components
    ├── hooks/           # Custom hooks
    ├── utils/           # Utility functions
    ├── fragments/       # GraphQL fragments
    └── index.ts         # Module exports
```

### Component Guidelines

- One component per file
- Use descriptive component names
- Keep components small and focused
- Extract reusable logic into custom hooks

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(cart): add quantity selector to cart items"

# Bug fix
git commit -m "fix(checkout): resolve payment validation error"

# Documentation
git commit -m "docs: update installation instructions"

# Multiple changes (use body)
git commit -m "feat(products): add product filtering

- Add price range filter
- Add category filter
- Add search functionality
- Update UI components"
```

## 🔄 Pull Request Process

1. **Update your fork** with the latest upstream changes:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and commit them using our commit guidelines

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Link to any related issues
   - Screenshots for UI changes
   - Testing instructions

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Testing
- [ ] I have tested these changes locally
- [ ] All existing tests pass
- [ ] I have added tests for new functionality

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the project style guidelines
- [ ] I have performed a self-review
- [ ] I have added necessary documentation
- [ ] My changes generate no new warnings
- [ ] I have updated translations if needed
```

### Review Process

1. A maintainer will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Celebrate! 🎉 You've contributed to Unchained Storefront!

## 🧪 Testing

### Running Tests

```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck

# Build the project
npm run build
```

### Manual Testing Checklist

Before submitting a PR, please test:

- [ ] Desktop view (Chrome, Firefox, Safari)
- [ ] Mobile view (responsive design)
- [ ] Dark mode functionality
- [ ] Internationalization (at least EN and DE)
- [ ] Core user flows:
  - [ ] Browse products
  - [ ] Add to cart
  - [ ] Checkout process
  - [ ] User registration/login

## 🌐 Community

### Getting Help

- **GitHub Discussions**: Ask questions in [Discussions](https://github.com/unchainedshop/unchained-storefront/discussions)
- **Email**: Reach out to hello@unchained.shop

### Stay Updated

- Follow [@unchainedshop](https://twitter.com/unchainedshop) on Twitter
- Read our [blog](https://unchained.shop/blog)
- Star and watch the repository for updates

## 🏆 Recognition

Contributors who make significant contributions will be:
- Added to our [Contributors list](README.md#contributors)
- Mentioned in release notes
- Invited to our private contributors channel

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you again for your interest in contributing to Unchained Storefront! We look forward to your contributions and to building an amazing e-commerce platform together. 🚀

If you have any questions, please don't hesitate to reach out!