// CategoryGrid — 4-tile visual category navigation: Rods · Bait · Bundles · Tackle.
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import gallery2 from '../../assets/gallery-2.jpg';

interface CategoryGridProps {
  onRods: () => void;
  onBait: () => void;
  onBundles: () => void;
  onTackle: () => void;
}

const categories = [
  { label: 'Rods',    sub: 'Travel & Inshore Series', img: gallery2,                                                                                          tag: 'TOP_SELLER' },
  { label: 'Bait',    sub: 'Natural & Artisanal',       img: '/assets/clam-1.jpg',                                                                             tag: 'NEW_STOCK'  },
  { label: 'Bundles', sub: 'Complete Kits',            img: 'https://www.heyskipperfishing.com/wp-content/uploads/2024/03/finatic-1.jpg',                     tag: 'BEST_VALUE' },
  { label: 'Tackle',  sub: 'Terminal & Tools',         img: 'https://www.heyskipperfishing.com/wp-content/uploads/2024/03/floats.jpg',                        tag: 'ESSENTIAL'  },
];

const CategoryGrid: React.FC<CategoryGridProps> = ({ onRods, onBait, onBundles, onTackle }) => {
  const handlers = [onRods, onBait, onBundles, onTackle];

  return (
    <section className="w-full border-b border-black">
      <div className="border-b border-black p-4 flex justify-between items-center">
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">Shop by Category</span>
        <span className="font-mono text-xs uppercase text-neutral-400">04 Departments</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, index) => (
          <motion.button
            key={cat.label}
            type="button"
            onClick={handlers[index]}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            aria-label={`Shop ${cat.label}`}
            className={[
              'relative h-[260px] md:h-[380px] overflow-hidden group text-left',
              'border-black',
              index % 2 === 0 ? 'border-r' : '',
              index < 2 ? 'border-b lg:border-b-0' : '',
              index < 3 ? 'lg:border-r' : '',
            ].filter(Boolean).join(' ')}
          >
            <img
              src={cat.img}
              alt={cat.label}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 contrast-110 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" aria-hidden="true" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] bg-white text-black px-2 py-1 uppercase">{cat.tag}</span>
                <ArrowUpRight
                  className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-none">
                  {cat.label}
                </h3>
                <p className="font-mono text-xs text-white/70 uppercase mt-1">{cat.sub}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
