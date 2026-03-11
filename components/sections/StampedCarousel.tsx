// StampedCarousel — Stamped.io reviews carousel widget for the homepage, displays aggregated review feed.
import React from 'react';

const StampedCarousel: React.FC = () => {
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (typeof (window as any).StampedFn !== 'undefined') {
        (window as any).StampedFn.reloadUGC();
      }
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="w-full border-b border-black bg-white py-8 px-6">
      <div className="max-w-[1920px] mx-auto">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">What Anglers Are Saying</h2>
        {/*
          Stamped.io carousel widget.
          data-widget-type="carousel" — if this renders incorrectly, check Stamped Dashboard
          -> Display Widgets -> Carousel -> Get Code for the authoritative widget type value.
          The initStamped() call in App.tsx ensures StampedFn is initialized before this renders.
        */}
        <div
          id="stamped-reviews-widget"
          data-widget-type="carousel"
          data-store-hash={import.meta.env.VITE_STAMPED_STORE_HASH}
          data-api-key={import.meta.env.VITE_STAMPED_API_KEY}
        />
      </div>
    </section>
  );
};

export default StampedCarousel;
