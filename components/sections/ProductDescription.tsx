import React from 'react';
import { motion } from 'framer-motion';

const ProductDescription: React.FC = () => {
  return (
    <section className="w-full border-b border-black bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 max-w-[1920px] mx-auto">
        
        {/* Left Column - Title/Context */}
        <div className="lg:col-span-4 p-8 md:p-12 border-b lg:border-b-0 border-black lg:border-r flex flex-col justify-between">
          <div className="sticky top-20">
            <span className="font-mono text-xs uppercase text-neutral-500 mb-4 block">/// PRODUCT_DNA</span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              The One<br/>Rod Solution
            </h2>
            <div className="mt-12 hidden lg:block">
               <div className="w-12 h-1 bg-black mb-4"></div>
               <p className="font-mono text-xs uppercase max-w-[200px] text-neutral-500 leading-relaxed">
                 Design Logic: <br/>Max Performance <br/>Min Footprint
               </p>
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-8 p-8 md:p-12">
           <div className="max-w-3xl space-y-12">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-lg md:text-2xl font-medium leading-tight uppercase"
              >
                Crafted with premium carbon fiber, our 9’2″ Hybrid Travel Fishing Rod bridges the gap between inshore precision and surf power. It’s the one-rod solution when you want to cover a wide range of fishing environments.
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base leading-relaxed text-neutral-700 font-normal">
                 <p>
                   Compact, lightweight, and powerful, this rod is designed to give you the freedom to fish anywhere—whether it’s the beach, pier, jetty or inshore rivers, creeks and under bridges, this rod is perfect for variety.
                 </p>
                 <p>
                   At 9’2”, this full-sized hybrid rod breaks down into 5 travel-friendly pieces, packing to just 2 feet for easy transport. Despite its portability, it delivers serious performance: lightweight and sensitive enough to detect subtle bites, yet strong enough to battle the fish that count.
                 </p>
              </div>

              <div className="bg-neutral-50 border border-black p-8 relative">
                 <span className="absolute top-0 left-0 bg-black text-white text-[10px] font-mono px-2 py-1 uppercase">Origin Story</span>
                 <p className="text-sm md:text-base font-medium uppercase leading-relaxed mt-2">
                   "As seen on the Hey Skipper Fishing channel, our specialty travel fishing rod was designed by Brendon to represent ULTIMATE FREEDOM. Whether you’re flying to paradise or driving down the coast, it sets up fast, travels light, and is always ready to fish when you are."
                 </p>
              </div>

              {/* Key Features */}
              <div className="pt-8 border-t border-black">
                 <h3 className="font-black uppercase tracking-widest text-lg mb-8 flex items-center gap-2">
                    Key Features
                 </h3>
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {[
                        { title: "Premium Carbon Fiber", desc: "Lightweight, sensitive, and incredibly strong." },
                        { title: "9’2” Length, 5-Piece", desc: "Packs down to just 2 feet for easy travel." },
                        { title: "Hybrid Versatility", desc: "Casts long distances for surf fishing but still sensitive for inshore lures." },
                        { title: "Travel Ready", desc: "Compact, durable, and designed to fish anywhere in the world." }
                    ].map((feature, i) => (
                        <li key={i} className="flex flex-col group">
                           <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono text-xs text-neutral-400">0{i + 1}</span>
                              <span className="font-bold uppercase text-sm border-b border-transparent group-hover:border-black transition-colors">{feature.title}</span>
                           </div>
                           <span className="font-mono text-xs text-neutral-600 uppercase leading-relaxed pl-6">{feature.desc}</span>
                        </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default ProductDescription;