// SaltedBaitPage — dedicated landing page for Hey Skipper Salty Bits salted bait lineup.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, ChevronDown, Fish, Droplets, Package, Leaf } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';

interface SaltedBaitPageProps {
  onBack: () => void;
  onProductSelect: (product: Product) => void;
  onShop: () => void;
}

const HERO_DESKTOP = 'https://www.heyskipperfishing.com/wp-content/uploads/2026/03/salty_hero_Desktop-scaled.jpg';
const HERO_MOBILE  = 'https://www.heyskipperfishing.com/wp-content/uploads/2026/03/salty_Hero_Mobile.jpg';
const FISH_GUIDE   = 'https://www.heyskipperfishing.com/wp-content/uploads/2026/03/0daca902-db2a-4b2d-a550-f7bb8292e0e7.png';
const FOUNDER_IMG  = 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/gallery2.jpg';

const FEATURE_ICONS = [
  {
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/03/icon_tough_texture_v6_squid_1771958915810-150x150.jpg',
    label: 'Tough Texture',
    sub: 'Stays on the hook even when small fish strike',
  },
  {
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/03/icon_natural_scent_v7_combined_1771963806196-150x150.jpg',
    label: 'Natural Scent',
    sub: 'Hand-salted to preserve authentic bait scent',
  },
  {
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/03/icon_no_mess_v4_1771887379987-150x150.jpg',
    label: 'No Mess',
    sub: 'Clean to handle — no slime, no drip',
  },
  {
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/03/icon_no_fridge_v4_1771887395797-150x150.jpg',
    label: 'No Refrigeration',
    sub: 'Shelf-stable — toss it in your bag and go',
  },
];

const BAITS = [
  {
    slug: 'bait-squidy',
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/03/slab1-1.jpg',
    label: 'Squidy Bits',
    tagline: 'Salted squid strips — the universal trailer and bottom bait',
    uses: ['Lure & jig trailers', 'Bucktails & jig heads', 'Bottom fishing', 'Bait saver'],
  },
  {
    slug: 'bait-shrimpy',
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/03/shrimpy3.jpg',
    label: 'Shrimpy Bits',
    tagline: 'Salted shrimp pieces — light tackle and hi-lo rig favourite',
    uses: ['Bottom fishing', 'Hi-lo rigs', 'Offshore & charter fishing', 'Bait saver'],
  },
  {
    slug: 'bait-clammy',
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2020/12/clammybits1.jpg',
    label: 'Clammy Bits',
    tagline: 'Salted clam strips — bottom and high-low rig staple',
    uses: ['Bottom fishing', 'Fishing finder rigs', 'Offshore & charter fishing', 'High-low rigs'],
  },
];

const HOW_TO_STEPS = [
  { num: '01', title: 'Cut It to Size', body: 'Trim the bait to match your hook size and target species.' },
  { num: '02', title: 'Hook It', body: 'Thread onto your hook like fresh bait — the tough texture holds firm.' },
  { num: '03', title: 'Cast It', body: 'Fish on bottom rigs, hi-lo rigs, or as lure trailers for any species.' },
  { num: '04', title: 'Reel \'Em In!', body: 'When small fish bite — your bait stays on. Fish more, re-bait less.' },
];

const FAQS = [
  {
    q: 'What makes Salty Bits different from store-bought frozen bait?',
    a: 'Salty Bits are hand-salted using a custom process that preserves natural scent while firming the texture. Unlike frozen bait, they don\'t require refrigeration and don\'t fall apart on the hook.',
  },
  {
    q: 'How long does Salty Bits last without refrigeration?',
    a: 'Properly sealed bags last for months at room temperature. Once opened, keep in a cool dry place and use within a few weeks for best results.',
  },
  {
    q: 'What species can I catch with Salty Bits?',
    a: 'Salty Bits work for a wide range of inshore and nearshore species including flounder, sheepshead, black drum, redfish, snook, striped bass, porgy, and more.',
  },
  {
    q: 'Which bait should I start with?',
    a: 'Clammy Bits and Squidy Bits are the most versatile. If you\'re fishing bottom rigs on a pier or beach, Clammy Bits is our top recommendation. Squidy Bits work great as a jig trailer too.',
  },
  {
    q: 'Are Salty Bits made in the USA?',
    a: 'Yes — every bag is hand-made and packaged by Brendon & Erin in Florida. No chemicals. No plastic mesh. No shortcuts.',
  },
];

const SaltedBaitPage: React.FC<SaltedBaitPageProps> = ({ onBack, onProductSelect, onShop }) => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getBaitProduct = (slug: string): Product | undefined =>
    products.find(p => p.id === slug);

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
    <main className="bg-white min-h-screen">
      {/* Back nav — top padding accounts for fixed navbar (top bar h-8 + main bar h-16 = 96px) */}
      <div className="border-b border-black/10 px-4 pt-24 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back
        </button>
      </div>

      {/* ── 1. HERO ── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: 'min(90vh, 700px)' }}>
        <picture>
          <source media="(max-width: 767px)" srcSet={HERO_MOBILE} />
          <img
            src={HERO_DESKTOP}
            alt="Hey Skipper Salty Bits — salted bait that stays on the hook"
            className="absolute inset-0 w-full h-full object-cover object-center"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-16 pb-14 pt-24" style={{ minHeight: 'min(90vh, 700px)' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-mono text-xs uppercase tracking-[0.25em] text-white/70 mb-3"
          >
            Hey Skipper Salty Bits
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white font-black uppercase text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight max-w-3xl mb-4"
          >
            Stays on<br />the Hook.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-white/80 text-base md:text-lg max-w-xl mb-8"
          >
            Salted bait that stays on the hook, smells natural, and helps you spend more time fishing — not re-baiting.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={onShop}
              className="bg-white text-black px-8 py-3 font-bold uppercase text-sm tracking-widest hover:bg-neutral-100 transition-colors"
            >
              Shop Salted Baits
            </button>
            <button
              onClick={() => document.getElementById('sb-lineup')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-white text-white px-8 py-3 font-bold uppercase text-sm tracking-widest hover:bg-white/10 transition-colors"
            >
              See the Baits
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 2. FEATURE ICONS ── */}
      <section className="border-y border-black">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x divide-black/10">
          {FEATURE_ICONS.map(({ img, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-3 p-8"
            >
              <img src={img} alt="" aria-hidden="true" className="w-16 h-16 object-contain rounded-full bg-neutral-100 p-2" />
              <p className="font-bold uppercase text-xs tracking-widest">{label}</p>
              <p className="text-xs text-neutral-500 leading-snug">{sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. PROBLEM / SOLUTION ── */}
      <section className="border-b border-black bg-neutral-950 text-white px-6 md:px-16 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-4"
          >
            The Problem With Soft Bait
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-black uppercase text-2xl md:text-4xl tracking-tight leading-tight mb-6"
          >
            Small Fish Rip Soft Bait Off Fast.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-300 text-base md:text-lg leading-relaxed"
          >
            Salty Bits stay tough, stay on the hook, and keep you fishing longer.
          </motion.p>
        </div>
      </section>

      {/* ── 4. BAIT LINEUP ── */}
      <section id="sb-lineup" className="border-b border-black">
        <div className="border-b border-black px-6 md:px-16 py-6">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">The Lineup</p>
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight">Which Bait Is Right for You?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black">
          {BAITS.map(({ slug, img, label, tagline, uses }, i) => {
            const product = getBaitProduct(slug);
            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col group cursor-pointer"
                onClick={() => product && onProductSelect(product)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && product && onProductSelect(product)}
                aria-label={`View ${label}`}
              >
                <div className="relative overflow-hidden bg-neutral-100" style={{ aspectRatio: '1/1' }}>
                  <img
                    src={img}
                    alt={label}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 border-t border-black/10 flex flex-col flex-grow">
                  <h3 className="font-black uppercase text-lg tracking-tight mb-1 group-hover:underline underline-offset-2 decoration-1">
                    {label}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">{tagline}</p>
                  <ul className="space-y-1 flex-grow">
                    {uses.map(u => (
                      <li key={u} className="flex items-center gap-2 text-xs text-neutral-600">
                        <span className="w-1 h-1 rounded-full bg-black flex-shrink-0" />
                        {u}
                      </li>
                    ))}
                  </ul>
                  {product && (
                    <div className="flex items-center justify-between mt-5 pt-5 border-t border-black/10">
                      <span className="font-mono font-bold text-xl tabular-nums">${product.price.toFixed(2)}</span>
                      <button
                        onClick={e => handleAdd(e, product)}
                        className="flex items-center gap-1.5 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                        aria-label={`Add ${label} to cart`}
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 5. HOW TO FISH ── */}
      <section className="border-b border-black px-6 md:px-16 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">Simple as That</p>
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight mb-12">
            How to Fish Salty Bits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {HOW_TO_STEPS.map(({ num, title, body }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-3"
              >
                <span className="font-mono text-4xl font-black text-black/10">{num}</span>
                <h3 className="font-black uppercase text-sm tracking-tight">{title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FISH SPECIES GUIDE ── */}
      <section className="border-b border-black">
        <div className="border-b border-black px-6 md:px-16 py-6">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">What's Biting</p>
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight">Fish That Eat Salty Bits</h2>
        </div>
        <img
          src={FISH_GUIDE}
          alt="Species guide showing fish that respond to Salty Bits salted bait"
          loading="lazy"
          className="w-full h-auto block"
        />
      </section>

      {/* ── 7. HERITAGE / FOUNDER ── */}
      <section className="border-b border-black">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="overflow-hidden bg-neutral-100" style={{ minHeight: '400px' }}>
            <img
              src={FOUNDER_IMG}
              alt="Brendon and Erin — founders of Hey Skipper Fishing"
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ minHeight: '400px' }}
            />
          </div>
          <div className="flex flex-col justify-center px-8 md:px-14 py-16 border-t md:border-t-0 md:border-l border-black/10">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-3">Made by Hand</p>
            <h2 className="font-black uppercase text-2xl md:text-3xl tracking-tight mb-6">
              Handmade by<br />Brendon & Erin
            </h2>
            <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
              <p>
                Salted bait has been used around the world for decades because it preserves natural scent while keeping bait firm and durable. We're proud to continue that tradition using our own hand-salting process.
              </p>
              <p>
                Every bag of Salty Bits is hand-made and packaged by us. No chemicals. No plastic mesh. No shortcuts. Made in Florida, USA.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-8 pt-8 border-t border-black/10">
              {[
                { icon: <Fish className="w-4 h-4" aria-hidden="true" />, text: 'Natural Ingredients' },
                { icon: <Leaf className="w-4 h-4" aria-hidden="true" />, text: 'Made in Florida' },
                { icon: <Package className="w-4 h-4" aria-hidden="true" />, text: 'No Chemicals' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-neutral-500">
                  {icon} {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. WHY SALTED BAIT WORKS ── */}
      <section className="border-b border-black bg-neutral-50 px-6 md:px-16 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-3">The Science is Simple</p>
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight mb-6">
            Why Salted Bait Has Worked for Generations
          </h2>
          <p className="text-neutral-600 leading-relaxed text-base md:text-lg">
            Salting draws out moisture, concentrates the natural scent, and firms the texture so it stays on the hook through repeated casts and small fish strikes. It's the same technique used by surf anglers and charter captains worldwide — we just made it convenient.
          </p>
        </div>
      </section>

      {/* ── 9. FAQ ── */}
      <section className="border-b border-black px-6 md:px-16 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">Have Questions?</p>
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight mb-10">FAQ</h2>
          <div className="divide-y divide-black/10">
            {FAQS.map(({ q, a }, i) => (
              <div key={i}>
                <button
                  className="w-full flex justify-between items-start gap-4 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="font-bold text-sm leading-snug">{q}</span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm text-neutral-600 leading-relaxed">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. CTA BANNER ── */}
      <section className="bg-black text-white px-6 md:px-16 py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-black uppercase text-3xl md:text-5xl tracking-tight mb-4"
        >
          Stop Re-Baiting.<br />Start Catching.
        </motion.h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto">
          Pick your Salty Bits and spend more time with the rod in the water.
        </p>
        <button
          onClick={onShop}
          className="bg-white text-black px-10 py-4 font-bold uppercase text-sm tracking-widest hover:bg-neutral-200 transition-colors"
        >
          Shop All Baits
        </button>
      </section>
    </main>
  );
};

export default SaltedBaitPage;
