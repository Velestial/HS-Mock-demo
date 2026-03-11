// RodPage — fishing rod product catalog with specs comparison and add-to-cart actions.
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Move, Ruler, Shield, Gauge } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';

interface RodPageProps {
  onBack: () => void;
  onProductSelect: (product: Product) => void;
}

// Rods data removed (moved to products.ts)

const RodProductCard: React.FC<{
  rod: Product;
  index: number;
  onProductSelect: (product: Product) => void;
  onAddRod: (rod: Product) => void;
}> = ({ rod, index, onProductSelect, onAddRod }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const images = rod.images && rod.images.length > 0 ? rod.images : [rod.image];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="grid grid-cols-1 lg:grid-cols-12 border border-black bg-white group"
    >
      {/* Image Section */}
      <div className="lg:col-span-7 bg-neutral-100 relative min-h-[400px] overflow-hidden border-b lg:border-b-0 lg:border-r border-black/10">
        <img
          src={images[currentImageIndex]}
          alt={rod.name}
          onClick={() => onProductSelect(rod)}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300"
        />

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 hover:bg-black hover:text-white transition-all z-20 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 hover:bg-black hover:text-white transition-all z-20 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`h-1.5 transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-black' : 'w-1.5 bg-black/30 hover:bg-black/50'
                    }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-6 left-6 z-10 pointer-events-none">
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
            onClick={() => onAddRod(rod)}
            className="w-full bg-black text-white h-14 flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all uppercase font-bold text-xs tracking-widest"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const RodPage: React.FC<RodPageProps> = ({ onBack, onProductSelect }) => {
  const { products } = useProducts();
  const { addToCart } = useCart();

  const rodProducts = products.filter(p => p.categoryId === 'rod');

  const handleAddRod = (rod: Product) => {
    addToCart({
      id: rod.id,
      name: rod.name,
      price: rod.price,
      image: rod.image,
      specs: rod.specs,
      category: 'rod',
      wcProductId: rod.wcProductId,
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
            <RodProductCard
              key={rod.id}
              rod={rod}
              index={index}
              onProductSelect={onProductSelect}
              onAddRod={handleAddRod}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default RodPage;