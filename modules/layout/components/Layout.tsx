import { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import SidebarNavigation from "./SidebarNavigation";
import SideCart from "../../cart/components/SideCart";
import { useAppContext } from "../../common/components/AppContextWrapper";

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isCartOpen } = useAppContext();

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <Header onSidebarToggle={handleSidebarToggle} />
      <main className="container mx-auto mb-6 sm:mb-16 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
      <SidebarNavigation isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <SideCart isOpen={isCartOpen} />
    </>
  );
};

export default Layout;
