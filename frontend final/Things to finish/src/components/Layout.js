import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, showNavbar = true, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-amber-50">
      {showNavbar && <Navbar />}
      
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
