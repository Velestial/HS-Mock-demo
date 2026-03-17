// WhyHeySkipper — full-width lifestyle banner with 3 overlaid brand value callouts.
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Layers, Package } from 'lucide-react';
import gallery1 from '../../assets/gallery-1.jpg';

const callouts = [
  {
    icon: Trophy,
    title: 'Tournament Tested',
    desc: 'Validated by competitive anglers in real conditions — beaches, piers, and rocky shorelines across the US and beyond.',
  },
  {
    icon: Layers,
    title: 'Premium Materials',
    desc: 'Toray carbon blanks, titanium SiC guides, EVA foam grips. No shortcuts, no compromises, ever.',
  },
  {
    icon: Package,
    title: 'Beach-Ready Packaging',
    desc: 'Ships in reinforced protective cases. Travel-ready from day one — grab it and go.',
  },
];

const WhyHeySkipper: React.FC = () => (
  <section className="w-full border-b border-black">
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">
      {/* Image */}
      <div className="relative h-[300px] lg:h-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-black">
        <img
          src={gallery1}
          alt="Hey Skipper angler in the field"
          loading="lazy"
          className="w-full h-full object-cover grayscale brightness-105 contrast-110"
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <div className="absolute bottom-6 left-6">
          <span className="font-mono text-[10px] bg-white text-black px-2 py-1 uppercase">Why Hey Skipper</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <div className="p-8 md:p-12 border-b border-black">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
            Built for the<br />Modern Angler
          </h2>
        </div>

        <div className="flex-grow divide-y divide-black">
          {callouts.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="p-6 md:p-8 flex gap-5 items-start hover:bg-neutral-50 transition-colors"
            >
              <div className="w-10 h-10 border border-black flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold uppercase text-sm tracking-wide mb-1">{title}</h3>
                <p className="font-mono text-xs text-neutral-500 uppercase leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyHeySkipper;
