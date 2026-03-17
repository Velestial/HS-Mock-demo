// ProductDescription — rod-specific copy block with headline, body, origin story, and key features.
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';

interface RodContent {
  headline: string[];        // split lines for the big left title
  designLogic: string[];     // bullet lines under the divider
  lead: string;
  bodyLeft: string;
  bodyRight: string;
  originLabel: string;
  originQuote: string;
  features: { title: string; desc: string }[];
}

const ROD_CONTENT: Record<string, RodContent> = {
  'rod-travel-92': {
    headline: ['The One', 'Rod Solution'],
    designLogic: ['Max Performance', 'Min Footprint'],
    lead: "Crafted with premium carbon fiber, our 9'2\u2033 Hybrid Travel Fishing Rod bridges the gap between inshore precision and surf power. It\u2019s the one-rod solution when you want to cover a wide range of fishing environments.",
    bodyLeft: "Compact, lightweight, and powerful, this rod is designed to give you the freedom to fish anywhere\u2014whether it\u2019s the beach, pier, jetty or inshore rivers, creeks and under bridges, this rod is perfect for variety.",
    bodyRight: "At 9\u20322\u2033, this full-sized hybrid rod breaks down into 5 travel-friendly pieces, packing to just 2 feet for easy transport. Despite its portability, it delivers serious performance: lightweight and sensitive enough to detect subtle bites, yet strong enough to battle the fish that count.",
    originLabel: 'Origin Story',
    originQuote: "\u201cAs seen on the Hey Skipper Fishing channel, our specialty travel fishing rod was designed by Brendon to represent ULTIMATE FREEDOM. Whether you\u2019re flying to paradise or driving down the coast, it sets up fast, travels light, and is always ready to fish when you are.\u201d",
    features: [
      { title: "Premium Carbon Fiber", desc: "Lightweight, sensitive, and incredibly strong." },
      { title: "9\u20322\u2033 Length, 5-Piece", desc: "Packs down to just 2 feet for easy travel." },
      { title: "Hybrid Versatility", desc: "Casts long distances for surf fishing but still sensitive for inshore lures." },
      { title: "Travel Ready", desc: "Compact, durable, and designed to fish anywhere in the world." },
    ],
  },

  'rod-inshore-76': {
    headline: ['The', 'Specialist'],
    designLogic: ['Finesse Engineered', 'Zero Compromise'],
    lead: "Ultra-Sensitive. Travel-Ready. Built for Inshore Precision. Our 7\u20326\u2033 Inshore Travel Rod is designed for anglers who want maximum sensitivity and control in a lightweight, compact rod.",
    bodyLeft: "The carbon fiber construction makes this rod lighter, stronger, and more responsive than traditional travel rods. The added carbon wrap boosts torsional strength and sensitivity, giving you better bite detection, quicker hooksets, and more confidence when fighting fish near structure.",
    bodyRight: "Designed for finesse fishing, the 7\u20326\u2033 length is ideal for casting light tackle around docks, under bridges, creeks, rivers and mangroves. The fast-action tip provides incredible feedback, while the strong backbone handles bigger fish near structure. The extended EVA foam grip reduces fatigue during longer sessions.",
    originLabel: 'Design Intent',
    originQuote: "\u201cBuilt for the angler who demands precision in tight spaces. The 7\u20326\u2033 Inshore Specialist puts sensitivity and control in your hands \u2014 whether you\u2019re working docks, mangroves, or creeks, it\u2019s always ready to perform.\u201d",
    features: [
      { title: "Carbon Fiber Wrapped", desc: "Improved precision, responsiveness, and torsional strength." },
      { title: "5-Piece Travel Design", desc: "Packs into a backpack, kayak, or carry-on with ease." },
      { title: "Oversized EVA Foam Grip", desc: "Extended power grip reduces fatigue during long sessions." },
      { title: "Fast-Action / Firm Backbone", desc: "Perfect for small to large inshore species in tight structure." },
    ],
  },

  'rod-surf-11': {
    headline: ['The', 'Commander'],
    designLogic: ['Maximum Distance', 'Surf Optimised'],
    lead: "Built to heave heavy payloads past the breakers, the 11\u2032 Surf Commander is engineered for anglers who need maximum casting distance and backbone to control big fish in open surf.",
    bodyLeft: "High-modulus Toray carbon blanks deliver the power-to-weight ratio needed for sustained long-distance casting sessions. The 2-piece design keeps transport manageable without sacrificing the stiffness and power transfer of a one-piece blank.",
    bodyRight: "Rated for 2\u20136\u00a0oz lures and 20\u201340\u00a0lb braid, this rod handles everything from soaking cut bait on the bottom to lobbing large surf rigs through heavy wind. When the bite happens, the moderate action loads fully for serious hooksets at distance.",
    originLabel: 'Field Notes',
    originQuote: "\u201cDesigned for the angler who wakes up before dawn and stays until dark. The Surf Commander is built to take the punishment of saltwater, sand, and heavy loads \u2014 session after session, beach after beach.\u201d",
    features: [
      { title: "Toray Carbon Blank", desc: "High-modulus construction for maximum power and sensitivity." },
      { title: "5-Piece Design", desc: "Transportable without sacrificing blank integrity." },
      { title: "Heavy Lure Rating", desc: "Handles 2\u20136\u00a0oz for punching through surf conditions." },
      { title: "Titanium / SiC Guides", desc: "Smooth, friction-free line flow for maximum cast distance." },
    ],
  },
};

const FALLBACK_CONTENT = ROD_CONTENT['rod-travel-92'];

interface ProductDescriptionProps {
  product?: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  const content = (product?.id && ROD_CONTENT[product.id]) ? ROD_CONTENT[product.id] : FALLBACK_CONTENT;

  return (
    <section className="w-full border-b border-black bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 max-w-[1920px] mx-auto">

        {/* Left Column - Title/Context */}
        <div className="lg:col-span-4 p-8 md:p-12 border-b lg:border-b-0 border-black lg:border-r flex flex-col justify-between">
          <div className="sticky top-20">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              {content.headline.map((line, i) => (
                <React.Fragment key={i}>{line}{i < content.headline.length - 1 && <br />}</React.Fragment>
              ))}
            </h2>
            <div className="mt-12 hidden lg:block">
              <div className="w-12 h-1 bg-black mb-4"></div>
              <p className="font-mono text-xs uppercase max-w-[200px] text-neutral-500 leading-relaxed">
                Design Logic: <br />
                {content.designLogic.map((line, i) => (
                  <React.Fragment key={i}>{line}{i < content.designLogic.length - 1 && <br />}</React.Fragment>
                ))}
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
              {content.lead}
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base leading-relaxed text-neutral-700 font-normal">
              <p>{content.bodyLeft}</p>
              <p>{content.bodyRight}</p>
            </div>

            <div className="bg-neutral-50 border border-black p-8 relative">
              <span className="absolute top-0 left-0 bg-black text-white text-xs font-mono px-2 py-1 uppercase">{content.originLabel}</span>
              <p className="text-sm md:text-base font-medium uppercase leading-relaxed mt-2">
                {content.originQuote}
              </p>
            </div>

            {/* Key Features */}
            <div className="pt-8 border-t border-black">
              <h3 className="font-black uppercase tracking-widest text-lg mb-8">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {content.features.map((feature, i) => (
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
