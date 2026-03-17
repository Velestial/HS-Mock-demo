import React, { useState, lazy, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { Product } from './types';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import VideoHero from './components/sections/VideoHero';
import TrustBar from './components/sections/TrustBar';
import CategoryGrid from './components/sections/CategoryGrid';
import BestSellers from './components/sections/BestSellers';
import WhyHeySkipper from './components/sections/WhyHeySkipper';
import YouTubeSection from './components/sections/YouTubeSection';
import FishOnCTA from './components/sections/FishOnCTA';
import Reviews from './components/sections/Reviews';
import Footer from './components/layout/Footer';
import CartSidebar from './components/widgets/CartSidebar';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ScrollToTop from './components/widgets/ScrollToTop';
import MobileAddedSuccess from './components/widgets/MobileAddedSuccess';
import { initGA, trackPageView } from './utils/analytics';
import { initStamped } from './utils/stamped';
import StampedCarousel from './components/sections/StampedCarousel';

// Stripe initializes outside React to avoid re-creating on render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

// Lazy-loaded page components — only downloaded when the user navigates to them
const CheckoutPage = lazy(() => import('./components/pages/CheckoutPage'));
const FAQPage = lazy(() => import('./components/pages/FAQPage'));
const BundlesPage = lazy(() => import('./components/pages/BundlesPage'));
const BaitPage = lazy(() => import('./components/pages/BaitPage'));
const TacklePage = lazy(() => import('./components/pages/TacklePage'));
const ShopPage = lazy(() => import('./components/pages/ShopPage'));
const EbooksPage = lazy(() => import('./components/pages/EbooksPage'));
const RodPage = lazy(() => import('./components/pages/RodPage'));
const ProductPage = lazy(() => import('./components/pages/ProductPage'));
const PrivacyPolicyPage = lazy(() => import('./components/pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./components/pages/TermsPage'));
const RodWarrantyPage = lazy(() => import('./components/pages/RodWarrantyPage'));
const FinalChancePage = lazy(() => import('./components/pages/FinalChancePage'));
const AuthWrapper = lazy(() => import('./components/pages/AuthWrapper'));


const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
      <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">Loading...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'checkout' | 'faq' | 'bundles' | 'bait' | 'tackle' | 'shop' | 'ebooks' | 'rods' | 'product' | 'privacy' | 'terms' | 'warranty' | 'account' | 'final-chance'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // Track the view the user navigated from, so ProductPage "Back" returns to the right place
  const [previousView, setPreviousView] = useState<typeof view>('home');
  // Ref to block Emotive popup injection during checkout
  const isCheckoutRef = React.useRef(false);

  // Initialize GA4 once on mount
  React.useEffect(() => {
    initGA();
  }, []);

  // Initialize Stamped.io widget SDK once on mount
  React.useEffect(() => {
    initStamped();
  }, []);

  // Keep checkout ref in sync to guard Emotive popup injection
  React.useEffect(() => {
    isCheckoutRef.current = view === 'checkout';
  }, [view]);

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
      // Guard: skip if URL not configured, iframe already injected, or user is on checkout
      if (!emotiveUrl || document.getElementById('emotive-popup-iframe') || isCheckoutRef.current) return;
      const iframe = document.createElement('iframe');
      iframe.id = 'emotive-popup-iframe';
      iframe.src = emotiveUrl;
      iframe.setAttribute('allowtransparency', 'true');
      iframe.style.cssText = 'position:fixed;bottom:0;right:0;width:100%;height:100%;border:none;z-index:9999;pointer-events:none;background:transparent;';
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
                setPreviousView(view);
                setSelectedProduct(product);
                setView('product');
              }}
            />
            <CartSidebar onCheckout={() => setView('checkout')} />
            <main className="flex-grow flex flex-col">
              {view === 'home' && (
                <ErrorBoundary>
                  <>
                    {/* 01 · Video Hero */}
                    <VideoHero onShopAll={() => setView('shop')} />
                    {/* 02 · Trust Bar */}
                    <TrustBar />
                    {/* 03 · Featured Product — 9'2" Rod */}
                    <Hero />
                    {/* 04 · Category Grid */}
                    <CategoryGrid
                      onRods={() => setView('rods')}
                      onBait={() => setView('bait')}
                      onBundles={() => setView('bundles')}
                      onTackle={() => setView('tackle')}
                    />
                    {/* 05 · Best Sellers */}
                    <BestSellers
                      onProductSelect={(product) => {
                        setPreviousView('home');
                        setSelectedProduct(product);
                        setView('product');
                      }}
                      onShopAll={() => setView('shop')}
                    />
                    {/* 06 · Why Hey Skipper */}
                    <WhyHeySkipper />
                    {/* 07 · YouTube */}
                    <YouTubeSection />
                    {/* 08 · Reviews */}
                    <Reviews />
                    <StampedCarousel />
                    {/* 09 · Fish On CTA */}
                    <FishOnCTA />
                  </>
                </ErrorBoundary>
              )}
              {view === 'product' && selectedProduct && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <ProductPage
                      product={selectedProduct}
                      onBack={() => setView(previousView)}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'checkout' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Elements stripe={stripePromise}>
                      <CheckoutPage onBack={() => setView('home')} />
                    </Elements>
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'faq' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <FAQPage onBack={() => setView('home')} />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'bundles' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <BundlesPage
                      onBack={() => setView('home')}
                      onProductSelect={(product) => {
                        setPreviousView(view);
                        setSelectedProduct(product);
                        setView('product');
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'bait' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <BaitPage
                      onBack={() => setView('home')}
                      onProductSelect={(product) => {
                        setPreviousView(view);
                        setSelectedProduct(product);
                        setView('product');
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'tackle' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <TacklePage
                      onBack={() => setView('home')}
                      onProductSelect={(product) => {
                        setPreviousView(view);
                        setSelectedProduct(product);
                        setView('product');
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'shop' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <ShopPage
                      onBack={() => setView('home')}
                      onProductSelect={(product) => {
                        setPreviousView(view);
                        setSelectedProduct(product);
                        setView('product');
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'ebooks' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <EbooksPage
                      onBack={() => setView('home')}
                      onProductSelect={(product) => {
                        setPreviousView(view);
                        setSelectedProduct(product);
                        setView('product');
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'rods' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <RodPage
                      onBack={() => setView('home')}
                      onProductSelect={(product) => {
                        setPreviousView(view);
                        setSelectedProduct(product);
                        setView('product');
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'privacy' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <PrivacyPolicyPage onBack={() => setView('home')} />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'terms' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <TermsPage onBack={() => setView('home')} />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'warranty' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <RodWarrantyPage onBack={() => setView('home')} />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'final-chance' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <FinalChancePage
                      onNavigateHome={() => setView('home')}
                      onProductClick={(product) => {
                        setPreviousView(view);
                        setSelectedProduct(product);
                        setView('product');
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              {view === 'account' && (
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <AuthWrapper onBack={() => setView('home')} />
                  </Suspense>
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