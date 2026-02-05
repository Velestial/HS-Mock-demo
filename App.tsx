import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import ProductDescription from './components/ProductDescription';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import CheckoutPage from './components/CheckoutPage';
import FAQPage from './components/FAQPage';
import BundlesPage from './components/BundlesPage';
import BaitPage from './components/BaitPage';
import TacklePage from './components/TacklePage';
import EbooksPage from './components/EbooksPage';
import RodPage from './components/RodPage';
import ProductPage from './components/ProductPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsPage from './components/TermsPage';
import RodWarrantyPage from './components/RodWarrantyPage';
import FinalChancePage from './components/FinalChancePage';
import AuthWrapper from './components/AuthWrapper';
import ScrollToTop from './components/ScrollToTop';
import EmotivePopup from './components/EmotivePopup';
import MobileAddedSuccess from './components/MobileAddedSuccess';


import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Product } from './data/products';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'checkout' | 'faq' | 'bundles' | 'bait' | 'tackle' | 'ebooks' | 'rods' | 'product' | 'privacy' | 'terms' | 'warranty' | 'account' | 'final-chance'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col relative">
          <EmotivePopup />
          <MobileAddedSuccess />
          <div className="max-w-[1920px] w-full mx-auto border-x border-black bg-white shadow-2xl shadow-black/5 relative">
            <Navbar
              onNavigateHome={() => setView('home')}
              onNavigateFAQ={() => setView('faq')}
              onNavigateBundles={() => setView('bundles')}
              onNavigateBait={() => setView('bait')}
              onNavigateTackle={() => setView('tackle')}
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
                <ProductPage
                  product={selectedProduct}
                  onBack={() => setView('bait')}
                />
              )}
              {view === 'home' && (
                <>
                  <Hero />
                  <Gallery />
                  <BentoGrid />
                  <ProductDescription />
                  <Reviews />
                </>
              )}
              {view === 'checkout' && (
                <CheckoutPage onBack={() => setView('home')} />
              )}
              {view === 'faq' && (
                <FAQPage onBack={() => setView('home')} />
              )}
              {view === 'bundles' && (
                <BundlesPage
                  onBack={() => setView('home')}
                  onProductSelect={(product) => {
                    setSelectedProduct(product);
                    setView('product');
                  }}
                />
              )}
              {view === 'bait' && (
                <BaitPage
                  onBack={() => setView('home')}
                  onProductSelect={(product) => {
                    console.log('App: Setting selected product and changing view to product', product);
                    setSelectedProduct(product);
                    setView('product');
                  }}
                />
              )}
              {view === 'tackle' && (
                <TacklePage
                  onBack={() => setView('home')}
                  onProductSelect={(product) => {
                    setSelectedProduct(product);
                    setView('product');
                  }}
                />
              )}
              {view === 'ebooks' && (
                <EbooksPage
                  onBack={() => setView('home')}
                  onProductSelect={(product) => {
                    setSelectedProduct(product);
                    setView('product');
                  }}
                />
              )}
              {view === 'rods' && (
                <RodPage
                  onBack={() => setView('home')}
                  onProductSelect={(product) => {
                    console.log('App: Rod selected', product);
                    setSelectedProduct(product);
                    setView('product');
                  }}
                />
              )}
              {view === 'privacy' && (
                <PrivacyPolicyPage onBack={() => setView('home')} />
              )}
              {view === 'terms' && (
                <TermsPage onBack={() => setView('home')} />
              )}
              {view === 'warranty' && (
                <RodWarrantyPage onBack={() => setView('home')} />
              )}
              {view === 'final-chance' && (
                <FinalChancePage
                  onNavigateHome={() => setView('home')}
                  onProductClick={(product) => {
                    setSelectedProduct(product);
                    setView('product');
                  }}
                />
              )}
              {view === 'account' && (
                <AuthWrapper onBack={() => setView('home')} />
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
  );
};

export default App;