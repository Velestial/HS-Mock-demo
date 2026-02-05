import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Anchor, Filter, Crosshair, Wrench, Layers, ArrowUpDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface TacklePageProps {
  onBack: () => void;
}

type Category = 'ALL' | 'RIGS' | 'LURES' | 'SINKERS' | 'TOOLS';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'best-sellers';

const categories: { id: Category; label: string; icon: any }[] = [
  { id: 'ALL', label: 'All Units', icon: Layers },
  { id: 'RIGS', label: 'Rigs', icon: Crosshair },
  { id: 'LURES', label: 'Lures', icon: Anchor }, // Anchor generic for lure hook
  { id: 'SINKERS', label: 'Sinkers', icon: Anchor },
  { id: 'TOOLS', label: 'Accessories', icon: Wrench },
];

const products = [
  // RIGS
  {
    id: 'tackle-sure-catch',
    category: 'RIGS',
    name: "Sure-Catch Fishing Rig — Free Line/Carolina Rig",
    price: 10.97,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/03/wbsurecatch.jpg",
    specs: "Free Line / Carolina",
    description: "Versatile rig for presenting bait naturally in the water column.",
    itemsSold: 34
  },
  {
    id: 'tackle-catch-all',
    category: 'RIGS',
    name: "Catch All Fishing Rig (w/ Floats) — Hi-Lo/Bottom",
    price: 10.50,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/03/floats.jpg",
    specs: "Hi-Lo / Bottom",
    description: "Features floats to keep bait off the bottom and away from crabs.",
    itemsSold: 344
  },
  {
    id: 'tackle-fish-finder',
    category: 'RIGS',
    name: "Sure Catch — Fish Finder Rig",
    price: 12.50,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2025/04/fishfinderrig1.jpg",
    specs: "Fish Finder Setup",
    description: "Allows the fish to take the bait without feeling the weight.",
    itemsSold: 43
  },
  {
    id: 'tackle-skip-biki',
    category: 'RIGS',
    name: "Skip-Biki Fishing Rig — Bait/Bottom",
    price: 9.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/03/skipbiki-1.jpg",
    specs: "Bait Catching",
    description: "Multi-hook rig perfect for catching baitfish or bottom feeders.",
    itemsSold: 47
  },
  {
    id: 'tackle-essential',
    category: 'RIGS',
    name: "Essential Rig — Hi-Lo/Bottom",
    price: 8.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2022/12/wbcatchallbasic.jpg",
    specs: "Standard Hi-Lo",
    description: "The fundamental bottom fishing rig for all saltwater anglers.",
    itemsSold: 110
  },
  {
    id: 'tackle-long-distance',
    category: 'RIGS',
    name: "Sure Catch Fishing Rig (Long Distance Cast)",
    price: 7.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/03/wblongdistance.jpg",
    specs: "Long Distance",
    description: "Aerodynamic design for maximum casting range.",
    itemsSold: 13
  },

  // LURES
  {
    id: 'tackle-bbl-bundle',
    category: 'LURES',
    name: "BBL Lure Bundle",
    price: 100.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2025/03/BBLBUNDLE.jpg",
    specs: "Bundle Pack",
    description: "A complete collection of our best-performing big bass lures.",
    itemsSold: 6
  },
  {
    id: 'tackle-bbl-wobble',
    category: 'LURES',
    name: "BBL Wobble Lures",
    price: 12.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2025/01/blue1.jpg",
    specs: "Wobble Action",
    description: "Creates an irresistible wobbling action that triggers aggressive strikes.",
    itemsSold: 28
  },
  {
    id: 'tackle-double-take',
    category: 'LURES',
    name: "Double Take: Metal Casting Lure",
    price: 10.50,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/12/DoubleTake.jpg",
    specs: "Metal Casting",
    description: "Heavy metal lure designed for long casts and fast retrieval.",
    itemsSold: 70
  },
  {
    id: 'tackle-good-head',
    category: 'LURES',
    name: "Good Head — Jig Heads",
    price: 9.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2025/01/bluehead1.jpg",
    specs: "Jig Heads",
    description: "Premium jig heads with sharp hooks for secure sets.",
    itemsSold: 42
  },
  {
    id: 'tackle-flashy-bottom',
    category: 'LURES',
    name: "Flashy Bottom — Willow Blade Attachment",
    price: 8.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2025/01/gold1.jpg",
    specs: "Willow Blade",
    description: "Adds flash and vibration to any bottom rig.",
    itemsSold: 13
  },

  // SINKERS
  {
    id: 'tackle-pyramid',
    category: 'SINKERS',
    name: "Pyramid Sinkers (Vibrant Orange)",
    price: 9.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/05/4pyramid3oz.jpg",
    specs: "Vibrant Orange",
    description: "High-visibility pyramid sinkers that hold bottom in surf.",
    itemsSold: 62
  },
  {
    id: 'tackle-sputnik',
    category: 'SINKERS',
    name: "Sputnik Sinkers (Vibrant Orange)",
    price: 8.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/05/1sputnik2oz.jpg",
    specs: "Grapple Legs",
    description: "Anchors firmly in strong currents and heavy surf.",
    itemsSold: 83
  },
  {
    id: 'tackle-eggy',
    category: 'SINKERS',
    name: "Eggy Sinkers (Orange)",
    price: 8.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/12/1.-EGGYsinker1ozOUTBAG.jpg",
    specs: "Egg Shape",
    description: "Rolled shape reduces snags and moves naturally with current.",
    itemsSold: 27
  },

  // TOOLS
  {
    id: 'tackle-box-large',
    category: 'TOOLS',
    name: "Waterproof Fishing Box (Large)",
    price: 40.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/03/WBminibaitbox.jpg",
    specs: "Large / Waterproof",
    description: "Keep your tackle organized and dry in any conditions.",
    itemsSold: 56
  },
  {
    id: 'tackle-box-small',
    category: 'TOOLS',
    name: "Waterproof Fishing Box (Small)",
    price: 30.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/03/WBminibaitbox.jpg",
    specs: "Small / Waterproof",
    description: "Compact waterproof storage for essential terminal tackle.",
    itemsSold: 14
  },
  {
    id: 'tackle-rod-case',
    category: 'TOOLS',
    name: "Rod Replacement Case",
    price: 20.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/04/rod7.jpg",
    specs: "Rod Protection",
    description: "Durable case to protect your valuable fishing rods during transport.",
    itemsSold: 0
  },
  {
    id: 'tackle-floats',
    category: 'TOOLS',
    name: "Hand Painted Fishing Floats",
    price: 10.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/04/WBorangefloats.jpg",
    specs: "Hand Painted",
    description: "High-visibility floats with custom hand-painted finish.",
    itemsSold: 31
  },
  {
    id: 'tackle-thread',
    category: 'TOOLS',
    name: "Invisi-Thread (Bait Elastic)",
    price: 7.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/04/invisithread1.jpg",
    specs: "Bait Elastic",
    description: "Keeps soft baits on the hook longer during casting and fishing.",
    itemsSold: 198
  },
  {
    id: 'tackle-spool',
    category: 'TOOLS',
    name: "Fishing Rig Spool",
    price: 5.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/08/spool1.o.jpg",
    specs: "Rig Storage",
    description: "Tangle-free storage for your pre-tied fishing rigs.",
    itemsSold: 23
  },
  {
    id: 'tackle-sinker-cap',
    category: 'TOOLS',
    name: "Sputnik Sinker Storage Cap",
    price: 5.00,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2025/03/cap1.jpg",
    specs: "Safety Cap",
    description: "Protects your gear from the legs of Sputnik sinkers.",
    itemsSold: 3
  },
  {
    id: 'tackle-bait-cage',
    category: 'TOOLS',
    name: "Mini Bait Cage",
    price: 4.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/03/1.jpg",
    specs: "Bait Cage",
    description: "Holds chum or bait to attract fish to your rig.",
    itemsSold: 48
  }
];

const TacklePage: React.FC<TacklePageProps> = ({ onBack }) => {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const filteredProducts = activeCategory === 'ALL'
    ? products
    : products.filter(p => p.category === activeCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'best-sellers':
        return b.itemsSold - a.itemsSold;
      default:
        return 0;
    }
  });

  const handleAddTackle = (item: typeof products[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      specs: item.specs
    });
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-6">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div className="mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Base
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black">
            <div>
              <span className="font-mono text-xs uppercase text-neutral-500 block mb-2">/// MISSION_HARDWARE</span>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Terminal<br />Tackle</h1>
            </div>
            <div className="max-w-md">
              <p className="font-mono text-xs md:text-sm text-neutral-600 uppercase leading-relaxed">
                Precision engineered components for the modern surf and inshore operator. Rigs, ballistics, and artificials.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs & Sorting */}
        <div className="mb-12 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-start md:items-center border-b border-neutral-200">
          <div className="flex flex-wrap gap-4 md:gap-0">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                        flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative
                        ${isActive ? 'text-black bg-neutral-100' : 'text-neutral-500 hover:text-black hover:bg-neutral-50'}
                     `}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sorting Controls */}
          <div className="relative group px-6 py-4 md:py-0">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer text-neutral-500 hover:text-black transition-colors">
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort By</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="best-sellers">Best Sellers</option>
            </select>

            {/* Visual label update based on selection */}
            <div className="absolute top-full right-0 mt-2 bg-black text-white p-2 text-[10px] uppercase font-mono hidden group-hover:block whitespace-nowrap z-50">
              Current: {sortBy === 'default' ? 'Default' :
                sortBy === 'price-asc' ? 'Low to High' :
                  sortBy === 'price-desc' ? 'High to Low' : 'Best Sellers'}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black border border-black"
        >
          <AnimatePresence mode="popLayout">
            {sortedProducts.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-8 group flex flex-col h-full hover:bg-neutral-50 transition-colors relative"
              >
                {/* Spec Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase border border-neutral-200 px-2 py-1 bg-white">
                    {item.category}
                  </span>
                </div>

                {/* Image */}
                <div className="aspect-square mb-8 relative flex items-center justify-center p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-black uppercase tracking-tight leading-none">{item.name}</h3>
                      <span className="font-mono text-sm font-bold">${item.price}</span>
                    </div>
                    <span className="block font-mono text-[10px] text-neutral-500 uppercase mb-4">{item.specs}</span>
                    <p className="text-xs text-neutral-600 font-medium uppercase leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddTackle(item)}
                    className="w-full bg-white border border-black text-black h-10 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all uppercase font-bold text-[10px] tracking-widest"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State if needed */}
        {sortedProducts.length === 0 && (
          <div className="py-24 text-center border border-black border-t-0">
            <Filter className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
            <p className="font-mono text-sm uppercase text-neutral-500">No equipment found in this category.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default TacklePage;