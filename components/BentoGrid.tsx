import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, ShieldAlert, ArrowUpRight } from 'lucide-react';

const BentoGrid: React.FC = () => {
  return (
    <section className="w-full border-b border-black">
      <div className="grid grid-cols-1 md:grid-cols-3">
        
        {/* Tile A: Specs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="border-b md:border-b-0 border-black md:border-r p-8 md:p-12 h-[400px] flex flex-col justify-between group hover:bg-neutral-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <Ruler className="w-8 h-8 stroke-1" />
            <span className="font-mono text-xs border border-black px-2 py-1 rounded-sm">SPEC_SHEET_v2</span>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between border-b border-neutral-300 pb-1">
                    <span className="font-mono text-xs uppercase text-neutral-500">Action</span>
                    <span className="font-bold text-sm uppercase">Moderate / Fast Action</span>
                </div>
                <div className="flex justify-between border-b border-neutral-300 pb-1">
                    <span className="font-mono text-xs uppercase text-neutral-500">Pieces</span>
                    <span className="font-bold text-sm uppercase">5-Piece Travel</span>
                </div>
                <div className="flex justify-between border-b border-neutral-300 pb-1">
                    <span className="font-mono text-xs uppercase text-neutral-500">Guides</span>
                    <span className="font-bold text-sm uppercase">Titanium / SiC</span>
                </div>
                <div className="flex justify-between border-b border-neutral-300 pb-1">
                    <span className="font-mono text-xs uppercase text-neutral-500">Power</span>
                    <span className="font-bold text-sm uppercase">Medium Heavy</span>
                </div>
                <div className="flex justify-between border-b border-neutral-300 pb-1">
                    <span className="font-mono text-xs uppercase text-neutral-500">Casting Weight</span>
                    <span className="font-bold text-sm uppercase">1-3 oz</span>
                </div>
                <div className="flex justify-between border-b border-neutral-300 pb-1">
                    <span className="font-mono text-xs uppercase text-neutral-500">Recommended Line</span>
                    <span className="font-bold text-sm uppercase">15-20 lb Braid</span>
                </div>
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight">Technical<br/>Specs</h3>
          </div>
        </motion.div>

        {/* Tile B: Replacement Program */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="border-b md:border-b-0 border-black md:border-r p-8 md:p-12 h-[400px] flex flex-col justify-between bg-black text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-8 h-8 text-white" />
          </div>

          {/* Background Number */}
          <span className="absolute -bottom-10 -right-10 text-[12rem] font-black text-neutral-900 select-none pointer-events-none group-hover:text-neutral-800 transition-colors">
            01
          </span>

          <div className="relative z-10">
            <ShieldAlert className="w-8 h-8 stroke-1 mb-4" />
            <span className="font-mono text-xs border border-white/30 px-2 py-1 rounded-sm uppercase">Guarantee</span>
          </div>

          <div className="relative z-10">
            <h3 className="text-4xl font-black uppercase tracking-tight leading-none mb-2">Replacement<br/>Program</h3>
            <p className="font-mono text-xs text-neutral-400 max-w-[200px]">
                BREAK IT, WE REPLACE IT. NO QUESTIONS ASKED. LIFETIME COVERAGE FOR ORIGINAL OWNERS.
            </p>
          </div>
        </motion.div>

        {/* Tile C: The Inshore */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="p-0 h-[400px] relative flex overflow-hidden group"
        >
          {/* Image Background */}
          <img 
            src="https://picsum.photos/seed/water/600/800" 
            alt="Water Texture" 
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-125 contrast-125 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
          
          <div className="relative z-10 w-full h-full flex items-center justify-between p-8 md:p-12">
             <div className="h-full flex flex-col justify-between">
                <span className="font-mono text-xs bg-white text-black px-2 py-1 inline-block w-max">NEW ARRIVAL</span>
             </div>
             
             <div className="h-full flex items-center">
                <h3 className="text-6xl md:text-7xl font-black uppercase tracking-tighter text-black mix-blend-hard-light [writing-mode:vertical-rl] rotate-180">
                    The Inshore
                </h3>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default BentoGrid;