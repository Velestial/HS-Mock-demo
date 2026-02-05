import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    author: "J. THORNTON",
    location: "FLORIDA_KEYS",
    rating: 5,
    date: "2024-02-14",
    text: "Absolute game changer for travel. Fits in my carry-on, handles 20lb snook no problem. The sensitivity is unreal for a multi-piece rod."
  },
  {
    id: 2,
    author: "M. KOWALSKI",
    location: "MONTAUK_NY",
    rating: 5,
    date: "2024-01-22",
    text: "Feels just like a one-piece. Incredible backbone when fighting stripers in the surf. This is the future of travel gear."
  },
  {
    id: 3,
    author: "S. RODRIGUEZ",
    location: "COSTA_RICA",
    rating: 5,
    date: "2023-12-05",
    text: "Took this to Costa Rica. Landed roosters from the beach. Indestructible and packs down small enough for a backpack."
  }
];

const Reviews: React.FC = () => {
  return (
    <section className="w-full border-b border-black bg-white">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
        <div className="p-8 md:p-12 border-b md:border-b-0 border-black md:border-r flex items-center justify-between bg-neutral-50">
           <div>
             <h3 className="text-4xl font-black uppercase tracking-tighter mb-2">Field Reports</h3>
             <p className="font-mono text-xs text-neutral-500">VERIFIED_PURCHASE_DATA</p>
           </div>
           <div className="text-right">
             <span className="text-5xl font-black tracking-tighter block">4.9</span>
             <div className="flex gap-1 justify-end mt-1">
               {[1, 2, 3, 4, 5].map((i) => (
                 <Star key={i} className="w-3 h-3 fill-black text-black" />
               ))}
             </div>
           </div>
        </div>
        
        <div className="p-8 md:p-12 flex items-center justify-center md:justify-start">
           <p className="font-mono text-xs max-w-md leading-relaxed uppercase text-neutral-600">
             "Engineered for the mobile angler. Our equipment is tested in the harshest environments by operators worldwide."
           </p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {reviews.map((review, index) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`
              p-8 md:p-12 flex flex-col justify-between min-h-[300px] hover:bg-neutral-50 transition-colors
              ${index !== reviews.length - 1 ? 'border-b md:border-b-0 border-black md:border-r' : ''}
            `}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-black text-black" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-neutral-200 fill-neutral-200" />
              </div>
              
              <p className="text-sm font-medium leading-relaxed uppercase mb-8">
                "{review.text}"
              </p>
            </div>

            <div className="border-t border-black/10 pt-4 mt-auto">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="font-bold text-xs uppercase tracking-wide">{review.author}</span>
                  <span className="font-mono text-[10px] text-neutral-500 uppercase">{review.location}</span>
                </div>
                <div className="flex items-center gap-1 text-neutral-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="font-mono text-[10px] uppercase">Verified</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* CTA Strip */}
      <div className="w-full border-t border-black p-4 flex justify-center items-center hover:bg-black hover:text-white transition-colors cursor-pointer group">
         <span className="font-mono text-xs uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">Read All 51 Reports</span>
      </div>
    </section>
  );
};

export default Reviews;