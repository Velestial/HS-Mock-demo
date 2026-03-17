// VideoHero — full-bleed autoplay video hero with overlay headline, tagline, and Shop All CTA.
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import videoSrc from '../../img/output_videohdrec.webm';

interface VideoHeroProps {
  onShopAll: () => void;
}

const VideoHero: React.FC<VideoHeroProps> = ({ onShopAll }) => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden border-b border-black pt-24">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/webm" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 max-w-4xl mx-auto">
        <motion.img
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'circOut' }}
          src="/assets/blkheyskipper.png"
          alt="Hey Skipper"
          className="h-10 md:h-14 w-auto object-contain mb-8 invert"
        />

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'circOut' }}
          className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6"
        >
          Beach Fishing,<br />Built Different
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-mono text-xs md:text-sm uppercase tracking-widest text-white/60 mb-10"
        >
          Travel Rods · Bait · Tackle · Bundles
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShopAll}
          className="group flex items-center gap-4 bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-neutral-100 transition-colors"
        >
          Shop All
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Scroll</span>
        <div className="w-px h-10 bg-white/20 relative overflow-hidden">
          <motion.div
            className="absolute left-0 w-full bg-white/70"
            style={{ height: '40%' }}
            animate={{ top: ['-40%', '100%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default VideoHero;
