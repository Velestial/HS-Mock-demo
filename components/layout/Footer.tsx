import React from 'react';

interface FooterProps {
  onNavigateFAQ?: () => void;
  onNavigateBundles?: () => void;
  onNavigateBait?: () => void;
  onNavigateTackle?: () => void;
  onNavigateEbooks?: () => void;
  onNavigateRods?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
  onNavigateWarranty?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onNavigateFAQ,
  onNavigateBundles,
  onNavigateBait,
  onNavigateTackle,
  onNavigateEbooks,
  onNavigateRods,
  onNavigatePrivacy,
  onNavigateTerms,
  onNavigateWarranty
}) => {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'success'>('idle');

  const phrases = [
    "/// MISSION_READY /// ANY_COAST_ANYWHERE",
    "/// DESTINATION_BOUND /// ZERO_LIMITS",
    "/// GLOBAL_REACH /// COMPACT_POWER",
    "/// FLIGHT_APPROVED /// SHORE_READY",
    "/// 5_PIECE_PRECISION /// 9_FOOT_PERFORMANCE"
  ];

  // Repeat phrases to ensure they fill the width of large screens (12x)
  const marqueeItems = [
    ...phrases, ...phrases, ...phrases, ...phrases,
    ...phrases, ...phrases, ...phrases, ...phrases,
    ...phrases, ...phrases, ...phrases, ...phrases
  ];

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateFAQ) onNavigateFAQ();
  };

  const handleBundlesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateBundles) onNavigateBundles();
  };

  const handleBaitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateBait) onNavigateBait();
  };

  const handleTackleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateTackle) onNavigateTackle();
  };

  const handleEbooksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateEbooks) onNavigateEbooks();
  };

  const handleRodsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateRods) onNavigateRods();
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigatePrivacy) onNavigatePrivacy();
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateTerms) onNavigateTerms();
  };

  const handleWarrantyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateWarranty) onNavigateWarranty();
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-white text-black pb-12">
      {/* Marquee or Separator */}
      <div className="border-b border-black py-4 overflow-hidden whitespace-nowrap flex select-none">
        {marqueeItems.map((text, i) => (
          <span key={i} className="text-xs font-mono uppercase px-4 text-neutral-400 flex-shrink-0">
            {text}
          </span>
        ))}
      </div>

      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-4 border-x border-black">

        <div className="p-8 md:p-12 border-b md:border-b-0 border-black md:border-r">
          <span className="font-black text-2xl tracking-tighter uppercase block mb-6">Hey Skipper</span>
          <p className="font-mono text-xs text-neutral-500 uppercase">
            Florida, USA<br />
            Est. 2016
          </p>
        </div>

        <div className="p-8 md:p-12 border-b md:border-b-0 border-black md:border-r flex flex-col space-y-4">
          <h4 className="font-bold uppercase text-sm">Products</h4>
          <a href="#" onClick={handleRodsClick} className="font-mono text-xs uppercase hover:bg-black hover:text-white w-max px-1">Rods</a>
          <a href="#" onClick={handleBundlesClick} className="font-mono text-xs uppercase hover:bg-black hover:text-white w-max px-1">Bundles</a>
          <a href="#" onClick={handleBaitClick} className="font-mono text-xs uppercase hover:bg-black hover:text-white w-max px-1">Bait</a>
          <a href="#" onClick={handleTackleClick} className="font-mono text-xs uppercase hover:bg-black hover:text-white w-max px-1">Tackle</a>
          <a href="#" onClick={handleEbooksClick} className="font-mono text-xs uppercase hover:bg-black hover:text-white w-max px-1">E-Books</a>
        </div>

        <div className="p-8 md:p-12 border-b md:border-b-0 border-black md:border-r flex flex-col space-y-4">
          <h4 className="font-bold uppercase text-sm">Support</h4>
          <a href="#" onClick={handleWarrantyClick} className="font-mono text-xs uppercase hover:bg-black hover:text-white w-max px-1">Warranty</a>
          <a href="#" onClick={handleSupportClick} className="font-mono text-xs uppercase hover:bg-black hover:text-white w-max px-1">Shipping</a>
          <a href="#" onClick={handleSupportClick} className="font-mono text-xs uppercase hover:bg-black hover:text-white w-max px-1">Returns</a>
          <a href="#" onClick={handleSupportClick} className="font-mono text-xs uppercase hover:bg-black hover:text-white w-max px-1">Contact</a>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold uppercase text-sm">Newsletter</h4>
            {status === 'success' ? (
              <div className="border border-green-600 bg-green-50 p-4 text-center">
                <span className="font-black text-sm uppercase text-green-700 tracking-tight block">Transmission Received</span>
                <span className="font-mono text-[10px] text-green-600 uppercase mt-1 block">Welcome Aboard the Fleet</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-black pb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL"
                  className="w-full bg-transparent outline-none font-mono text-xs uppercase placeholder:text-neutral-400"
                  required
                />
                <button type="submit" className="font-bold uppercase text-xs hover:text-neutral-500">Join</button>
              </form>
            )}
          </div>
          <div className="mt-8 md:mt-0">
            <span className="font-mono text-[10px] text-neutral-400 uppercase">
              © 2026 Hey Skipper Inc. All rights reserved.
            </span>
            <div className="flex space-x-4 mt-2">
              <a href="#" onClick={handlePrivacyClick} className="font-mono text-[10px] text-neutral-400 uppercase hover:text-black">Privacy Policy</a>
              <a href="#" onClick={handleTermsClick} className="font-mono text-[10px] text-neutral-400 uppercase hover:text-black">Terms & Conditions</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;