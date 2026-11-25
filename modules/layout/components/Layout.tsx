import { useState } from 'react';
import { useIntl } from 'react-intl';
import Footer from './Footer';
import Header from './Header';
import SidebarNavigation from './SidebarNavigation';
import SideCart from '../../cart/components/SideCart';
import { useAppContext } from '../../common/components/AppContextWrapper';
import usePageViewTracking from '../../common/hooks/usePageViewTracking';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isCartOpen } = useAppContext();
  const { formatMessage } = useIntl();
  usePageViewTracking();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-1040 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-pop"
      >
        {formatMessage({ id: 'skip_to_content', defaultMessage: 'Skip to content' })}
      </a>
      <Header onSidebarToggle={() => setSidebarOpen((open) => !open)} />
      <main id="main" className="container-page flex-1 py-6 sm:py-10">
        {children}
      </main>
      <Footer />
      <SidebarNavigation
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <SideCart isOpen={isCartOpen} />
    </div>
  );
};

export default Layout;
