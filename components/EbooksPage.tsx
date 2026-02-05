import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Download, Smartphone, BookOpen, Map, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products, Product } from '../data/products';

interface EbooksPageProps {
  onBack: () => void;
}



const EbooksPage: React.FC<EbooksPageProps> = ({ onBack }) => {
  const { addToCart } = useCart();
  const ebooks = products.filter(product => product.categoryId === 'ebook');

  const handleAddBook = (item: Product) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      specs: 'Digital Download'
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
              <span className="font-mono text-xs uppercase text-neutral-500 block mb-2">/// INTEL_ARCHIVE</span>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Field<br />Guides</h1>
            </div>
            <div className="max-w-md">
              <p className="font-mono text-xs md:text-sm text-neutral-600 uppercase leading-relaxed">
                Accelerate your learning curve. Digital manuals and tactical guides derived from thousands of hours on the water.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black border border-black mb-16">
          <div className="bg-neutral-50 p-8 flex flex-col items-center text-center gap-4">
            <Zap className="w-8 h-8 stroke-1 text-neutral-400" />
            <h3 className="font-bold uppercase text-sm">Instant Access</h3>
            <p className="font-mono text-xs text-neutral-500 uppercase">Download link delivered immediately via email upon secure checkout.</p>
          </div>
          <div className="bg-neutral-50 p-8 flex flex-col items-center text-center gap-4">
            <Smartphone className="w-8 h-8 stroke-1 text-neutral-400" />
            <h3 className="font-bold uppercase text-sm">Mobile Optimized</h3>
            <p className="font-mono text-xs text-neutral-500 uppercase">Formatted for readability on phones and tablets for field reference.</p>
          </div>
          <div className="bg-neutral-50 p-8 flex flex-col items-center text-center gap-4">
            <BookOpen className="w-8 h-8 stroke-1 text-neutral-400" />
            <h3 className="font-bold uppercase text-sm">Lifetime Updates</h3>
            <p className="font-mono text-xs text-neutral-500 uppercase">Receive free updated versions as we add new techniques and data.</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ebooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col h-full bg-white"
            >
              {/* Image Area - Taller aspect ratio for books */}
              <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden mb-6 border border-black/10 group-hover:border-black transition-colors shadow-sm">
                <img
                  src={book.image}
                  alt={book.name}
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                />
                {/* Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black text-white px-2 py-1 font-mono text-[10px] uppercase tracking-wider shadow-lg">
                    {book.tag}
                  </span>
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
              </div>

              {/* Content */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black uppercase tracking-tight leading-none min-h-[40px]">{book.name}</h3>
                    <span className="font-mono text-lg font-bold">${book.price}</span>
                  </div>
                  <span className="block font-mono text-[10px] text-neutral-400 uppercase mb-4 border-b border-black/10 pb-2">
                    {book.specs}
                  </span>
                  <p className="text-xs text-neutral-600 font-medium uppercase leading-relaxed mb-8">
                    {book.description}
                  </p>
                </div>

                <button
                  onClick={() => handleAddBook(book)}
                  className="w-full bg-white border border-black text-black h-12 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all uppercase font-bold text-xs tracking-widest relative overflow-hidden group/btn"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bundle Banner */}
        <div className="mt-24 bg-neutral-100 border border-black p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>

          <div className="relative z-10 max-w-2xl">
            <span className="font-mono text-xs uppercase text-neutral-500 mb-2 block">/// KNOWLEDGE_PACK</span>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">The Complete Library</h3>
            <p className="font-mono text-xs md:text-sm text-neutral-600 uppercase">
              Get all 3 guides plus the Spot Map access for one discounted price. Master every aspect of the game from rigging to finding fish.
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-end gap-2">
            <div className="text-right">
              <span className="block text-xs font-mono text-neutral-400 line-through decoration-red-500">$19.96</span>
              <span className="block text-4xl font-black uppercase">$14.99</span>
            </div>
            <button
              onClick={() => handleAddBook({
                id: 'bundle-library',
                name: "Complete Digital Library",
                description: "All guides and maps.",
                price: 14.99,
                image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/01/Ebook-Mockup-Surf-Fishing-1-300x300.jpg",
                specs: "Full Collection / 4 Items",
                tag: "BUNDLE"
              })}
              className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Bundle
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EbooksPage;