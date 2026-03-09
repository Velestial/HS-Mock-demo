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
import ScrollToTop from './components/widgets/ScrollToTop';
import EmotivePopup from './components/widgets/EmotivePopup';
import MobileAddedSuccess from './components/widgets/MobileAddedSuccess';


const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'checkout' | 'faq' | 'bundles' | 'bait' | 'tackle' | 'shop' | 'ebooks' | 'rods' | 'product' | 'privacy' | 'terms' | 'warranty' | 'account' | 'final-chance'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <ProductProvider>
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
              {view === 'shop' && (
                <ShopPage
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
    </ProductProvider>
  );
};

export default App