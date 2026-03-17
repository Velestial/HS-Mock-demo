// BestSellers — horizontal scroll on mobile, 4-across grid on desktop with live pricing + Add to Cart.
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, ArrowRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

interface BestSellersProps {
  onProductSelect: (product: Product) => void;
  onShopAll: () => void;
}

// Pinned best-seller IDs in display order
const FEATURED_IDS = [
  'rod-travel-92',
  'rod-inshore-76',
  'bundle-all-in-one',
  'rod-surf-11',
];

const BestSellers: React.FC<BestSellersProps> = ({ onProductSelect, onShopAll }) => {
  const { products } = useProducts();
  const { addToCart } = useCart();

  const featured = FEATURED_IDS
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p)
    .sort((a, b) => b.price - a.price);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      specs: product.specs,
      category: product.categoryId,
    });
  };

  return (
    <section className="w-full border-b border-black">
      {/* Header */}
      <div className="border-b border-black p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">Best Sellers</span>
          <div className="flex gap-0.5" aria-label="Top rated">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-3 h-3 fill-black text-black" strokeWidth={0} aria-hidden="true" />
            ))}
          </div>
        </div>
        <button
          onClick={onShopAll}
          className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest hover:underline underline-offset-4"
        >
          View All <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </button>
      </div>

      {/* Cards — horizontal scroll on mobile, 4-col grid on desktop */}
      <div className="flex overflow-x-auto scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
        {featured.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className={[
              'flex-shrink-0 w-[270px] md:w-auto flex flex-col cursor-pointer group',
              index < featured.length - 1 ? 'border-r border-black' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => onProductSelect(product)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onProductSelect(product)}
            aria-label={`View ${product.name}`}
          >
            {/* Image */}
            <div className="relative h-[260px] md:h-[300px] bg-neutral-100 overflow-hidden border-b border-black">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 bg-black text-white font-mono text-[10px] uppercase px-2 py-1">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-5 md:p-6 flex flex-col flex-grow">
              <div className="flex-grow">
                <span className="font-mono text-[10px] text-neutral-400 uppercase block mb-1">{product.specs}</span>
                <h3 className="font-black uppercase text-sm tracking-tight leading-tight group-hover:underline underline-offset-2 decoration-1">
                  {product.name}
                </h3>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/10">
                <span className="font-mono font-bold text-lg tabular-nums">${product.price.toFixed(2)}</span>
                <button
                  onClick={e => handleAdd(e, product)}
                  className="flex items-center gap-1.5 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
