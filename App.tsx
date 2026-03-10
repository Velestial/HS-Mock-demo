import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { Product } from './types';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import BentoGrid from './components/sections/BentoGrid';
import ProductDescription from './components/sections/ProductDescription';
import Gallery from './components/sections/Gallery';
import Reviews from './components/sections/Reviews';
import Footer from './components/layout/Footer';
import CartSidebar from './components/widgets/CartSidebar';
import CheckoutPage from './components/pages/CheckoutPage';
import FAQPage from './components/pages/FAQPage';
import BundlesPage from './components/pages/BundlesPage';
import BaitPage from './components/pages/BaitPage';
import TacklePage from './components/pages/TacklePage';
import ShopPage from './components/pages/ShopPage';
import EbooksPage from './components/pages/EbooksPage';
import RodPage from './components/pages/RodPage';
import ProductPage from './components/pages/ProductPage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import TermsPage from './components/pages/TermsPage';
import RodWarrantyPage from './components/pages/RodWarrantyPage';
import FinalChancePage from './components/pages/FinalChancePage';
import AuthWrapper from './components/pages/AuthWrapper';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ScrollToTop from './components/widgets/ScrollToTop';
import MobileAddedSuccess from './components/widgets/MobileAddedSuccess';
import { initGA, trackPageView } from './utils/analytics';
import { initStamped } from './utils/stamped';
import StampedCarousel from './components/sections/StampedCarousel';


const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'checkout' | 'faq' | 'bundles' | 'bait' | 'tackle' | 'shop' | 'ebooks' | 'rods' | 'product' | 'privacy' | 'terms' | 'warranty' | 'account' | 'final-chance'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Initialize GA4 once on mount
  React.useEffect(() => {
    initGA();
  }, []);

  // Initialize Stamped.io widget SDK once on mount
  React.useEffect(() => {
    initStamped();
  }, []);

  // Track page_view on every view change
  React.useEffect(() => {
    const titles: Record<typeof view, string> = {
      'home': 'Home',
      'checkout': 'Checkout',
      'faq': 'FAQ',
      'bundles': 'Bundles',
      'bait': 'Bait',
      'tackle': 'Tackle',
      'shop': 'Shop',
      'ebooks': 'E-Books',
      'rods': 'Rods',
      'product': selectedProduct?.name ?? 'Product',
      'privacy': 'Privacy Policy',
      'terms': 'Terms',
      'warranty': 'Rod Warranty',
      'account': 'Account',
      'final-chance': 'Final Chance',
    };
    trackPageView(`/${view}`, titles[view] ?? view);
  }, [view]);

  // Inject Emotive SMS popup iframe after 5-second delay
  React.useEffect(() => {
    const emotiveUrl = import.meta.env.VITE_EMOTIVE_SCRIPT_URL as string | undefined;
    const timer = setTimeout(() => {
      // Guard: skip if URL not configured, or if iframe already injected
      if (!emotiveUrl || document.getElementById('emotive-popup-iframe')) return;
      const iframe = document.createElement('iframe');
      iframe.id = 'emotive-popup-iframe';
      iframe.src = emotiveUrl;
      iframe.style.cssText = 'position:fixed;bottom:0;right:0;width:100%;height:100%;border:none;z-index:9999;pointer-events:none;';
      document.body.appendChild(iframe);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ProductProvider>
      <AuthProvider>
        <CartProvider>
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col relative">
          <MobileAddedSuccess />
          <div className="max-w-[1920px] w-full mx-auto border-x border-black bg-white shadow-2xl shadow-black/5 relative">
            <Navbar
              onNavigateHome={() => setView('home')}
              onNavigateFAQ={() => setView('faq')}
              onNavigateBundles={() => setView('bundles')}
              onNavigateBait={() => setView('bait')}
              onNavigateTackle={() => setView('tackle')}
              onNavigateShop={() => setView('shop')}
              onNavigateEbooks={() => setView('ebooks')}
              onNavigateRods={() => setView('rods')}
              onNavigateFinalChance={() => setView('final-chance')}
              onNavigateAccount={() => setView('account')}
              onProductSelect={(product) => {
                setSelectedProduct(product);
                setView('product');
              }}
            />
            <CartSidebar onCheckout={() => setView('checkout')} />
            <main className="flex-grow flex flex-col">
              {view === 'product' && selectedProduct && (
                <ErrorBoundary>
                  <ProductPage
                    product={selectedProduct}
                    onBack={() => setView('bait')}
                  />
                </ErrorBoundary>
              )}
              {view === 'home' && (
                <ErrorBoundary>
                  <>
                    <Hero />
                    <Gallery />
                    <BentoGrid />
                    <ProductDescription />
                    <Reviews />
                    <StampedCarousel />
                  </>
                </ErrorBoundary>
              )}
              {view === 'checkout' && (
                <ErrorBoundary>
                  <CheckoutPage onBack={() => setView('home')} />
                </ErrorBoundary>
              )}
              {view === 'faq' && (
                <ErrorBoundary>
                  <FAQPage onBack={() => setView('home')} />
                </ErrorBoundary>
              )}
              {view === 'bundles' && (
                <ErrorBoundary>
                  <BundlesPage
                    onBack={() => setView('home')}
                    onProductSelect={(product) => {
                      setSelectedProduct(product);
                      setView('product');
                    }}
                  />
                </ErrorBoundary>
              )}
              {view === 'bait' && (
                <ErrorBoundary>
                  <BaitPage
                    onBack={() => setView('home')}
                    onProductSelect={(product) => {
                      console.log('App: Setting selected product and changing view to product', product);
                      setSelectedProduct(product);
                      setView('product');
                    }}
                  />
                </ErrorBoundary>
              )}
              {view === 'tackle' && (
                <ErrorBoundary>
                  <TacklePage
                    onBack={() => setView('home')}
                    onProductSelect={(product) => {
                      setSelectedProduct(product);
                      setView('product');
                    }}
                  />
                </ErrorBoundary>
              )}
              {view === 'shop' && (
                <ErrorBoundary>
                  <ShopPage
                    onBack={() => setView('home')}
                    onProductSelect={(product) => {
                      setSelectedProduct(product);
                      setView('product');
                    }}
                  />
                </ErrorBoundary>
              )}
              {view === 'ebooks' && (
                <ErrorBoundary>
                  <EbooksPage
                    onBack={() => setView('home')}
                    onProductSelect={(product) => {
                      setSelectedProduct(product);
                      setView('product');
                    }}
                  />
                </ErrorBoundary>
              )}
              {view === 'rods' && (
                <ErrorBoundary>
                  <RodPage
                    onBack={() => setView('home')}
                    onProductSelect={(product) => {
                      console.log('App: Rod selected', product);
                      setSelectedProduct(product);
                      setView('product');
                    }}
                  />
                </ErrorBoundary>
              )}
              {view === 'privacy' && (
                <ErrorBoundary>
                  <PrivacyPolicyPage onBack={() => setView('home')} />
                </ErrorBoundary>
              )}
              {view === 'terms' && (
                <ErrorBoundary>
                  <TermsPage onBack={() => setView('home')} />
                </ErrorBoundary>
              )}
              {view === 'warranty' && (
                <ErrorBoundary>
                  <RodWarrantyPage onBack={() => setView('home')} />
                </ErrorBoundary>
              )}
              {view === 'final-chance' && (
                <ErrorBoundary>
                  <FinalChancePage
                    onNavigateHome={() => setView('home')}
                    onProductClick={(product) => {
                      setSelectedProduct(product);
                      setView('product');
                    }}
                  />
                </ErrorBoundary>
              )}
              {view === 'account' && (
                <ErrorBoundary>
                  <AuthWrapper onBack={() => setView('home')} />
                </ErrorBoundary>
              )}
            </main>
            <Footer
              onNavigateFAQ={() => setView('faq')}
              onNavigateBundles={() => setView('bundles')}
              onNavigateBait={() => setView('bait')}
              onNavigateTackle={() => setView('tackle')}
              onNavigateEbooks={() => setView('ebooks')}
              onNavigateRods={() => setView('rods')}
              onNavigatePrivacy={() => setView('privacy')}
              onNavigateTerms={() => setView('terms')}
              onNavigateWarranty={() => setView('warranty')}
            />
            <ScrollToTop />
          </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </ProductProvider>
  );
};

export default App