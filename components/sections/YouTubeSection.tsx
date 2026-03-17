// YouTubeSection — click-to-reveal YouTube embed with Watch Us Fish headline and Subscribe CTA.
import React, { useState } from 'react';
import { Play, Youtube } from 'lucide-react';

// Hey Skipper's YouTube channel
const CHANNEL_URL = 'https://www.youtube.com/channel/UC2eTeSNnXaRctWQ0kltSoOA';

// Specific curated video — autoplay when user clicks Play
const EMBED_SRC =
  'https://www.youtube-nocookie.com/embed/LsqMWXL7Afo?autoplay=1&rel=0&modestbranding=1&color=white';

const YouTubeSection: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="w-full border-b border-black bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Headline + CTA */}
        <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 gap-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-white/40 block mb-4">
              On the Water
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Watch<br />Us Fish
            </h2>
            <p className="font-mono text-xs text-white/50 uppercase leading-relaxed max-w-xs">
              Real fishing. Real conditions. See our rods in action before you buy.
            </p>
          </div>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white text-black px-6 py-4 font-bold uppercase text-xs tracking-widest hover:bg-neutral-100 transition-colors w-max"
          >
            <Youtube className="w-4 h-4" aria-hidden="true" />
            Subscribe
          </a>
        </div>

        {/* Video embed */}
        <div className="lg:col-span-8 relative aspect-video bg-neutral-900">
          {loaded ? (
            <iframe
              src={EMBED_SRC}
              title="Hey Skipper Fishing — Watch Us Fish"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setLoaded(true)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 group w-full"
              aria-label="Play Hey Skipper YouTube channel"
            >
              {/* Faint grid texture overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 40px)',
                }}
                aria-hidden="true"
              />
              <div className="w-20 h-20 border border-white/20 flex items-center justify-center group-hover:border-white/60 group-hover:bg-white/10 transition-all duration-300">
                <Play className="w-8 h-8 text-white fill-white" aria-hidden="true" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors">
                Click to Play
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
