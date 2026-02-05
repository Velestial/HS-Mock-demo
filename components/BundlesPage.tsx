import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Check, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

import { products } from '../data/products';

interface BundlesPageProps {
  onBack: () => void;
}

const BundlesPage: React.FC<BundlesPageProps> = ({ onBack }) => {
  const { addToCart } = useCart();

  const bundleProducts = products.filter(p => p.categoryId === 'bundle');

  const handleAddBundle = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      specs: 'Bundle Configuration'
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
              <span className="font-mono text-xs uppercase text-neutral-500 block mb-2">/// CONFIGURATIONS</span>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Gear<br />Bundles</h1>
            </div>
            <div className="max-w-md">
              <p className="font-mono text-xs md:text-sm text-neutral-600 uppercase leading-relaxed">
                Curated equipment packages optimized for specific mission profiles. Save up to 20% when purchasing complete systems.
              </p>
            </div>
          </div>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-l border-t border-black">
          {bundleProducts.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group border-r border-b border-black bg-white flex flex-col h-full relative"
            >
              {/* Tag */}
              {bundle.tag && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black text-white px-2 py-1 font-mono text-[10px] uppercase tracking-wider">
                    {bundle.tag}
                  </span>
                </div>
              )}

              {/* Image Area */}
              <div className="h-[300px] bg-neutral-100 relative overflow-hidden p-8 flex items-center justify-center">
                <img
                  src={bundle.image}
                  alt={bundle.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
              </div>

              {/* Content */}
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-4">{bundle.name}</h3>
                  <p className="text-xs text-neutral-600 font-medium uppercase leading-relaxed mb-6 border-b border-black/10 pb-6">
                    {bundle.description}
                  </p>

                  {bundle.items && bundle.items.length > 0 && (
                    <div className="space-y-3 mb-8">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-2">Includes:</span>
                      {bundle.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-3 h-3 mt-0.5 text-black flex-shrink-0" />
                          <span className="text-xs font-bold uppercase tracking-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-4">
                    <div className="text-right w-full">
                      <span className="block text-2xl font-black tracking-tight">${bundle.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddBundle(bundle)}
                    className="w-full bg-white border border-black text-black h-12 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all uppercase font-bold text-xs tracking-widest group/btn"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bundle Banner */}
        <div className="mt-16 bg-black text-white p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10">
            <Package className="w-12 h-12 mx-auto mb-6 stroke-1" />
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Custom Loadout?</h3>
            <p className="font-mono text-xs md:text-sm text-neutral-400 uppercase mb-8 max-w-lg mx-auto">
              Need a specific configuration not listed here? Contact our tactical support team for a custom quote built to your exact specs.
            </p>
            <a href="mailto:info@heyskipperfishing.com" className="inline-block border border-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Request Quote
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BundlesPage;