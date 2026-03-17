// FishOnCTA — "FISH ON!" pre-footer CTA with full-bleed image background and email capture.
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import fishOnImg from '../../img/Fishon.jpg';

const FishOnCTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <section className="relative w-full border-b border-black overflow-hidden min-h-[480px] md:min-h-[560px] flex items-center">
      {/* Background */}
      <img
        src={fishOnImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover brightness-40 grayscale"
      />
      {/* Noise overlay for depth */}
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-white/50 block mb-4">
            Get First Access
          </span>

          <h2 className="text-[5rem] md:text-[9rem] font-black uppercase tracking-tighter leading-[0.82] text-white mb-8">
            Fish<br />On.
          </h2>

          <p className="font-mono text-xs uppercase text-white/55 max-w-sm leading-relaxed mb-10">
            Fishing tips, first access to new gear, and exclusive member offers straight to your inbox.
          </p>

          {status === 'success' ? (
            <div className="border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-6 max-w-md">
              <span className="font-black text-lg uppercase text-white tracking-tight block">You're In!</span>
              <span className="font-mono text-xs text-white/60 uppercase mt-1 block">
                Welcome to the fleet. First drop incoming.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex max-w-md border border-white/30 bg-white/5 backdrop-blur-sm"
            >
              <label htmlFor="fishon-email" className="sr-only">Email address</label>
              <input
                id="fishon-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-grow bg-transparent px-5 py-4 font-mono text-xs uppercase text-white placeholder:text-white/35 outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-white text-black px-6 py-4 font-bold text-xs uppercase tracking-widest hover:bg-neutral-100 transition-colors flex-shrink-0"
              >
                Join
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default FishOnCTA;
