import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

import gallery1 from '../assets/gallery-1.jpg';
import gallery2 from '../assets/gallery-2.jpg';
import gallery3 from '../assets/gallery-3.jpg';
import gallery4 from '../assets/gallery-4.jpg';

const items = [
  {
    id: '01',
    img: gallery1
  },
  {
    id: '02',
    img: gallery2
  },
  {
    id: '03',
    img: gallery3
  },
  {
    id: '04',
    img: gallery4
  }
];

const Gallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      switch (e.key) {
        case 'ArrowLeft':
          setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + items.length) % items.length));
          break;
        case 'ArrowRight':
          setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % items.length));
          break;
        case 'Escape':
          setSelectedIndex(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % items.length));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + items.length) % items.length));
  };

  return (
    <section className="w-full border-b border-black">
      {/* Header */}
      <div className="border-b border-black p-4 flex justify-between items-center bg-neutral-50">
        <span className="font-mono text-xs uppercase tracking-wider text-neutral-500">/// FIELD_REPORTS_ARCHIVE // 2024-2025</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-neutral-500">LIVE_FEED</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative h-[400px] md:h-[500px] border-b lg:border-b-0 border-black 
              ${index !== items.length - 1 ? 'lg:border-r' : ''} 
              group overflow-hidden cursor-zoom-in
            `}
          >
            {/* Image Layer */}
            <div className="absolute inset-0 bg-neutral-200">
              <img
                src={item.img}
                alt={`Gallery Image ${item.id}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 contrast-125 transition-all duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Overlay UI */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">

              {/* Top Row */}
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs bg-black text-white px-2 py-1">IMG_{item.id}</span>
                <Plus className="w-6 h-6 text-white opacity-50 group-hover:opacity-100 transition-all duration-500 rotate-0 group-hover:rotate-90" strokeWidth={1} />
              </div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
            </button>

            {/* Navigation Buttons */}
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-4 hover:bg-white/10 rounded-full"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
            </button>
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-4 hover:bg-white/10 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
            </button>

            {/* Image Container */}
            <motion.div
              key={selectedIndex} // Triggers animation on change
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[selectedIndex].img}
                alt="Gallery Fullscreen"
                className="max-w-full max-h-[80vh] object-contain shadow-2xl ring-1 ring-white/10"
              />
              <div className="mt-6 text-center">
                <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-2">
                        /// IMG_{items[selectedIndex].id}
                </span>
                <div className="flex gap-2 justify-center">
                  {items.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 w-8 rounded-full transition-colors ${idx === selectedIndex ? 'bg-white' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;