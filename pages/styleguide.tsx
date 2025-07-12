import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm, FormProvider } from 'react-hook-form';
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
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

// Color usage data from analysis
const colorUsageData = {
  tailwindClasses: {
    'Slate Colors': {
      'bg-slate-900': 45,
      'text-slate-900': 40,
      'text-slate-600': 35,
      'text-slate-300': 30,
      'bg-slate-50': 25,
      'border-slate-200': 40,
      'border-slate-700': 25,
      'bg-slate-100': 20,
      'hover:bg-slate-800': 20,
      'bg-slate-800': 15
    },
    'Base Colors': {
      'bg-white': 50,
      'text-white': 45,
      'bg-transparent': 15,
      'bg-black': 8
    },
    'Status Colors': {
      'text-red-600': 10,
      'bg-green-500': 8,
      'text-yellow-600': 5
    }
  },
  customProperties: {
    '--color-brand': '#232323',
    '--color-brand-lightest': '#e7e7e7',
    '--color-brand-darker': '#121212',
    '--color-danger-600': '#DC2626',
    '--color-success-100': '#D1FAE5',
    '--color-warning-200': '#FDE68A'
  },
  hexColors: {
    '#232323': 15,
    '#495057': 8,
    '#ffffff': 10,
    '#121212': 5,
    '#e7e7e7': 5
  }
};

// Sample category data
const sampleCategory = {
  _id: 'category-1',
  texts: {
    title: 'Sample Category',
    subtitle: 'Category description'
  },
  media: [],
  children: []
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
    currency: { _id: 'chf', isoCode: 'CHF' }
  },
  items: [
    {
      _id: 'item-1',
      quantity: 1,
      product: {
        _id: 'product-1',
        texts: { title: 'Sample Order Item' }
      },
      total: {
        formatted: 'CHF 89.90',
        amount: 8990
      }
    }
  ]
};

// Sample cart item data
const sampleCartItem = {
  _id: 'cart-item-1',
  quantity: 2,
  product: {
    _id: 'product-1',
    texts: {
      title: 'Sample Product in Cart',
      slug: 'sample-cart-product'
    },
    media: [],
    simulatedPrice: {
      _id: 'price-1',
      formatted: 'CHF 25.00',
      amount: 2500,
      currency: { _id: 'chf', isoCode: 'CHF' }
    }
  },
  total: {
    _id: 'total-1',
    formatted: 'CHF 50.00',
    amount: 5000,
    currency: { _id: 'chf', isoCode: 'CHF' }
  }
};

// Sample product data for component showcase - using no media to show fallback design
const sampleProduct = {
  _id: 'sample-product-id',
  texts: {
    title: 'Sample Product',
    subtitle: 'Product showcase',
    slug: 'sample-product'
  },
  media: [], // Empty to show the PhotoIcon fallback which looks cleaner
  simulatedPrice: {
    _id: 'sample-price-id',
    formatted: 'CHF 29.90',
    amount: 2990,
    currency: {
      _id: 'chf',
      isoCode: 'CHF'
    }
  }
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
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const handleThemeToggle = () => {
    if (isDark) {
      document.getElementsByTagName("html")[0].classList.remove("dark");
      localStorage.theme = "light";
      setIsDark(false);
    } else {
      document.getElementsByTagName("html")[0].classList.add("dark");
      localStorage.theme = "dark";
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
            <Button key="btn-2" text="Secondary Button" variant="secondary" className="mr-2 mb-2" />,
            <Button key="btn-3" text="Disabled Button" disabled className="mr-2 mb-2" />
          ]
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
            />,
            <ThemeToggle key="theme-toggle" />
          ]
        }
      ]
    },
    {
      title: 'Display Elements',
      components: [
        {
          name: 'Badge',
          description: 'Status indicators and labels',
          examples: [
            <Badge key="badge-1" text="Default" className="mr-2 mb-2" />,
            <Badge key="badge-2" text="Error" color="red" className="mr-2 mb-2" />,
            <Badge key="badge-3" text="Success" color="green" className="mr-2 mb-2" />,
            <Badge key="badge-4" text="Warning" color="yellow" className="mr-2 mb-2" />
          ]
        },
        {
          name: 'Loading',
          description: 'Loading spinner component',
          examples: [
            <Loading key="loading-1" />
          ]
        },
        {
          name: 'Formatted Price',
          description: 'Currency formatting display',
          examples: [
            <FormattedPrice key="price-1" price={sampleProduct.simulatedPrice} />
          ]
        }
      ]
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
            </FormProvider>
          ]
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
            </FormProvider>
          ]
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
            </FormProvider>
          ]
        },
        {
          name: 'SearchField',
          description: 'Search input with icon',
          examples: [
            <SearchField 
              key="search-1" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
            />
          ]
        }
      ]
    },
    {
      title: 'Animations',
      components: [
        {
          name: 'AnimatedCheckmark',
          description: 'Success checkmark animation',
          examples: [
            <AnimatedCheckmark key="check-1" size={24} />,
            <AnimatedCheckmark key="check-2" size={32} delay={500} />
          ]
        },
        {
          name: 'CountUpAnimation',
          description: 'Number counter animation',
          examples: [
            <CountUpAnimation key="count-1" end={100} duration={2000} />,
            <CountUpAnimation key="count-2" end={99.99} duration={1500} decimals={2} />
          ]
        },
        {
          name: 'FadeInSection',
          description: 'Intersection observer fade-in',
          examples: [
            <FadeInSection key="fade-1">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded">
                This content fades in when scrolled into view
              </div>
            </FadeInSection>
          ]
        }
      ]
    },
    {
      title: 'Interactive Elements',
      components: [
        {
          name: 'Accordion',
          description: 'Collapsible content sections',
          examples: [
            <Accordion key="accordion-1" title="Click to expand">
              <p>This is the accordion content that can be shown or hidden.</p>
            </Accordion>
          ]
        }
      ]
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
            </div>
          ]
        }
      ]
    },
    {
      title: 'Cart & Commerce',
      components: [
        {
          name: 'CartItem',
          description: 'Individual cart item with quantity controls',
          examples: [
            <div key="cart-1" className="w-full max-w-md">
              <CartItem item={sampleCartItem} />
            </div>
          ]
        },
        {
          name: 'AddToCartButton',
          description: 'Add product to cart functionality',
          examples: [
            <AddToCartButton key="add-cart-1" productId={sampleProduct._id} />
          ]
        }
      ]
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
            </div>
          ]
        },
        {
          name: 'AssortmentBreadcrumbs',
          description: 'Navigation breadcrumb trail',
          examples: [
            <AssortmentBreadcrumbs key="breadcrumb-1" assortment={sampleCategory} />
          ]
        }
      ]
    },
    {
      title: 'Status & Feedback',
      components: [
        {
          name: 'NoData',
          description: 'Empty state when no data is available',
          examples: [
            <NoData key="nodata-1" />
          ]
        },
        {
          name: 'ErrorMessage',
          description: 'Error state display component',
          examples: [
            <ErrorMessage key="error-1" error="Something went wrong" />
          ]
        },
        {
          name: 'StatusInformation',
          description: 'General status information display',
          examples: [
            <StatusInformation key="status-1" message="Order confirmed" />
          ]
        }
      ]
    }
  ];

  const renderColorPalette = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Tailwind Color Classes</h3>
        {Object.entries(colorUsageData.tailwindClasses).map(([category, colors]) => (
          <div key={category} className="mb-6">
            <h4 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">{category}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(colors).map(([colorClass, count]) => (
                <div key={colorClass} className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded border border-slate-300 dark:border-zinc-700 ${colorClass}`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-mono text-slate-900 dark:text-white">{colorClass}</div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400">{count} uses</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Custom CSS Properties</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(colorUsageData.customProperties).map(([property, value]) => (
            <div key={property} className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded border border-slate-300 dark:border-zinc-700" 
                style={{ backgroundColor: value }}
              ></div>
              <div>
                <div className="text-sm font-mono text-slate-900 dark:text-white">{property}</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Hex Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(colorUsageData.hexColors).map(([hex, count]) => (
            <div key={hex} className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded border border-slate-300 dark:border-zinc-700" 
                style={{ backgroundColor: hex }}
              ></div>
              <div>
                <div className="text-sm font-mono text-slate-900 dark:text-white">{hex}</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400">{count} uses</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Color Usage Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-slate-900 dark:text-white">Tailwind Classes</div>
            <div className="text-slate-600 dark:text-zinc-400">~800+ usages</div>
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">Custom Properties</div>
            <div className="text-slate-600 dark:text-zinc-400">15 variables</div>
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">Hex Colors</div>
            <div className="text-slate-600 dark:text-zinc-400">25+ unique</div>
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">Total Components</div>
            <div className="text-slate-600 dark:text-zinc-400">70+ components</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComponents = () => {
    // Flatten all components into a single array for bento grid
    const allComponents = componentSections.flatMap(section => 
      section.components.map(component => ({
        ...component,
        category: section.title
      }))
    );

    // Define optimal sizes for each component based on content needs
    const getComponentSize = (componentName) => {
      const sizeMap = {
        // Large (2x2) - Complex components that need space
        'ProductListItem': 'large',
        'CartItem': 'large', 
        'Accordion': 'large',
        'FadeInSection': 'large',

        // Wide (2x1) - Horizontally oriented components
        'Button': 'wide',
        'Badge': 'wide',
        'SearchField': 'wide',
        'TextField': 'wide',
        'EmailField': 'wide', 
        'PasswordField': 'wide',
        'AssortmentBreadcrumbs': 'wide',

        // Tall (1x2) - Vertically oriented components
        'Toggle': 'tall',
        'CategoryListItem': 'tall',
        'AddToCartButton': 'tall',
        'StatusInformation': 'tall',

        // Regular (1x1) - Simple components
        'Loading': 'regular',
        'AnimatedCheckmark': 'regular',
        'CountUpAnimation': 'regular',
        'NoData': 'regular',
        'ErrorMessage': 'regular',
        'Formatted Price': 'regular'
      };
      return sizeMap[componentName] || 'regular';
    };

    // Component code examples
    const getCodeExamples = (componentName) => {
      const codeMap = {
        'Button': [
          '<Button text="Primary Button" />',
          '<Button text="Secondary" variant="secondary" />',
          '<Button text="Disabled" disabled />'
        ],
        'Badge': [
          '<Badge text="Default" />',
          '<Badge text="Error" color="red" />',
          '<Badge text="Success" color="green" />',
          '<Badge text="Warning" color="yellow" />'
        ],
        'Toggle': [
          '<Toggle checked={state} onChange={setState} />',
          '<ThemeToggle />'
        ],
        'Loading': [
          '<Loading />'
        ],
        'TextField': [
          '<TextField name="sample" placeholder="Enter text..." />'
        ],
        'EmailField': [
          '<EmailField name="email" placeholder="Enter email..." />'
        ],
        'PasswordField': [
          '<PasswordField name="password" placeholder="Enter password..." />'
        ],
        'SearchField': [
          '<SearchField value={value} onChange={onChange} />'
        ],
        'AnimatedCheckmark': [
          '<AnimatedCheckmark size={24} />',
          '<AnimatedCheckmark size={32} delay={500} />'
        ],
        'CountUpAnimation': [
          '<CountUpAnimation end={100} duration={2000} />',
          '<CountUpAnimation end={99.99} decimals={2} />'
        ],
        'FadeInSection': [
          '<FadeInSection>\n  <div>Content</div>\n</FadeInSection>'
        ],
        'Accordion': [
          '<Accordion title="Click to expand">\n  Content\n</Accordion>'
        ],
        'ProductListItem': [
          '<ProductListItem product={productData} />'
        ],
        'CartItem': [
          '<CartItem item={cartItemData} />'
        ],
        'AddToCartButton': [
          '<AddToCartButton productId={productId} />'
        ],
        'CategoryListItem': [
          '<CategoryListItem category={categoryData} />'
        ],
        'AssortmentBreadcrumbs': [
          '<AssortmentBreadcrumbs assortment={assortmentData} />'
        ],
        'NoData': [
          '<NoData />'
        ],
        'ErrorMessage': [
          '<ErrorMessage error="Something went wrong" />'
        ],
        'StatusInformation': [
          '<StatusInformation message="Order confirmed" />'
        ],
        'Formatted Price': [
          '<FormattedPrice price={priceObject} />'
        ]
      };
      return codeMap[componentName] || ['<' + componentName + ' />'];
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
        {allComponents.map((component, index) => {
          const size = getComponentSize(component.name);
          
          // Apply grid classes based on component content needs
          const gridClasses = {
            'large': 'md:col-span-2 md:row-span-2',
            'wide': 'md:col-span-2',
            'tall': 'md:row-span-2',
            'regular': ''
          }[size];

          const isLarge = size === 'large';
          const codeExamples = getCodeExamples(component.name);

          return (
            <div 
              key={`${component.category}-${component.name}`} 
              className={`border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg p-4 ${gridClasses} flex flex-col`}
            >
              <div className="flex-shrink-0 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{component.name}</h4>
                  <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-full">
                    {component.category.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">{component.description}</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className={`flex flex-wrap items-center gap-2 mb-3 ${isLarge ? 'justify-center' : 'justify-start'}`}>
                  {component.examples.slice(0, isLarge ? component.examples.length : (size === 'wide' ? 3 : 2))}
                </div>
                {component.examples.length > (size === 'wide' ? 3 : 2) && !isLarge && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                    +{component.examples.length - (size === 'wide' ? 3 : 2)} more variants
                  </div>
                )}
                
                {/* Code Examples */}
                <div className="mt-auto">
                  <div className="text-xs text-slate-500 dark:text-zinc-400 mb-1">Usage:</div>
                  <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded p-3 overflow-x-auto">
                    <code className="text-xs font-mono text-slate-700 dark:text-zinc-300 whitespace-pre leading-relaxed">
                      {isLarge ? codeExamples.slice(0, 3).join('\n') : codeExamples[0]}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">Design System Styleguide</h1>
              <p className="text-slate-600 dark:text-zinc-400">
                Complete overview of components and colors used in the Unchained Storefront
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-zinc-400">Theme:</span>
              <button
                type="button"
                className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
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
          <div className="border-b border-slate-200 dark:border-zinc-800">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('components')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'components'
                    ? 'border-slate-500 dark:border-zinc-400 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
                }`}
              >
                Components
              </button>
              <button
                onClick={() => setSelectedTab('colors')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'colors'
                    ? 'border-slate-500 dark:border-zinc-400 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
                }`}
              >
                Colors & Usage
              </button>
            </nav>
          </div>
        </div>

        {selectedTab === 'components' ? renderComponents() : renderColorPalette()}
      </div>
    </div>
  );
};


export default StyleguidePage;