import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Droplets, Thermometer, Anchor, Fish } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products, Product } from '../data/products';

interface BaitPageProps {
  onBack: () => void;
  onProductSelect: (product: Product) => void;
}

const BaitPage: React.FC<BaitPageProps> = ({ onBack, onProductSelect }) => {
  const { addToCart } = useCart();

  const handleAddBait = (item: Product) => {
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
        <div className="mb-16 border-b border-black pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Base
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase text-neutral-500 block mb-2">/// BIOLOGICAL_PAYLOAD</span>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Salted<br />Series</h1>
            </div>
            <div className="max-w-md">
              <p className="font-mono text-xs md:text-sm text-neutral-600 uppercase leading-relaxed">
                Shelf-stable, toughened natural baits designed for tactical deployment. No refrigeration required.
              </p>
            </div>
          </div>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black border border-black mb-16">
          <div className="bg-neutral-50 p-8 flex flex-col items-center text-center gap-4">
            <Thermometer className="w-8 h-8 stroke-1 text-neutral-400" />
            <h3 className="font-bold uppercase text-sm">Shelf Stable</h3>
            <p className="font-mono text-xs text-neutral-500 uppercase">No freezer or cooler needed. Keep in your tackle bag until deployment.</p>
          </div>
          <div className="bg-neutral-50 p-8 flex flex-col items-center text-center gap-4">
            <Anchor className="w-8 h-8 stroke-1 text-neutral-400" />
            <h3 className="font-bold uppercase text-sm">Superior Hold</h3>
            <p className="font-mono text-xs text-neutral-500 uppercase">Curing process toughens bait, preventing loss during high-velocity casts.</p>
          </div>
          <div className="bg-neutral-50 p-8 flex flex-col items-center text-center gap-4">
            <Droplets className="w-8 h-8 stroke-1 text-neutral-400" />
            <h3 className="font-bold uppercase text-sm">Scent Dense</h3>
            <p className="font-mono text-xs text-neutral-500 uppercase">Dehydration concentrates natural aminos and oils for maximum attraction.</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.filter(p => p.categoryId === 'bait').map((bait, index) => (
            <motion.div
              key={bait.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col h-full"
            >
              {/* Image Area */}
              <button
                type="button"
                onClick={() => {
                  console.log('Product selected (image click):', bait);
                  onProductSelect(bait);
                }}
                className="w-full text-left aspect-square bg-neutral-100 relative overflow-hidden mb-6 border border-black/10 group-hover:border-black transition-colors cursor-pointer block"
              >
                <img
                  src={bait.image}
                  alt={bait.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-0 left-0 p-3">
                  <span className="bg-white/80 backdrop-blur-sm border border-black/10 px-2 py-1 font-mono text-[10px] uppercase">
                    {bait.specs}
                  </span>
                </div>
              </button>

              {/* Content */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <button
                      type="button"
                      onClick={() => onProductSelect(bait)}
                      className="text-xl font-black uppercase tracking-tight cursor-pointer hover:text-neutral-600 transition-colors text-left"
                    >
                      {bait.name}
                    </button>
                    <span className="font-mono text-lg font-bold">${bait.price}</span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium uppercase leading-relaxed mb-6">
                    {bait.description}
                  </p>
                </div>

                <button
                  onClick={() => handleAddBait(bait)}
                  className="w-full bg-white border border-black text-black h-12 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all uppercase font-bold text-xs tracking-widest"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Application Note */}
        <div className="mt-24 border-t border-black pt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Why Salted?</h3>
            <p className="font-mono text-sm leading-relaxed text-neutral-600 mb-6">
              Fresh bait is fragile. It turns into mush in the sun and flies off the hook during a power cast. Our Salted Series solves these logistical failures.
            </p>
            <p className="font-mono text-sm leading-relaxed text-neutral-600">
              By removing moisture and replacing it with non-iodized salts and curing agents, we create a bait that is biologically preserved yet rehydrates instantly in the water, releasing a powerful scent plume that fish can't ignore.
            </p>
          </div>
          <div className="bg-neutral-100 p-8 flex items-center justify-center border border-black/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="relative z-10 text-center">
              <Fish className="w-12 h-12 mx-auto mb-4 text-black" strokeWidth={1} />
              <span className="font-black uppercase text-xl block">Pro Tip</span>
              <p className="font-mono text-xs uppercase mt-2 max-w-xs mx-auto">
                "Combine a piece of Squidy Bits Slab with a Clammy Bit on the same hook. This 'Cocktail' provides both visual attraction and scent density."
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BaitPage;