// Navbar — fixed top navigation with mega menu, cart icon, account link, and mobile hamburger.
import React, { useState } from 'react';
import { Menu, X, ShoppingBag, Facebook, Youtube, Instagram, ChevronDown, ArrowRight, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';

interface NavbarProps {
  onNavigateHome?: () => void;
  onNavigateFAQ?: () => void;
  onNavigateBundles?: () => void;
  onNavigateBait?: () => void;
  onNavigateTackle?: () => void;
  onNavigateEbooks?: () => void;
  onNavigateRods?: () => void;
  onNavigateFinalChance?: () => void;
  onNavigateAccount?: () => void;
  onNavigateShop?: () => void;
  onProductSelect?: (product: Product) => void;
}

const shopItems = [
  { name: 'Rods', href: '#rods', desc: 'Travel & Inshore Series' },
  { name: 'Bundles', href: '#bundles', desc: 'Complete Kits' },
  { name: 'Bait', href: '#bait', desc: 'Live & Artificial' },
  { name: 'Tackle', href: '#tackle', desc: 'Terminal & Tools' },
  { name: 'E-Books', href: '#ebooks', desc: 'Guides & Spots' }
];

const Navbar: React.FC<NavbarProps> = ({ onNavigateHome, onNavigateFAQ, onNavigateBundles, onNavigateBait, onNavigateTackle, onNavigateShop, onNavigateEbooks, onNavigateRods, onNavigateFinalChance, onNavigateAccount, onProductSelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isShopExpandedMobile, setIsShopExpandedMobile] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { setIsOpen, cartCount } = useCart();
  const { user, logout } = useAuth();
  const { products } = useProducts();

  // Close account dropdown on outside click or Escape
  React.useEffect(() => {
    if (!isAccountDropdownOpen) return;
    const handleMouseDown = () => setIsAccountDropdownOpen(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsAccountDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAccountDropdownOpen]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateHome) onNavigateHome();
  };

  const handleAccountClick = () => {
    if (onNavigateAccount) {
      onNavigateAccount();
      setIsMenuOpen(false);
      setIsAccountDropdownOpen(false);
    }
  };

  const handleLogout = async () => {
    setIsAccountDropdownOpen(false);
    setIsMenuOpen(false);
    await logout();
    if (onNavigateHome) onNavigateHome();
  };

  const handleFAQClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateFAQ) {
      onNavigateFAQ();
      setIsMenuOpen(false);
    }
  };

  const handleBundlesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateBundles) {
      onNavigateBundles();
      setIsMenuOpen(false);
      setActiveHover(null);
    }
  };

  const handleBaitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateBait) {
      onNavigateBait();
      setIsMenuOpen(false);
      setActiveHover(null);
    }
  };

  const handleTackleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateTackle) {
      onNavigateTackle();
      setIsMenuOpen(false);
      setActiveHover(null);
    }
  };

  const handleEbooksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateEbooks) {
      onNavigateEbooks();
      setIsMenuOpen(false);
      setActiveHover(null);
    }
  };

  const handleRodsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateRods) {
      onNavigateRods();
      setIsMenuOpen(false);
      setActiveHover(null);
    }
  };

  const handleShopItemClick = (e: React.MouseEvent, itemHref: string) => {
    if (itemHref === '#bundles' && onNavigateBundles) {
      e.preventDefault();
      onNavigateBundles();
      setIsMenuOpen(false);
      setActiveHover(null);
    } else if (itemHref === '#bait' && onNavigateBait) {
      e.preventDefault();
      onNavigateBait();
      setIsMenuOpen(false);
      setActiveHover(null);
    } else if (itemHref === '#tackle' && onNavigateTackle) {
      e.preventDefault();
      onNavigateTackle();
      setIsMenuOpen(false);
      setActiveHover(null);
    } else if (itemHref === '#ebooks' && onNavigateEbooks) {
      e.preventDefault();
      onNavigateEbooks();
      setIsMenuOpen(false);
      setActiveHover(null);
    } else if (itemHref === '#rods' && onNavigateRods) {
      e.preventDefault();
      onNavigateRods();
      setIsMenuOpen(false);
      setActiveHover(null);
    }
  };

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 w-full z-50 bg-white border-b border-black"
      onMouseLeave={() => setActiveHover(null)}
    >
      <div className="flex justify-between items-center h-16 px-6 max-w-[1920px] mx-auto relative z-50 bg-white">
        {/* Logo Area */}
        <div className="flex items-center">
          <a href="#" onClick={handleLogoClick}>
            <img
              src="/assets/blkheyskipper.png"
              alt="Hey Skipper"
              className="h-10 w-auto object-contain"
            />
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-12 h-full items-center">

          {/* Shop Item with Mega Menu */}
          <div
            className="h-full flex items-center relative"
            onMouseEnter={() => setActiveHover('Shop')}
          >
            <a
              href="#shop"
              onFocus={() => setActiveHover('Shop')}
              aria-haspopup="true"
              aria-expanded={activeHover === 'Shop'}
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateShop) {
                  onNavigateShop();
                  setIsMenuOpen(false);
                }
              }}
              className="text-xs font-bold uppercase tracking-widest hover:underline decoration-1 underline-offset-4 flex items-center gap-1"
            >
              Shop
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeHover === 'Shop' ? 'rotate-180' : ''}`} aria-hidden="true" />
            </a>
          </div>

          <a
            href="#rods"
            onClick={handleRodsClick}
            className="text-xs font-bold uppercase tracking-widest hover:underline decoration-1 underline-offset-4"
          >
            Rods
          </a>

          <a
            href="#faq"
            onClick={handleFAQClick}
            className="text-xs font-bold uppercase tracking-widest hover:underline decoration-1 underline-offset-4"
          >
            FAQ
          </a>

          <a
            href="#final-chance"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateFinalChance) onNavigateFinalChance();
            }}
            className="text-xs font-bold uppercase tracking-widest hover:underline decoration-1 underline-offset-4"
          >
            Final Chance
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          {/* Social Icons */}
          <div className="hidden md:flex items-center gap-4 border-r border-black/10 pr-6">
            <a href="https://www.facebook.com/heyskipperfishing/" target="_blank" rel="noopener noreferrer" aria-label="Visit Hey Skipper on Facebook" className="hover:text-neutral-500 transition-colors">
              <Facebook className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/channel/UC2eTeSNnXaRctWQ0kltSoOA" target="_blank" rel="noopener noreferrer" aria-label="Visit Hey Skipper on YouTube" className="hover:text-neutral-500 transition-colors">
              <Youtube className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/heyskipperofficial/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Visit Hey Skipper on Instagram" className="hover:text-neutral-500 transition-colors">
              <Instagram className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>

          {/* Desktop account — dropdown when logged in, plain login when guest */}
          <div className="hidden md:block relative">
            {user ? (
              <>
                <button
                  onClick={() => setIsAccountDropdownOpen((o: boolean) => !o)}
                  className="flex items-center gap-1.5 text-xs font-mono uppercase hover:text-neutral-600 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  {user.first_name || user.email.split('@')[0]}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isAccountDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-40 bg-white border border-black shadow-lg z-50"
                    >
                      <button
                        onClick={handleAccountClick}
                        className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors border-b border-black/10"
                      >
                        <User className="w-3.5 h-3.5" /> Account
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <button
                onClick={handleAccountClick}
                className="text-xs font-mono uppercase hover:text-neutral-600 transition-colors"
              >
                LOGIN
              </button>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            className="relative group p-2 -mr-2"
            onClick={() => setIsOpen(true)}
            aria-label={cartCount > 0 ? `Open cart, ${cartCount} item${cartCount === 1 ? '' : 's'}` : 'Open cart'}
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
            {cartCount > 0 && (
              <span aria-hidden="true" className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-white text-[9px] font-bold font-mono border border-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 -mr-2"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Desktop Mega Menu */}
      <AnimatePresence>
        {activeHover === 'Shop' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="hidden md:block absolute top-16 left-0 w-full bg-white border-b border-black overflow-hidden shadow-xl"
            onMouseEnter={() => setActiveHover('Shop')}
            onMouseLeave={() => setActiveHover(null)}
          >
            <div className="max-w-[1920px] mx-auto p-12 grid grid-cols-5 gap-12">

              {/* Categories Column */}
              <div className="col-span-1 flex flex-col space-y-6 border-r border-neutral-100 pr-8">
                <span className="font-mono text-[10px] uppercase text-neutral-400 mb-2 tracking-widest">Departments</span>
                {shopItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleShopItemClick(e, item.href)}
                    className="group flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="block font-bold uppercase text-sm tracking-wide group-hover:underline underline-offset-4 decoration-1">{item.name}</span>
                      <span className="block font-mono text-[10px] text-neutral-400 mt-1">{item.desc}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-neutral-400" />
                  </a>
                ))}
              </div>

              {/* Visual Area 1 - Promo */}
              <div
                className="col-span-2 relative group overflow-hidden bg-neutral-100 h-[300px] cursor-pointer"
                onClick={() => {
                  const product = products.find(p => p.name.toLowerCase().includes('surf') && p.name.toLowerCase().includes('11'));
                  if (product && onProductSelect) {
                    onProductSelect(product);
                    setIsMenuOpen(false);
                    setActiveHover(null);
                  }
                }}
              >
                <img
                  src="https://www.heyskipperfishing.com/wp-content/uploads/2024/04/rod1.jpg"
                  alt="Featured Rod"
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 mix-blend-multiply"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="relative z-10 font-mono text-xs bg-black text-white px-2 py-1 w-max mb-2">NEW_ARRIVAL</span>
                  <h3 className="relative z-10 text-3xl font-black uppercase text-black leading-none">Flagship<br />1st Edition</h3>
                </div>
              </div>

              {/* Visual Area 2 - Bundle */}
              <div className="col-span-2 relative group overflow-hidden bg-black h-[300px] cursor-pointer" onClick={handleBundlesClick}>
                {(() => {
                  const bundle = products.find(p => p.id === 'bundle-all-in-one');
                  return bundle?.image ? (
                    <img
                      src={bundle.image}
                      alt="All in One - Fishing Bait Box"
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-70 mix-blend-luminosity"
                    />
                  ) : null;
                })()}
                <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs border border-white/30 px-2 py-1">BUNDLE_SAVINGS</span>
                    <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                  <h3 className="text-3xl font-black uppercase leading-none">All in One —<br />Fishing Bait Box</h3>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden border-t border-black bg-white"
          >
            <div className="flex flex-col p-6 space-y-6">

              {/* Mobile Shop Accordion */}
              <div>
                <button
                  onClick={() => {
                    // Toggle accordion OR navigate if clicking the text part
                    if (onNavigateShop) {
                      onNavigateShop();
                      setIsMenuOpen(false);
                    }
                  }}
                  className="flex justify-between items-center w-full text-2xl font-black uppercase tracking-tight"
                >
                  Shop
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsShopExpandedMobile(!isShopExpandedMobile)
                    }}
                    className="p-2"
                  >
                    <ChevronDown className={`w-6 h-6 transition-transform ${isShopExpandedMobile ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {isShopExpandedMobile && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4 border-l border-black mt-4 space-y-4"
                    >
                      {shopItems.map(item => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={(e) => handleShopItemClick(e, item.href)}
                          className="block py-2 text-sm font-bold uppercase text-neutral-600 tracking-widest"
                        >
                          {item.name}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={handleRodsClick} className="text-2xl font-black uppercase tracking-tight text-left">Rods</button>
              <button onClick={handleBundlesClick} className="text-2xl font-black uppercase tracking-tight text-left">Bundles</button>
              <button onClick={handleBaitClick} className="text-2xl font-black uppercase tracking-tight text-left">Bait</button>
              <button onClick={handleTackleClick} className="text-2xl font-black uppercase tracking-tight text-left">Tackle</button>
              <button onClick={handleEbooksClick} className="text-2xl font-black uppercase tracking-tight text-left">E-Books</button>
              <button onClick={handleFAQClick} className="text-2xl font-black uppercase tracking-tight text-left">FAQ</button>

              {user ? (
                <div className="flex flex-col space-y-4 pt-4 border-t border-black/10">
                  <button onClick={handleAccountClick} className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight text-left">
                    <User className="w-6 h-6" /> Account
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight text-left text-red-600">
                    <LogOut className="w-6 h-6" /> Log Out
                  </button>
                </div>
              ) : (
                <button onClick={handleAccountClick} className="text-2xl font-black uppercase tracking-tight text-left pt-4 border-t border-black/10">
                  Login
                </button>
              )}

              <div className="flex gap-6 pt-6 mt-4 border-t border-black/10">
                <a href="https://www.facebook.com/heyskipperfishing/" target="_blank" rel="noopener noreferrer" aria-label="Visit Hey Skipper on Facebook" className="text-black hover:text-neutral-500"><Facebook className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" /></a>
                <a href="https://www.youtube.com/channel/UC2eTeSNnXaRctWQ0kltSoOA" target="_blank" rel="noopener noreferrer" aria-label="Visit Hey Skipper on YouTube" className="text-black hover:text-neutral-500"><Youtube className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" /></a>
                <a href="https://www.instagram.com/heyskipperofficial/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Visit Hey Skipper on Instagram" className="text-black hover:text-neutral-500"><Instagram className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;