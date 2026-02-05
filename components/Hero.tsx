import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import heroImage from '../assets/rod-breakdown.png';

const Hero: React.FC = () => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: 'travel-rod-92',
      name: "Travel Series 9'2\"",
      price: 249,
      image: 'https://www.heyskipperfishing.com/wp-content/uploads/2024/04/rod1.jpg', // Thumbnail for cart
      specs: 'Toray Carbon / 5-Piece'
    });
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col border-b border-black pt-16">

      {/* Background Text / Texture */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none select-none opacity-[0.03]">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="flex-grow flex flex-col justify-between relative z-10">
        {/* Top Header details */}
        <div className="grid grid-cols-2 md:grid-cols-4 w-full border-b border-black">
          <div className="p-4 border-r border-black flex flex-col">
            <span className="text-[10px] font-mono uppercase text-gray-500">Model</span>
            <span className="text-sm font-bold uppercase">Travel Series 9'2"</span>
          </div>
          <div className="p-4 border-r border-black flex flex-col">
            <span className="text-[10px] font-mono uppercase text-gray-500">Weight</span>
            <span className="text-sm font-bold uppercase">5.2 oz / 147g</span>
          </div>
          <div className="p-4 border-r border-black flex flex-col">
            <span className="text-[10px] font-mono uppercase text-gray-500">Material</span>
            <span className="text-sm font-bold uppercase">Toray Carbon</span>
          </div>
          <div className="p-4 flex flex-col">
            <span className="text-[10px] font-mono uppercase text-gray-500">Status</span>
            <span className="text-sm font-bold uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse" /> In Stock
            </span>
          </div>
        </div>

        {/* Main Visual */}
        <div className="relative flex-grow flex items-center justify-center overflow-hidden py-12 md:py-0">
          {/* Product Image Placeholder - Simulating a rod overlay */}
          {/* Z-Index raised to 30 to sit ABOVE the text layers */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="relative z-30 w-full max-w-7xl mx-auto h-[400px] md:h-[600px] pointer-events-none flex items-center justify-center p-6"
          >
            <img
              src={heroImage}
              alt="9'2 Hybrid Travel Rod Breakdown Diagram"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Hero Footer / CTA */}
        <div className="w-full border-t border-black grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12 border-b md:border-b-0 border-black md:border-r flex flex-col justify-end">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
              The 9'2"<br />Travel Rod
            </h2>
            <p className="max-w-lg text-xs md:text-sm font-mono leading-relaxed text-neutral-600">
              The Hey Skipper 9’2” Hybrid Travel Rod is the do-it-all travel rod — long enough for the surf, yet light and sensitive enough for inshore fishing. Breaking down into 5 compact pieces, it’s portable, powerful, and designed to cover every fishing situation, from casting lures inshore to soaking bait in the surf.
            </p>
          </div>

          <div className="flex flex-col justify-center p-8 md:p-12 items-start md:items-end">
            <motion.button
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="group relative w-full md:w-auto overflow-hidden border border-black px-12 py-6 text-xl font-bold uppercase tracking-widest transition-all hover:bg-black hover:text-white"
            >
              <span className="relative z-10 flex items-center justify-between gap-8">
                Add to Cart — $249
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-black text-black" strokeWidth={0} />
                ))}
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wide">4.8 <span className="text-neutral-400 mx-1">/</span> 51 Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
