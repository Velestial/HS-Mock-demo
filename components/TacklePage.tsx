import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Anchor, Filter, Crosshair, Wrench, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface TacklePageProps {
  onBack: () => void;
}

type Category = 'ALL' | 'RIGS' | 'LURES' | 'SINKERS' | 'TOOLS';

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
    id: 'tackle-pompano-rig',
    category: 'RIGS',
    name: "Double Drop Pompano Rig",
    price: 4.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/01/Pompano-Rig-1-300x300.jpg",
    specs: "High-Vis Floats / 2/0 Circles",
    description: "The gold standard for surf casting. Features distinct floats to keep bait off bottom and away from crabs."
  },
  {
    id: 'tackle-fish-finder',
    category: 'RIGS',
    name: "Fish Finder Slide Rig",
    price: 5.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/11/fish-finder-rig-300x300.jpg",
    specs: "80lb Swivel / Pyramids",
    description: "Allows line to slide freely through the weight carrier, preventing fish from feeling resistance when taking the bait."
  },
  // LURES
  {
    id: 'tackle-spoon',
    category: 'LURES',
    name: "Dead Weight Spoon",
    price: 8.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/01/Dead-Weight-Spoon-1-300x300.jpg",
    specs: "1oz / Silver Hex",
    description: "Aerodynamic casting spoon designed for maximum distance. Erratic fluttering action mimics wounded baitfish."
  },
  {
    id: 'tackle-jig',
    category: 'LURES',
    name: "Gotcha Plug Series",
    price: 7.49,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/11/lure-plug-300x300.jpg",
    specs: "7/8oz / Red Head",
    description: "Essential for pier and jetty work. Rapid darting action triggers aggressive strikes from Spanish Mackerel and Bluefish."
  },
  // SINKERS
  {
    id: 'tackle-sputnik',
    category: 'SINKERS',
    name: "Sputnik Sinker",
    price: 14.99, // Pack price
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/01/Sputnik-Sinker-1-300x300.jpg",
    specs: "3oz / 4-Pack",
    description: "Grapple-style legs anchor firmly in heavy surf and strong currents. Legs release under pressure for easy retrieval."
  },
  {
    id: 'tackle-pyramid',
    category: 'SINKERS',
    name: "Pyramid Lead",
    price: 9.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/11/pyramid-sinker-300x300.jpg",
    specs: "4oz / 6-Pack",
    description: "Classic triangular shape prevents rolling in the sand. Ideal for moderate surf conditions."
  },
  // TOOLS
  {
    id: 'tackle-pliers',
    category: 'TOOLS',
    name: "Titanium Pliers",
    price: 49.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/11/pliers-300x300.jpg",
    specs: "Corrosion Resistant / Cutter",
    description: "Aircraft-grade aluminum with titanium-coated jaws. Features replaceable tungsten carbide cutters for braid."
  },
  {
    id: 'tackle-scissors',
    category: 'TOOLS',
    name: "Precision Braid Scissors",
    price: 12.99,
    image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/11/scissors-300x300.jpg",
    specs: "Serrated Edge / Lanyard",
    description: "Micro-serrated blades grip and slice through braided line instantly without fraying."
  }
];

const TacklePage: React.FC<TacklePageProps> = ({ onBack }) => {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');

  const filteredProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(p => p.category === activeCategory);

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
                <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Terminal<br/>Tackle</h1>
            </div>
            <div className="max-w-md">
                <p className="font-mono text-xs md:text-sm text-neutral-600 uppercase leading-relaxed">
                    Precision engineered components for the modern surf and inshore operator. Rigs, ballistics, and artificials.
                </p>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-12 flex flex-wrap gap-4 md:gap-0 border-b border-neutral-200">
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

        {/* Product Grid */}
        <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black border border-black"
        >
            <AnimatePresence mode="popLayout">
                {filteredProducts.map((item) => (
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
        {filteredProducts.length === 0 && (
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