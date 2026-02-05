import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Move, Ruler, Shield, Gauge } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products, Product } from '../data/products';

interface RodPageProps {
  onBack: () => void;
  onProductSelect: (product: Product) => void;
}

// Rods data removed (moved to products.ts)

const RodPage: React.FC<RodPageProps> = ({ onBack, onProductSelect }) => {
  const { addToCart } = useCart();

  const rodProducts = products.filter(p => p.categoryId === 'rod');

  const handleAddRod = (rod: Product) => {
    addToCart({
      id: rod.id,
      name: rod.name,
      price: rod.price,
      image: rod.image,
      specs: rod.specs
    });
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-6">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div className="mb-16 border-b border-black pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Base
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase text-neutral-500 block mb-2">/// WEAPON_SYSTEMS</span>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Rod<br />Series</h1>
            </div>
            <div className="max-w-md">
              <p className="font-mono text-xs md:text-sm text-neutral-600 uppercase leading-relaxed">
                Purpose-built tools for every environment. Constructed from high-modulus Toray carbon for superior sensitivity and power.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black border border-black mb-16">
          <div className="bg-neutral-50 p-8 flex flex-col items-center text-center gap-4">
            <Gauge className="w-8 h-8 stroke-1 text-neutral-400" />
            <h3 className="font-bold uppercase text-sm">Toray Carbon</h3>
            <p className="font-mono text-xs text-neutral-500 uppercase">Japanese carbon fiber blanks provide the ultimate strength-to-weight ratio.</p>
          </div>
          <div className="bg-neutral-50 p-8 flex flex-col items-center text-center gap-4">
            <Move className="w-8 h-8 stroke-1 text-neutral-400" />
            <h3 className="font-bold uppercase text-sm">Balanced Action</h3>
            <p className="font-mono text-xs text-neutral-500 uppercase">tuned specifically for regional fishing techniques and species.</p>
          </div>
          <div className="bg-neutral-50 p-8 flex flex-col items-center text-center gap-4">
            <Shield className="w-8 h-8 stroke-1 text-neutral-400" />
            <h3 className="font-bold uppercase text-sm">Lifetime Warranty</h3>
            <p className="font-mono text-xs text-neutral-500 uppercase">Original owner coverage against defects in materials and workmanship.</p>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-12">
          {rodProducts.map((rod, index) => (
            <motion.div
              key={rod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-12 border border-black bg-white group"
            >
              {/* Image Section */}
              <div className="lg:col-span-7 bg-neutral-100 relative min-h-[400px] overflow-hidden border-b lg:border-b-0 lg:border-r border-black/10">
                <img
                  src={rod.image}
                  alt={rod.name}
                  onClick={() => onProductSelect(rod)}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                />
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-black text-white px-3 py-1 font-mono text-xs uppercase tracking-wider shadow-xl">
                    {rod.tag}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="mb-2">
                    <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">{rod.subtitle}</span>
                  </div>
                  <h3
                    className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-6 cursor-pointer hover:text-neutral-600 transition-colors"
                    onClick={() => onProductSelect(rod)}
                  >
                    {rod.name}
                  </h3>

                  <p className="text-sm font-medium text-neutral-600 uppercase leading-relaxed mb-8">
                    {rod.description}
                  </p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-12 border-t border-b border-black/10 py-6">
                    <div>
                      <span className="block font-mono text-[10px] text-neutral-400 uppercase mb-1">Length</span>
                      <span className="block font-bold uppercase text-sm">{rod.detailedSpecs?.length || '-'}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] text-neutral-400 uppercase mb-1">Pieces</span>
                      <span className="block font-bold uppercase text-sm">{rod.detailedSpecs?.pieces || '-'}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] text-neutral-400 uppercase mb-1">Lure Wt.</span>
                      <span className="block font-bold uppercase text-sm">{rod.detailedSpecs?.lureWeight || '-'}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] text-neutral-400 uppercase mb-1">Line Rating</span>
                      <span className="block font-bold uppercase text-sm">{rod.detailedSpecs?.lineRating || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-xs text-neutral-500 uppercase">Unit Price</span>
                    <span className="text-3xl font-black tracking-tight">${rod.price}</span>
                  </div>
                  <button
                    onClick={() => handleAddRod(rod)}
                    className="w-full bg-black text-white h-14 flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all uppercase font-bold text-xs tracking-widest"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RodPage;