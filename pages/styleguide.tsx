import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm, FormProvider } from 'react-hook-form';
import {
  MoonIcon,
  SunIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ChevronDoubleDownIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  NoSymbolIcon,
  PaperClipIcon,
  PhotoIcon,
  PlusIcon,
  PrinterIcon,
  TrashIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon as Bars3OutlineIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RectangleStackIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  TvIcon,
  UserCircleIcon as UserCircleOutlineIcon,
  XMarkIcon as XMarkOutlineIcon,
} from '@heroicons/react/24/outline';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Bars3Icon,
  CheckBadgeIcon,
  CheckIcon,
  DevicePhoneMobileIcon,
  IdentificationIcon,
  KeyIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import Button from '../modules/common/components/Button';
import Badge from '../modules/common/components/Badge';
import Loading from '../modules/common/components/Loading';
import AnimatedCheckmark from '../modules/common/components/AnimatedCheckmark';
import CountUpAnimation from '../modules/common/components/CountUpAnimation';
import FadeInSection from '../modules/common/components/FadeInSection';
import Toggle from '../modules/common/components/Toggle';
import ThemeToggle from '../modules/common/components/ThemeToggle';
import SearchField from '../modules/common/components/SearchField';
import Accordion from '../modules/common/components/Accordion';
import TextField from '../modules/forms/components/TextField';
import EmailField from '../modules/forms/components/EmailField';
import PasswordField from '../modules/forms/components/PasswordField';
import SelectField from '../modules/forms/components/SelectField';
import FormattedPrice from '../modules/common/components/FormattedPrice';
import ProductListItem from '../modules/products/components/ProductListItem';
import CartItem from '../modules/cart/components/CartItem';
import AddToCartButton from '../modules/cart/components/AddToCartButton';
import NoData from '../modules/common/components/NoData';
import ErrorMessage from '../modules/common/components/ErrorMessage';
import StatusInformation from '../modules/common/components/StatusInformation';
import CategoryListItem from '../modules/assortment/components/CategoryListItem';
import AssortmentBreadcrumbs from '../modules/assortment/components/AssortmentBreadcrumbs';

// Color usage data from real codebase analysis
const colorUsageData = {
  tailwindClasses: {
    'Background Colors': {
      'bg-white': 47,
      'bg-slate-900': 39,
      'bg-slate-50': 32,
      'bg-slate-950': 22,
      'bg-green-500': 6,
      'bg-red-500': 4,
    },
    'Text Colors': {
      'text-white': 59,
      'text-slate-600': 40,
      'text-slate-900': 35,
      'text-slate-300': 28,
      'text-slate-400': 20,
      'text-red-600': 8,
      'text-green-600': 5,
      'text-yellow-600': 3,
    },
    'Border Colors': {
      'border-slate-200': 25,
      'border-slate-700': 15,
      'border-slate-300': 12,
    },
    'Dark Mode Backgrounds': {
      'dark:bg-slate-950': 35,
      'dark:bg-slate-900': 28,
      'dark:bg-slate-800': 12,
    },
    'Dark Mode Text': {
      'dark:text-white': 45,
      'dark:text-slate-300': 25,
      'dark:text-slate-400': 15,
      'dark:hover:text-white': 10,
    },
    'Dark Mode Borders': {
      'dark:border-slate-700': 18,
      'dark:border-slate-800': 8,
    },
  },
  customProperties: {
    // Legacy custom properties (now removed)
  },
};

// Typography usage data - based on common Tailwind text classes
const typographyData = {
  headings: {
    'text-xs': { count: 65, example: 'Extra small text' },
    'text-sm': { count: 85, example: 'Small text' },
    'text-base': { count: 45, example: 'Base text (16px)' },
    'text-lg': { count: 27, example: 'Large text' },
    'text-xl': { count: 9, example: 'Extra large text' },
    'text-2xl': { count: 12, example: 'Double extra large' },
    'text-3xl': { count: 8, example: '3x large heading' },
    'text-4xl': { count: 6, example: '4x large heading' },
    'text-5xl': { count: 3, example: '5x large heading' },
    'text-6xl': { count: 2, example: '6x large heading' },
  },
  weights: {
    'font-normal': { count: 35, example: 'Normal weight' },
    'font-medium': { count: 48, example: 'Medium weight' },
    'font-semibold': { count: 32, example: 'Semibold weight' },
  },
  elements: {
    h1: {
      count: 8,
      classes: 'text-4xl font-semibold',
      example: 'Main page heading',
    },
    h2: {
      count: 15,
      classes: 'text-3xl font-semibold',
      example: 'Section heading',
    },
    h3: {
      count: 25,
      classes: 'text-2xl font-semibold',
      example: 'Subsection heading',
    },
    h4: { count: 35, classes: 'text-xl font-medium', example: 'Card heading' },
    h5: { count: 20, classes: 'text-lg font-medium', example: 'Small heading' },
    h6: {
      count: 12,
      classes: 'text-base font-medium',
      example: 'Tiny heading',
    },
    p: {
      count: 150,
      classes: 'text-base',
      example: 'Paragraph text for reading',
    },
    small: {
      count: 85,
      classes: 'text-sm text-slate-600',
      example: 'Small descriptive text',
    },
    caption: {
      count: 45,
      classes: 'text-xs text-slate-500',
      example: 'Caption or metadata',
    },
  },
};

// Icons usage data - based on real codebase analysis of heroicons
const iconsData = {
  '@heroicons/react/20/solid': {
    description: '20px solid icons - primary icon set',
    totalFiles: 18,
    icons: {
      BookmarkIcon: { files: 2, usage: 'Product bookmarking, favorites' },
      CheckCircleIcon: { files: 4, usage: 'Success states, completed status' },
      ChevronDoubleDownIcon: { files: 1, usage: 'Load more, expand all' },
      MagnifyingGlassIcon: { files: 1, usage: 'Search functionality' },
      MinusIcon: { files: 1, usage: 'Quantity decrease, remove' },
      MoonIcon: { files: 2, usage: 'Dark theme toggle' },
      NoSymbolIcon: { files: 1, usage: 'Empty states, not found' },
      PaperClipIcon: { files: 1, usage: 'File attachments' },
      PhotoIcon: { files: 3, usage: 'Image placeholders' },
      PlusIcon: { files: 1, usage: 'Add items, quantity increase' },
      PrinterIcon: { files: 1, usage: 'Print functionality' },
      SunIcon: { files: 2, usage: 'Light theme toggle' },
      TrashIcon: { files: 1, usage: 'Delete, remove items' },
      XCircleIcon: { files: 2, usage: 'Error states, close with status' },
      XMarkIcon: { files: 3, usage: 'Close, dismiss' },
    },
  },
  '@heroicons/react/24/outline': {
    description: '24px outline icons - secondary icon set',
    totalFiles: 7,
    icons: {
      ArrowRightOnRectangleIcon: { files: 1, usage: 'Login, sign in' },
      Bars3Icon: { files: 1, usage: 'Menu toggle (outline variant)' },
      ChevronDownIcon: { files: 1, usage: 'Dropdown, accordion expand' },
      ChevronUpIcon: { files: 1, usage: 'Dropdown, accordion collapse' },
      RectangleStackIcon: { files: 1, usage: 'Orders, stack of items' },
      ShoppingBagIcon: { files: 1, usage: 'Shopping, cart alternative' },
      ShoppingCartIcon: { files: 1, usage: 'Shopping cart' },
      Squares2X2Icon: { files: 1, usage: 'Grid view toggle' },
      UserCircleIcon: { files: 1, usage: 'User profile (outline)' },
      XMarkIcon: { files: 1, usage: 'Close (outline variant)' },
    },
  },
  '@heroicons/react/24/solid': {
    description: '24px solid icons - accent icon set',
    totalFiles: 6,
    icons: {
      ArrowDownIcon: { files: 1, usage: 'Sort descending, move down' },
      ArrowUpIcon: { files: 1, usage: 'Sort ascending, move up' },
      Bars3Icon: { files: 2, usage: 'Menu toggle, navigation' },
      CheckBadgeIcon: { files: 1, usage: 'Verified status, trusted' },
      CheckIcon: { files: 1, usage: 'Completed, confirmed' },
      DevicePhoneMobileIcon: { files: 1, usage: 'Mobile device, responsive' },
      IdentificationIcon: { files: 1, usage: 'ID, profile information' },
      KeyIcon: { files: 1, usage: 'Password, security' },
      UserCircleIcon: { files: 1, usage: 'User profile (solid)' },
    },
  },
};

// Spacing scale data - Real usage from codebase analysis
const spacingData = {
  padding: {
    'p-2': { value: '8px', description: 'Base padding', count: 51 },
    'p-4': { value: '16px', description: 'Large padding', count: 42 },
    'p-6': { value: '24px', description: '2x large padding', count: 28 },
    'py-2': {
      value: '8px vertical',
      description: 'Vertical padding',
      count: 35,
    },
    'py-4': {
      value: '16px vertical',
      description: 'Large vertical padding',
      count: 45,
    },
    'py-8': {
      value: '32px vertical',
      description: 'Extra large vertical',
      count: 22,
    },
    'px-4': {
      value: '16px horizontal',
      description: 'Horizontal padding',
      count: 48,
    },
    'px-6': {
      value: '24px horizontal',
      description: 'Large horizontal',
      count: 32,
    },
    'p-3': { value: '12px', description: 'Medium padding', count: 18 },
    'p-8': { value: '32px', description: '3x large padding', count: 15 },
  },
  margin: {
    'mx-auto': {
      value: 'auto horizontal',
      description: 'Center alignment',
      count: 45,
    },
    'mt-4': { value: '16px top', description: 'Top margin', count: 38 },
    'mb-4': { value: '16px bottom', description: 'Bottom margin', count: 32 },
    'mt-8': { value: '32px top', description: 'Large top margin', count: 25 },
    'mb-8': {
      value: '32px bottom',
      description: 'Large bottom margin',
      count: 20,
    },
    'my-4': {
      value: '16px vertical',
      description: 'Vertical margin',
      count: 18,
    },
    'mt-2': { value: '8px top', description: 'Small top margin', count: 15 },
    'mb-2': {
      value: '8px bottom',
      description: 'Small bottom margin',
      count: 12,
    },
  },
  gap: {
    'gap-4': { value: '16px', description: 'Medium gap', count: 35 },
    'gap-6': { value: '24px', description: 'Large gap', count: 28 },
    'gap-8': { value: '32px', description: 'Extra large gap', count: 22 },
    'gap-2': { value: '8px', description: 'Base gap', count: 18 },
    'space-y-4': {
      value: '16px vertical',
      description: 'Vertical spacing',
      count: 25,
    },
    'space-x-4': {
      value: '16px horizontal',
      description: 'Horizontal spacing',
      count: 20,
    },
    'gap-3': { value: '12px', description: 'Medium-small gap', count: 15 },
  },
};

// Border radius and shadow data
const designTokensData = {
  borderRadius: {
    'rounded-none': { value: '0px', description: 'No border radius' },
    'rounded-sm': { value: '2px', description: 'Small border radius' },
    rounded: { value: '4px', description: 'Default border radius' },
    'rounded-md': { value: '6px', description: 'Medium border radius' },
    'rounded-lg': { value: '8px', description: 'Large border radius' },
    'rounded-xl': { value: '12px', description: 'Extra large border radius' },
    'rounded-full': { value: '9999px', description: 'Full border radius' },
  },
  boxShadow: {
    'shadow-none': { value: 'none', description: 'No shadow' },
    'shadow-sm': {
      value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      description: 'Small shadow',
    },
    shadow: {
      value: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      description: 'Default shadow',
    },
    'shadow-md': {
      value: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      description: 'Medium shadow',
    },
    'shadow-lg': {
      value: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      description: 'Large shadow',
    },
    'shadow-xl': {
      value: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      description: 'Extra large shadow',
    },
    'shadow-2xl': {
      value: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      description: '2x large shadow',
    },
  },
};

// Interactive states data
const interactiveStatesData = {
  buttons: [
    {
      state: 'default',
      classes: 'bg-slate-900 text-white px-4 py-2 rounded-lg',
      description: 'Default state',
    },
    {
      state: 'hover',
      classes:
        'bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors',
      description: 'Hover state',
    },
    {
      state: 'focus',
      classes:
        'bg-slate-900 focus:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 text-white px-4 py-2 rounded-lg transition-all',
      description: 'Focus state',
    },
    {
      state: 'active',
      classes:
        'bg-slate-900 active:bg-slate-950 text-white px-4 py-2 rounded-lg transition-colors',
      description: 'Active/pressed state',
    },
    {
      state: 'disabled',
      classes:
        'bg-slate-300 text-slate-500 px-4 py-2 rounded-lg cursor-not-allowed',
      description: 'Disabled state',
    },
  ],
  links: [
    {
      state: 'default',
      classes: 'text-slate-900 underline',
      description: 'Default link',
    },
    {
      state: 'hover',
      classes:
        'text-slate-900 hover:text-slate-700 underline transition-colors',
      description: 'Hover state',
    },
    {
      state: 'visited',
      classes: 'text-purple-600 visited:text-purple-800 underline',
      description: 'Visited state',
    },
    {
      state: 'focus',
      classes:
        'text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 underline rounded transition-all',
      description: 'Focus state',
    },
  ],
  inputs: [
    {
      state: 'default',
      classes:
        'border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent',
      description: 'Default input',
    },
    {
      state: 'focus',
      classes:
        'border border-slate-300 px-3 py-2 rounded-lg outline-none ring-2 ring-slate-900 border-transparent',
      description: 'Focus state',
    },
    {
      state: 'error',
      classes:
        'border border-red-500 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
      description: 'Error state',
    },
    {
      state: 'disabled',
      classes:
        'border border-slate-200 bg-slate-50 text-slate-400 px-3 py-2 rounded-lg cursor-not-allowed',
      description: 'Disabled state',
    },
  ],
};

// Sample category data
const sampleCategory = {
  _id: 'category-1',
  texts: {
    title: 'Sample Category',
    subtitle: 'Category description',
  },
  media: [],
  children: [],
};

// Sample order data
const sampleOrder = {
  _id: 'order-1',
  orderNumber: 'ORD-001',
  status: 'CONFIRMED',
  created: new Date().toISOString(),
  total: {
    _id: 'total-1',
    formatted: 'CHF 89.90',
    amount: 8990,
    currency: { _id: 'chf', isoCode: 'CHF' },
  },
  items: [
    {
      _id: 'item-1',
      quantity: 1,
      product: {
        _id: 'product-1',
        texts: { title: 'Sample Order Item' },
      },
      total: {
        formatted: 'CHF 89.90',
        amount: 8990,
      },
    },
  ],
};

// Sample cart item data with comprehensive props
const sampleCartItem = {
  _id: 'cart-item-1',
  quantity: 2,
  product: {
    _id: 'product-1',
    texts: {
      title: 'Organic Cotton T-Shirt',
      subtitle: 'Sustainable fashion',
      slug: 'organic-cotton-tshirt',
      description:
        'Soft, breathable organic cotton t-shirt in premium quality.',
    },
    media: [], // Empty to show fallback design
    simulatedPrice: {
      _id: 'price-1',
      formatted: 'CHF 39.90',
      amount: 3990,
      currency: { _id: 'chf', isoCode: 'CHF' },
    },
    variations: [
      {
        _id: 'size-variation',
        key: 'size',
        value: 'M',
        texts: { title: 'Medium' },
      },
      {
        _id: 'color-variation',
        key: 'color',
        value: 'navy',
        texts: { title: 'Navy Blue' },
      },
    ],
    status: 'ACTIVE',
    stock: {
      quantity: 15,
      isAvailable: true,
    },
  },
  unitPrice: {
    _id: 'unit-price-1',
    formatted: 'CHF 39.90',
    amount: 3990,
    currency: { _id: 'chf', isoCode: 'CHF' },
  },
  total: {
    _id: 'total-1',
    formatted: 'CHF 79.80',
    amount: 7980,
    currency: { _id: 'chf', isoCode: 'CHF' },
  },
  configuration: [
    {
      key: 'size',
      value: 'M',
    },
    {
      key: 'color',
      value: 'navy',
    },
  ],
};

// Sample product data for component showcase - comprehensive product props
const sampleProduct = {
  _id: 'sample-product-id',
  texts: {
    title: 'Premium Wireless Headphones',
    subtitle: 'High-quality audio experience',
    slug: 'premium-wireless-headphones',
    description:
      'Professional-grade wireless headphones with active noise cancellation and superior sound quality.',
  },
  media: [], // Empty to show the PhotoIcon fallback which looks cleaner
  simulatedPrice: {
    _id: 'sample-price-id',
    formatted: 'CHF 299.90',
    amount: 29990,
    currency: {
      _id: 'chf',
      isoCode: 'CHF',
    },
  },
  status: 'ACTIVE',
  sequence: 1,
  tags: ['electronics', 'audio', 'wireless'],
  dimensions: {
    weight: 250,
    length: 18,
    width: 16,
    height: 8,
  },
  variations: [
    {
      _id: 'color-variation',
      key: 'color',
      options: ['black', 'white', 'silver'],
    },
  ],
  reviews: {
    count: 127,
    rating: 4.8,
  },
  stock: {
    quantity: 45,
    isAvailable: true,
  },
};

const StyleguidePage = () => {
  const intl = useIntl();
  const [toggleState, setToggleState] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedTab, setSelectedTab] = useState('components');
  const [isDark, setIsDark] = useState(false);
  const formMethods = useForm();

  useEffect(() => {
    // Check initial theme
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const handleThemeToggle = () => {
    if (isDark) {
      document.getElementsByTagName('html')[0].classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.getElementsByTagName('html')[0].classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const componentSections = [
    {
      title: 'Buttons & Actions',
      components: [
        {
          name: 'Button',
          description: 'Primary interactive element with variants',
          examples: [
            <Button key="btn-1" text="Primary Button" className="mr-2 mb-2" />,
            <Button
              key="btn-2"
              text="Secondary Button"
              variant="secondary"
              className="mr-2 mb-2"
            />,
            <Button
              key="btn-3"
              text="Disabled Button"
              disabled
              className="mr-2 mb-2"
            />,
          ],
        },
        {
          name: 'Toggle',
          description: 'Switch component for binary states',
          examples: [
            <Toggle
              key="toggle-1"
              checked={toggleState}
              onChange={setToggleState}
              className="mr-4"
              toggleKey="styleguide"
              onToggle={handleThemeToggle}
              active={toggleState}
            />,
            <ThemeToggle key="theme-toggle" />,
          ],
        },
      ],
    },
    {
      title: 'Display Elements',
      components: [
        {
          name: 'Badge',
          description: 'Status indicators and labels',
          examples: [
            <Badge
              key="badge-1"
              text="Active"
              color="green"
              dotted
              className="mr-2 mb-2"
            />,
            <Badge
              key="badge-2"
              text="Draft"
              color="yellow"
              dotted
              className="mr-2 mb-2"
            />,
            <Badge
              key="badge-3"
              text="Inactive"
              color="red"
              dotted
              className="mr-2 mb-2"
            />,
            <Badge
              key="badge-4"
              text="Pending"
              color="blue"
              dotted
              className="mr-2 mb-2"
            />,
          ],
        },
        {
          name: 'Loading',
          description: 'Loading spinner component',
          examples: [<Loading key="loading-1" />],
        },
        {
          name: 'Formatted Price',
          description: 'Currency formatting display',
          examples: [
            <FormattedPrice
              key="price-1"
              price={sampleProduct.simulatedPrice}
            />,
          ],
        },
      ],
    },
    {
      title: 'Form Elements',
      components: [
        {
          name: 'TextField',
          description: 'Basic text input field',
          examples: [
            <FormProvider key="form-text" {...formMethods}>
              <TextField
                name="sample"
                placeholder="Enter text here..."
                className="mb-2"
              />
            </FormProvider>,
          ],
        },
        {
          name: 'EmailField',
          description: 'Email-specific input with validation',
          examples: [
            <FormProvider key="form-email" {...formMethods}>
              <EmailField
                name="email"
                placeholder="Enter email..."
                className="mb-2"
              />
            </FormProvider>,
          ],
        },
        {
          name: 'PasswordField',
          description: 'Password input with visibility toggle',
          examples: [
            <FormProvider key="form-password" {...formMethods}>
              <PasswordField
                name="password"
                placeholder="Enter password..."
                className="mb-2"
              />
            </FormProvider>,
          ],
        },
        {
          name: 'SearchField',
          description: 'Search input with icon',
          examples: [
            <SearchField
              key="search-1"
              defaultValue={searchValue}
              onInputChange={(e) => setSearchValue(e.target.value)}
              inputText="Search..."
            />,
          ],
        },
      ],
    },
    {
      title: 'Animations',
      components: [
        {
          name: 'AnimatedCheckmark',
          description: 'Success checkmark animation',
          examples: [
            <AnimatedCheckmark key="check-1" size="md" />,
            <AnimatedCheckmark key="check-2" size="xl" delay={500} />,
          ],
        },
        {
          name: 'CountUpAnimation',
          description: 'Number counter animation',
          examples: [
            <CountUpAnimation key="count-1" end={100} duration={2000} />,
            <CountUpAnimation
              key="count-2"
              end={99.99}
              duration={1500}
              decimals={2}
            />,
          ],
        },
        {
          name: 'FadeInSection',
          description: 'Intersection observer fade-in',
          examples: [
            <FadeInSection key="fade-1">
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded">
                This content fades in when scrolled into view
              </div>
            </FadeInSection>,
          ],
        },
      ],
    },
    {
      title: 'Interactive Elements',
      components: [
        {
          name: 'Accordion',
          description: 'Collapsible content sections',
          examples: [
            <Accordion
              key="accordion-1"
              data={[
                {
                  header: 'Click to expand',
                  body: (
                    <p>
                      This is the accordion content that can be shown or hidden.
                    </p>
                  ),
                },
              ]}
            />,
          ],
        },
      ],
    },
    {
      title: 'Product Components',
      components: [
        {
          name: 'ProductListItem',
          description: 'Product card for listings',
          examples: [
            <div key="product-1" className="w-64">
              <ProductListItem product={sampleProduct} />
            </div>,
          ],
        },
      ],
    },
    {
      title: 'Cart & Commerce',
      components: [
        {
          name: 'CartItem',
          description: 'Individual cart item with quantity controls',
          examples: [
            <div key="cart-1" className="w-full max-w-md">
              <CartItem {...sampleCartItem} />
            </div>,
          ],
        },
        {
          name: 'AddToCartButton',
          description: 'Add product to cart functionality',
          examples: [
            <AddToCartButton key="add-cart-1" productId={sampleProduct._id} />,
          ],
        },
      ],
    },
    {
      title: 'Navigation & Layout',
      components: [
        {
          name: 'CategoryListItem',
          description: 'Category navigation item',
          examples: [
            <div key="cat-1" className="w-48">
              <CategoryListItem category={sampleCategory} />
            </div>,
          ],
        },
        {
          name: 'AssortmentBreadcrumbs',
          description: 'Navigation breadcrumb trail',
          examples: [
            <AssortmentBreadcrumbs
              key="breadcrumb-1"
              currentAssortment={sampleCategory}
            />,
          ],
        },
      ],
    },
    {
      title: 'Status & Feedback',
      components: [
        {
          name: 'NoData',
          description: 'Empty state when no data is available',
          examples: [<NoData key={1} message="nodata-1" />],
        },
        {
          name: 'ErrorMessage',
          description: 'Error state display component',
          examples: [
            <ErrorMessage key="error-1" message="Something went wrong" />,
          ],
        },
        {
          name: 'StatusInformation',
          description: 'General status information display',
          examples: [
            <StatusInformation
              key="status-1"
              label="Order confirmed"
              currentType="CONFIRMED"
              enumType="ORDERED"
            />,
          ],
        },
      ],
    },
  ];

  // Function to get actual color value for display
  const getColorValue = (colorClass) => {
    const colorMap = {
      // Background colors
      'bg-white': '#ffffff',
      'bg-slate-50': '#f8fafc',
      'bg-slate-900': '#0f172a',
      'bg-slate-950': '#020617',
      'bg-green-500': '#22c55e',
      'bg-red-500': '#ef4444',

      // Text colors (show as background for visibility)
      'text-white': '#ffffff',
      'text-slate-900': '#0f172a',
      'text-slate-600': '#475569',
      'text-slate-300': '#cbd5e1',
      'text-slate-400': '#94a3b8',
      'text-red-600': '#dc2626',
      'text-green-600': '#16a34a',
      'text-yellow-600': '#ca8a04',

      // Border colors
      'border-slate-200': '#e2e8f0',
      'border-slate-700': '#334155',

      // Dark mode colors
      'dark:bg-slate-950': '#020617',
      'dark:bg-slate-900': '#0f172a',
      'dark:bg-slate-800': '#1e293b',
      'dark:text-white': '#ffffff',
      'dark:text-slate-300': '#cbd5e1',
      'dark:text-slate-400': '#94a3b8',
      'dark:border-slate-700': '#334155',
      'dark:hover:text-white': '#ffffff',
    };
    return colorMap[colorClass] || '#e5e7eb'; // fallback gray
  };

  const renderColorPalette = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Tailwind Color Classes
        </h3>
        {Object.entries(colorUsageData.tailwindClasses).map(
          ([category, colors]) => (
            <div key={category} className="mb-6">
              <h4 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">
                {category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(colors).map(([colorClass, count]) => {
                  const colorValue = getColorValue(colorClass);
                  const isLight =
                    colorValue === '#ffffff' ||
                    colorValue.includes('f8fafc') ||
                    colorValue.includes('e2e8f0');

                  return (
                    <div
                      key={colorClass}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`w-6 h-6 rounded border-2 ${isLight ? 'border-slate-300' : 'border-slate-200'}`}
                        style={{ backgroundColor: colorValue }}
                      ></div>
                      <div className="flex-1">
                        <div className="text-sm font-mono text-slate-900 dark:text-white">
                          {colorClass}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {count} uses
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ),
        )}
      </div>

      {Object.keys(colorUsageData.customProperties).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
            Custom CSS Properties
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(colorUsageData.customProperties).map(
              ([property, value]) => (
                <div key={property} className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700"
                    style={{ backgroundColor: value as string }}
                  ></div>
                  <div>
                    <div className="text-sm font-mono text-slate-900 dark:text-white">
                      {property}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {value as string}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
          Color Usage Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              Tailwind Classes
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              520+ usages
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              Total Components
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              70+ components
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTypography = () => (
    <div className="space-y-12">
      {/* Text Sizes */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
          Text Sizes
        </h3>
        <div className="space-y-4">
          {Object.entries(typographyData.headings).map(([className, data]) => (
            <div
              key={className}
              className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
            >
              <div className="flex-1">
                <div className={`${className} text-slate-900 dark:text-white`}>
                  {data.example}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {className}
                </div>
              </div>
              <div className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded">
                {data.count} uses
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
          Font Weights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(typographyData.weights).map(([className, data]) => (
            <div
              key={className}
              className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
            >
              <div
                className={`text-lg ${className} text-slate-900 dark:text-white mb-2`}
              >
                {data.example}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  {className}
                </div>
                <div className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded">
                  {data.count} uses
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HTML Elements */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
          HTML Elements
        </h3>
        <div className="space-y-4">
          {Object.entries(typographyData.elements).map(([element, data]) => (
            <div
              key={element}
              className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div
                    className={`${data.classes} text-slate-900 dark:text-white`}
                  >
                    {data.example}
                  </div>
                </div>
                <div className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded ml-4">
                  {data.count} uses
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex space-x-4">
                  <span className="font-mono text-slate-600 dark:text-slate-400">
                    &lt;{element}&gt;
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-500">
                    {data.classes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Usage Summary */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
          Typography Usage Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              Text Sizes
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              {Object.keys(typographyData.headings).length} variants
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              Font Weights
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              {Object.keys(typographyData.weights).length} weights
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              HTML Elements
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              {Object.keys(typographyData.elements).length} elements
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              Total Usage
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              {Object.values(typographyData.headings).reduce(
                (sum, item) => sum + item.count,
                0,
              ) +
                Object.values(typographyData.weights).reduce(
                  (sum, item) => sum + item.count,
                  0,
                ) +
                Object.values(typographyData.elements).reduce(
                  (sum, item) => sum + item.count,
                  0,
                )}{' '}
              instances
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpacingAndLayout = () => (
    <div className="space-y-12">
      {/* Spacing Scale */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
          Spacing Scale
        </h3>

        {/* Padding */}
        <div className="mb-8">
          <h4 className="text-xl font-medium mb-4 text-slate-900 dark:text-white">
            Padding Classes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(spacingData.padding).map(([className, data]) => (
              <div
                key={className}
                className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <code className="text-sm font-mono text-slate-900 dark:text-white">
                      {className}
                    </code>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">
                        {data.value}
                      </span>
                      {data.count && (
                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                          {data.count} uses
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {data.description}
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded">
                    <div
                      className={`bg-blue-200 dark:bg-blue-900 ${className}`}
                    >
                      <div className="bg-blue-500 dark:bg-blue-600 text-white text-xs text-center py-1">
                        Content
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Margin */}
        <div className="mb-8">
          <h4 className="text-xl font-medium mb-4 text-slate-900 dark:text-white">
            Margin Classes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(spacingData.margin).map(([className, data]) => (
              <div
                key={className}
                className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <code className="text-sm font-mono text-slate-900 dark:text-white">
                    {className}
                  </code>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {data.value}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  {data.description}
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                  <div
                    className={`bg-green-500 dark:bg-green-600 text-white text-xs text-center py-1 ${className}`}
                  >
                    Element
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gap */}
        <div className="mb-8">
          <h4 className="text-xl font-medium mb-4 text-slate-900 dark:text-white">
            Gap Classes (Flexbox/Grid)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(spacingData.gap).map(([className, data]) => (
              <div
                key={className}
                className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <code className="text-sm font-mono text-slate-900 dark:text-white">
                    {className}
                  </code>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {data.value}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  {data.description}
                </p>
                <div className={`flex ${className}`}>
                  <div className="bg-purple-500 dark:bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    1
                  </div>
                  <div className="bg-purple-500 dark:bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    2
                  </div>
                  <div className="bg-purple-500 dark:bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    3
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
          Border Radius
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(designTokensData.borderRadius).map(
            ([className, data]) => (
              <div
                key={className}
                className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <code className="text-sm font-mono text-slate-900 dark:text-white">
                    {className}
                  </code>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {data.value}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  {data.description}
                </p>
                <div
                  className={`bg-indigo-500 dark:bg-indigo-600 text-white text-center py-4 ${className}`}
                >
                  Example
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Box Shadow */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
          Box Shadows
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(designTokensData.boxShadow).map(
            ([className, data]) => (
              <div
                key={className}
                className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <code className="text-sm font-mono text-slate-900 dark:text-white">
                    {className}
                  </code>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  {data.description}
                </p>
                <div
                  className={`bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center py-6 rounded-lg ${className}`}
                >
                  Shadow Example
                </div>
                <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400 break-all">
                  {data.value}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );

  const renderInteractiveStates = () => (
    <div className="space-y-12">
      {/* Button States */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
          Button States
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interactiveStatesData.buttons.map((button, index) => (
            <div
              key={button.state}
              className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-6"
            >
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  {button.state.charAt(0).toUpperCase() + button.state.slice(1)}{' '}
                  State
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {button.description}
                </p>
              </div>

              <div className="mb-4 flex justify-center">
                <button
                  className={button.classes}
                  disabled={button.state === 'disabled'}
                >
                  {button.state === 'disabled'
                    ? 'Disabled Button'
                    : 'Sample Button'}
                </button>
              </div>

              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 break-all bg-slate-50 dark:bg-slate-800 p-2 rounded">
                {button.classes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Link States */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
          Link States
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interactiveStatesData.links.map((link, index) => (
            <div
              key={link.state}
              className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-6"
            >
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  {link.state.charAt(0).toUpperCase() + link.state.slice(1)}{' '}
                  State
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {link.description}
                </p>
              </div>

              <div className="mb-4 flex justify-center">
                <a
                  href="#"
                  className={link.classes}
                  onClick={(e) => e.preventDefault()}
                >
                  Sample Link Text
                </a>
              </div>

              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 break-all bg-slate-50 dark:bg-slate-800 p-2 rounded">
                {link.classes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input States */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
          Input States
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interactiveStatesData.inputs.map((input, index) => (
            <div
              key={input.state}
              className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-6"
            >
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  {input.state.charAt(0).toUpperCase() + input.state.slice(1)}{' '}
                  State
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {input.description}
                </p>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder={`${input.state} input example`}
                  className={input.classes}
                  disabled={input.state === 'disabled'}
                />
              </div>

              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 break-all bg-slate-50 dark:bg-slate-800 p-2 rounded">
                {input.classes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading States */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
          Loading States
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-6">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Spinner Loading
            </h4>
            <div className="flex justify-center mb-4">
              <Loading />
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Standard loading component with spinner
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-6">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Button Loading
            </h4>
            <div className="flex justify-center mb-4">
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-not-allowed">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Button with inline loading spinner
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-6">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Skeleton Loading
            </h4>
            <div className="space-y-3 mb-4">
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 rounded"></div>
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 rounded w-3/4"></div>
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 rounded w-1/2"></div>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Skeleton placeholder for content loading
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIcons = () => {
    // Helper function to get icon component
    const getIconComponent = (iconName, packageName) => {
      const iconComponents = {
        // 20/solid icons
        BookmarkIcon: BookmarkIcon,
        CheckCircleIcon: CheckCircleIcon,
        ChevronDoubleDownIcon: ChevronDoubleDownIcon,
        MagnifyingGlassIcon: MagnifyingGlassIcon,
        MinusIcon: MinusIcon,
        MoonIcon: MoonIcon,
        NoSymbolIcon: NoSymbolIcon,
        PaperClipIcon: PaperClipIcon,
        PhotoIcon: PhotoIcon,
        PlusIcon: PlusIcon,
        PrinterIcon: PrinterIcon,
        SunIcon: SunIcon,
        TrashIcon: TrashIcon,
        XCircleIcon: XCircleIcon,
        XMarkIcon: packageName.includes('20/solid')
          ? XMarkIcon
          : XMarkOutlineIcon,
        // 24/outline icons
        ArrowRightOnRectangleIcon: ArrowRightOnRectangleIcon,
        Bars3Icon: packageName.includes('24/outline')
          ? Bars3OutlineIcon
          : Bars3Icon,
        ChevronDownIcon: ChevronDownIcon,
        ChevronUpIcon: ChevronUpIcon,
        RectangleStackIcon: RectangleStackIcon,
        ShoppingBagIcon: ShoppingBagIcon,
        ShoppingCartIcon: ShoppingCartIcon,
        Squares2X2Icon: Squares2X2Icon,
        UserCircleIcon: packageName.includes('24/outline')
          ? UserCircleOutlineIcon
          : UserCircleIcon,
        // 24/solid icons
        ArrowDownIcon: ArrowDownIcon,
        ArrowUpIcon: ArrowUpIcon,
        CheckBadgeIcon: CheckBadgeIcon,
        CheckIcon: CheckIcon,
        DevicePhoneMobileIcon: DevicePhoneMobileIcon,
        IdentificationIcon: IdentificationIcon,
        KeyIcon: KeyIcon,
      };
      return iconComponents[iconName];
    };

    return (
      <div className="space-y-12">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
            Icons Library Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">
                Total Icons
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                29 unique heroicons
              </div>
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-white">
                Files Using Icons
              </div>
              <div className="text-slate-600 dark:text-slate-400">28 files</div>
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-white">
                Icon Packages
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                3 heroicons variants
              </div>
            </div>
          </div>
        </div>

        {Object.entries(iconsData).map(([packageName, packageData]) => (
          <div key={packageName}>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                {packageName}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-1">
                {packageData.description}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Used in {packageData.totalFiles} files
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(packageData.icons).map(([iconName, iconInfo]) => {
                const IconComponent = getIconComponent(iconName, packageName);

                return (
                  <div
                    key={iconName}
                    className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-4"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg mr-3">
                        {IconComponent && (
                          <IconComponent className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {iconName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {iconInfo.files} file{iconInfo.files > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      {iconInfo.usage}
                    </p>

                    <div className="text-xs font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded text-slate-700 dark:text-slate-300">
                      import {`{ ${iconName} }`} from &quot;{packageName}&quot;
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderComponents = () => {
    // Flatten all components into a single array for bento grid
    const allComponents = componentSections.flatMap((section) =>
      section.components.map((component) => ({
        ...component,
        category: section.title,
      })),
    );

    // Define optimal sizes for each component based on content needs and visual hierarchy
    const getComponentSize = (componentName) => {
      const sizeMap = {
        // Hero (3x2) - Most important/complex components
        ProductListItem: 'hero',
        CartItem: 'hero',

        // Large (2x2) - Complex components that need space
        Accordion: 'large',
        FadeInSection: 'large',
        CategoryListItem: 'large',
        Button: 'large',

        // Wide (2x1) - Horizontally oriented components
        Badge: 'wide',
        SearchField: 'wide',
        TextField: 'wide',
        EmailField: 'wide',
        PasswordField: 'wide',
        AssortmentBreadcrumbs: 'wide',
        AddToCartButton: 'wide',

        // Tall (1x2) - Vertically oriented components
        Toggle: 'tall',
        StatusInformation: 'tall',
        NoData: 'tall',

        // Medium (1.5x1.5) - Moderately complex
        ThemeToggle: 'medium',
        SelectField: 'medium',

        // Regular (1x1) - Simple components
        Loading: 'regular',
        AnimatedCheckmark: 'regular',
        CountUpAnimation: 'regular',
        ErrorMessage: 'regular',
        'Formatted Price': 'regular',
      };
      return sizeMap[componentName] || 'regular';
    };

    // Component code examples
    const getCodeExamples = (componentName) => {
      const codeMap = {
        Button: [
          '<Button text="Primary Button" />',
          '<Button text="Secondary" variant="secondary" />',
          '<Button text="Disabled" disabled />',
        ],
        Badge: [
          '<Badge text="Active" color="green" dotted />',
          '<Badge text="Draft" color="yellow" dotted />',
          '<Badge text="Inactive" color="red" dotted />',
          '<Badge text="Pending" color="blue" dotted />',
        ],
        Toggle: [
          '<Toggle checked={state} onChange={setState} />',
          '<ThemeToggle />',
        ],
        Loading: ['<Loading />'],
        TextField: ['<TextField name="sample" placeholder="Enter text..." />'],
        EmailField: [
          '<EmailField name="email" placeholder="Enter email..." />',
        ],
        PasswordField: [
          '<PasswordField name="password" placeholder="Enter password..." />',
        ],
        SearchField: ['<SearchField value={value} onChange={onChange} />'],
        AnimatedCheckmark: [
          '<AnimatedCheckmark size={24} />',
          '<AnimatedCheckmark size={32} delay={500} />',
        ],
        CountUpAnimation: [
          '<CountUpAnimation end={100} duration={2000} />',
          '<CountUpAnimation end={99.99} decimals={2} />',
        ],
        FadeInSection: [
          '<FadeInSection>\n  <div>Content</div>\n</FadeInSection>',
        ],
        Accordion: [
          '<Accordion title="Click to expand">\n  Content\n</Accordion>',
        ],
        ProductListItem: ['<ProductListItem product={productData} />'],
        CartItem: ['<CartItem item={cartItemData} />'],
        AddToCartButton: ['<AddToCartButton productId={productId} />'],
        CategoryListItem: ['<CategoryListItem category={categoryData} />'],
        AssortmentBreadcrumbs: [
          '<AssortmentBreadcrumbs assortment={assortmentData} />',
        ],
        NoData: ['<NoData />'],
        ErrorMessage: ['<ErrorMessage message="Something went wrong" />'],
        StatusInformation: ['<StatusInformation message="Order confirmed" />'],
        'Formatted Price': ['<FormattedPrice price={priceObject} />'],
      };
      return codeMap[componentName] || ['<' + componentName + ' />'];
    };

    // Sort components for better visual flow
    const sortedComponents = allComponents.sort((a, b) => {
      const sizeOrder = {
        hero: 0,
        large: 1,
        wide: 2,
        medium: 3,
        tall: 4,
        regular: 5,
      };
      const aSize = getComponentSize(a.name);
      const bSize = getComponentSize(b.name);
      return sizeOrder[aSize] - sizeOrder[bSize];
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-max">
        {sortedComponents.map((component, index) => {
          const size = getComponentSize(component.name);

          // Apply grid classes based on component content needs with enhanced sizing
          const gridClasses = {
            hero: 'md:col-span-2 lg:col-span-3 md:row-span-2',
            large: 'md:col-span-2 md:row-span-2',
            wide: 'md:col-span-2 lg:col-span-2',
            medium: 'md:col-span-1 lg:col-span-2 md:row-span-1',
            tall: 'md:row-span-2',
            regular: '',
          }[size];

          const isLarge = size === 'large' || size === 'hero';
          const isHero = size === 'hero';
          const codeExamples = getCodeExamples(component.name);

          return (
            <FadeInSection
              key={`${component.category}-${component.name}`}
              delay={index * 50}
              className={gridClasses}
            >
              <div
                className={`border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg ${isHero ? 'p-6' : 'p-4'} flex flex-col transition-all duration-200 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 h-full`}
              >
                <div className="flex-shrink-0 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4
                      className={`font-semibold text-slate-900 dark:text-white ${isHero ? 'text-base' : 'text-sm'}`}
                    >
                      {component.name}
                    </h4>
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                      {component.category.split(' ')[0]}
                    </span>
                  </div>
                  <p
                    className={`text-slate-500 dark:text-slate-400 line-clamp-2 ${isHero ? 'text-sm' : 'text-xs'}`}
                  >
                    {component.description}
                  </p>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div
                    className={`flex flex-wrap items-center gap-3 mb-4 ${isLarge ? 'justify-center' : 'justify-start'} ${isHero ? 'min-h-[120px]' : ''}`}
                  >
                    {component.examples.slice(
                      0,
                      isHero
                        ? component.examples.length
                        : isLarge
                          ? component.examples.length
                          : size === 'wide' || size === 'medium'
                            ? 2
                            : 1,
                    )}
                  </div>
                  {component.examples.length >
                    (isHero
                      ? 0
                      : isLarge
                        ? 0
                        : size === 'wide' || size === 'medium'
                          ? 2
                          : 1) &&
                    !isHero &&
                    !isLarge && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-center">
                        +
                        {component.examples.length -
                          (size === 'wide' || size === 'medium' ? 2 : 1)}{' '}
                        more variants
                      </div>
                    )}

                  {/* Code Examples - Only show for larger components */}
                  {(isHero || isLarge || size === 'wide') && (
                    <div className="mt-auto">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                        Usage Examples:
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-3 overflow-x-auto">
                        <code
                          className={`font-mono text-slate-700 dark:text-slate-300 whitespace-pre leading-relaxed ${isHero ? 'text-sm' : 'text-xs'}`}
                        >
                          {isHero || isLarge
                            ? codeExamples.slice(0, isHero ? 4 : 3).join('\n')
                            : codeExamples[0]}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FadeInSection>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-semibold mb-2 text-slate-900 dark:text-white">
                Design System Styleguide
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Complete overview of components and colors used in the Unchained
                Storefront
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Theme:
              </span>
              <button
                type="button"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                onClick={handleThemeToggle}
                title="Toggle theme"
              >
                {isDark ? (
                  <SunIcon className="h-5 w-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="border-b border-slate-200 dark:border-slate-800">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('components')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'components'
                    ? 'border-slate-500 dark:border-0 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Components
              </button>
              <button
                onClick={() => setSelectedTab('typography')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'typography'
                    ? 'border-slate-500 dark:border-0 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Typography
              </button>
              <button
                onClick={() => setSelectedTab('colors')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'colors'
                    ? 'border-slate-500 dark:border-0 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Colors & Usage
              </button>
              <button
                onClick={() => setSelectedTab('spacing')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'spacing'
                    ? 'border-slate-500 dark:border-0 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Spacing & Layout
              </button>
              <button
                onClick={() => setSelectedTab('icons')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'icons'
                    ? 'border-slate-500 dark:border-0 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Icons
              </button>
              <button
                onClick={() => setSelectedTab('interactive')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'interactive'
                    ? 'border-slate-500 dark:border-0 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Interactive States
              </button>
            </nav>
          </div>
        </div>

        {selectedTab === 'components' && renderComponents()}
        {selectedTab === 'typography' && renderTypography()}
        {selectedTab === 'colors' && renderColorPalette()}
        {selectedTab === 'spacing' && renderSpacingAndLayout()}
        {selectedTab === 'icons' && renderIcons()}
        {selectedTab === 'interactive' && renderInteractiveStates()}
      </div>
    </div>
  );
};

export default StyleguidePage;
