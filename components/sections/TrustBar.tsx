// TrustBar — thin 5-icon social proof strip below the video hero.
import React from 'react';
import { Truck, Shield, Users, Youtube, Heart } from 'lucide-react';

const items = [
  { icon: Truck,   label: 'Free Shipping Over $99' },
  { icon: Shield,  label: 'Lifetime Warranty' },
  { icon: Users,   label: '1,000+ Happy Anglers' },
  { icon: Youtube, label: 'YouTube Community' },
  { icon: Heart,   label: 'Family Owned' },
];

const TrustBar: React.FC = () => (
  <div className="w-full border-b border-black bg-neutral-50 overflow-x-auto">
    <div className="flex min-w-max md:min-w-0 md:grid md:grid-cols-5 divide-x divide-black">
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center justify-center gap-2.5 px-6 py-4">
          <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-wider whitespace-nowrap">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TrustBar;
