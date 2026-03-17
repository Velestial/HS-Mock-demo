// TravelRodPage — dedicated landing page for Hey Skipper travel rod lineup.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, ChevronDown, Check, MapPin, Anchor, Package, Shield } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';

interface TravelRodPageProps {
  onBack: () => void;
  onProductSelect: (product: Product) => void;
  onShop: () => void;
}

const HERO_DESKTOP = 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/travellanding1-scaled.jpg';
const HERO_MOBILE  = 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/travelrodlandingpagemobile.jpg';
const COMPARE_DESKTOP = 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/CompareRods-scaled.jpg';
const COMPARE_MOBILE  = 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/COMPAREMOBILE.jpg';
const BREAKDOWN_DESKTOP = 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/breakdown2-scaled.jpg';
const BREAKDOWN_MOBILE  = 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/breakdownmobile-scaled.jpg';

const ROD_PRODUCTS = [
  {
    slug: 'rod-inshore-76',
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/7.jpg',
    label: "7'6\" Inshore",
    tagline: 'Ideal for bays, jetties, docks, and light beach fishing',
    tag: 'INSHORE',
  },
  {
    slug: 'rod-travel-92',
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/92.jpg',
    label: "9'2\" Hybrid",
    tagline: 'The most versatile option — bridges inshore and surf',
    tag: 'BEST SELLER',
  },
  {
    slug: 'rod-surf-11',
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/11.jpg',
    label: "11' Surf Commander",
    tagline: 'Built for distance, reach, and heavy beach conditions',
    tag: 'SURF',
  },
];

const GALLERY = [
  'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/2.5.jpg',
  'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/4.jpg',
  'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/travel4.jpg',
  'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/travel2.jpg',
  'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/6.jpg',
  'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/gallery2-2.jpg',
  'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/1.jpg',
  'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/3.jpg',
];

const ICONS = [
  {
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/travel-agency-150x150.png',
    label: 'Travelers',
    sub: 'Packs in carry-on or checked bag',
  },
  {
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/fisherman-150x150.png',
    label: 'Weekend Anglers',
    sub: 'Grab it and go — no setup headaches',
  },
  {
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/fisherman-1-150x150.png',
    label: 'Beginners',
    sub: 'One rod that does it all',
  },
  {
    img: 'https://www.heyskipperfishing.com/wp-content/uploads/2026/01/fisherman-2-150x150.png',
    label: 'Experienced Anglers',
    sub: 'Portability without sacrificing performance',
  },
];

const FAQS = [
  {
    q: 'How many pieces does the travel rod break into?',
    a: 'The 9\'2" and 11\' models are 5-piece designs that pack down small. The 7\'6" is a 4-piece rod.',
  },
  {
    q: 'What\'s included with the rod?',
    a: 'Every rod comes with a rod case/sleeve for travel protection and a manufacturer\'s warranty card.',
  },
  {
    q: 'Are these rods good for saltwater?',
    a: 'Yes — all Hey Skipper travel rods are built with saltwater-rated components and corrosion-resistant guides.',
  },
  {
    q: 'Which rod is best for beach fishing?',
    a: 'The 11\' Surf Commander is purpose-built for beach fishing distance casting. The 9\'2" Hybrid is great if you fish both beach and inshore.',
  },
  {
    q: 'Do you offer a warranty?',
    a: 'Hey Skipper offers a lifetime warranty against manufacturing defects on all rods. See our warranty page for details.',
  },
];

const TravelRodPage: React.FC<TravelRodPageProps> = ({ onBack, onProductSelect, onShop }) => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getRodProduct = (slug: string): Product | undefined =>
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
      {/* Back nav */}
      <div className="border-b border-black/10 px-4 py-3">
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
            alt="Hey Skipper Travel Rod lineup — tested across the country"
            className="absolute inset-0 w-full h-full object-cover object-center"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-16 pb-14 pt-24" style={{ minHeight: 'min(90vh, 700px)' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-mono text-xs uppercase tracking-[0.25em] text-white/70 mb-3"
          >
            Hey Skipper Travel Rods
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white font-black uppercase text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight max-w-3xl mb-4"
          >
            Tested Across<br />the Country
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-white/80 text-base md:text-lg max-w-xl mb-8"
          >
            Made for anglers who don't stay in one place.
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
              Shop Rods
            </button>
            <button
              onClick={() => document.getElementById('tr-lineup')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-white text-white px-8 py-3 font-bold uppercase text-sm tracking-widest hover:bg-white/10 transition-colors"
            >
              See the Lineup
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 2. TRUST STRIP ── */}
      <section className="border-y border-black bg-black text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
          {[
            { icon: <MapPin className="w-4 h-4" aria-hidden="true" />, text: 'Made for Travel' },
            { icon: <Anchor className="w-4 h-4" aria-hidden="true" />, text: 'Saltwater Ready' },
            { icon: <Package className="w-4 h-4" aria-hidden="true" />, text: 'Fits Carry-On' },
            { icon: <Shield className="w-4 h-4" aria-hidden="true" />, text: 'Lifetime Warranty' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center justify-center gap-2 py-4 px-6 font-mono text-xs uppercase tracking-widest">
              {icon}
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. ROD LINEUP ── */}
      <section id="tr-lineup" className="border-b border-black">
        <div className="border-b border-black px-6 md:px-16 py-6">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">The Lineup</p>
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight">Pick Your Rod</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black">
          {ROD_PRODUCTS.map(({ slug, img, label, tagline, tag }, i) => {
            const product = getRodProduct(slug);
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
                <div className="relative overflow-hidden bg-neutral-100" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={img}
                    alt={label}
                    loading="lazy"
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-black text-white font-mono text-[10px] uppercase px-2 py-1">
                    {tag}
                  </span>
                </div>
                <div className="p-6 border-t border-black/10 flex flex-col flex-grow">
                  <h3 className="font-black uppercase text-lg tracking-tight mb-1 group-hover:underline underline-offset-2 decoration-1">
                    {label}
                  </h3>
                  <p className="text-sm text-neutral-600 flex-grow">{tagline}</p>
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

      {/* ── 4. COMPARE IMAGE ── */}
      <section className="border-b border-black">
        <picture>
          <source media="(max-width: 767px)" srcSet={COMPARE_MOBILE} />
          <img
            src={COMPARE_DESKTOP}
            alt="Side-by-side comparison of all three Hey Skipper travel rods"
            loading="lazy"
            className="w-full h-auto block"
          />
        </picture>
      </section>

      {/* ── 5. WHO IT'S FOR ── */}
      <section className="border-b border-black px-6 md:px-16 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">Who It's For</p>
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight mb-12">
            Don't Overthink It.<br />Just Go Fish.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {ICONS.map(({ img, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="w-20 h-20 bg-neutral-100 rounded-full overflow-hidden flex items-center justify-center">
                  <img src={img} alt="" aria-hidden="true" className="w-14 h-14 object-contain" />
                </div>
                <div>
                  <p className="font-bold uppercase text-sm tracking-tight">{label}</p>
                  <p className="text-xs text-neutral-500 mt-1">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. ROD BREAKDOWN IMAGE ── */}
      <section className="border-b border-black">
        <picture>
          <source media="(max-width: 767px)" srcSet={BREAKDOWN_MOBILE} />
          <img
            src={BREAKDOWN_DESKTOP}
            alt="Detailed breakdown of Hey Skipper travel rod components"
            loading="lazy"
            className="w-full h-auto block"
          />
        </picture>
      </section>

      {/* ── 7. GALLERY ── */}
      <section className="border-b border-black">
        <div className="border-b border-black px-6 md:px-16 py-6">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">In the Field</p>
          <h2 className="font-black uppercase text-2xl md:text-4xl tracking-tight">Anglers in Action</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {GALLERY.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={['overflow-hidden bg-neutral-100', i % 4 < 3 ? 'border-r border-black/10' : ''].join(' ')}
              style={{ aspectRatio: '1/1' }}
            >
              <img
                src={src}
                alt={`Angler fishing with Hey Skipper travel rod ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 8. WHY TRAVEL ROD CALLOUTS ── */}
      <section className="border-b border-black px-6 md:px-16 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <Check className="w-5 h-5" aria-hidden="true" />,
              title: 'Multi-Piece Design',
              body: 'Breaks down small enough to fit in a rod sleeve, luggage, or truck bed without a rod tube.',
            },
            {
              icon: <Check className="w-5 h-5" aria-hidden="true" />,
              title: 'Saltwater-Grade Components',
              body: 'Corrosion-resistant stainless guides and real reel seat hardware — not the hardware-store stuff.',
            },
            {
              icon: <Check className="w-5 h-5" aria-hidden="true" />,
              title: 'Lifetime Warranty',
              body: 'Every Hey Skipper rod is backed by a lifetime manufacturer\'s warranty against defects.',
            },
          ].map(({ icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex flex-col gap-4"
            >
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                {icon}
              </div>
              <h3 className="font-black uppercase text-base tracking-tight">{title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{body}</p>
            </motion.div>
          ))}
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
          Don't Overthink It.<br />Just Go Fish.
        </motion.h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto">
          Pick the rod that fits your style and get out on the water.
        </p>
        <button
          onClick={onShop}
          className="bg-white text-black px-10 py-4 font-bold uppercase text-sm tracking-widest hover:bg-neutral-200 transition-colors"
        >
          Shop All Rods
        </button>
      </section>
    </main>
  );
};

export default TravelRodPage;
