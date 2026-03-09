// RodWarrantyPage — static rod replacement warranty terms and coverage details.
import React, { useEffect } from 'react';

interface RodWarrantyPageProps {
    onBack: () => void;
}

const RodWarrantyPage: React.FC<RodWarrantyPageProps> = ({ onBack }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full bg-white pt-24 pb-16 px-4 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="mb-8 font-mono text-sm border-b border-black pb-1 hover:text-neutral-500 transition-colors"
                >
                    &larr; BACK TO HOME
                </button>

                <h1 className="text-4xl md:text-6xl font-black uppercase mb-12 tracking-tighter leading-none">
                    Rod Warranty &<br /> Replacement Policy
                </h1>

                <div className="space-y-12 font-mono text-sm leading-relaxed">
                    <section className="bg-neutral-100 p-8 border border-black">
                        <h2 className="text-2xl font-black uppercase mb-4">💥 Something Broke? We’ve Got Your Back.</h2>
                        <p className="text-lg mb-4">
                            We know things happen — especially when you’re new to fishing. Whether it’s a clean snap or a freak accident, we want to get you back on the water fast.
                        </p>
                        <p className="font-bold">Here’s how we handle breakages:</p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="border border-black p-8 hover:bg-black hover:text-white transition-colors group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🐟</div>
                            <h3 className="font-bold uppercase text-lg mb-4">Broken within first couple of uses</h3>
                            <p className="text-neutral-600 group-hover:text-neutral-300">
                                We’ll replace the broken part completely free — no hassle. Just send us a few photos and let us know what happened. We’ll take care of the rest.
                            </p>
                        </div>

                        <div className="border border-black p-8 hover:bg-black hover:text-white transition-colors group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔁</div>
                            <h3 className="font-bold uppercase text-lg mb-4">Broken later, or accidental damage</h3>
                            <p className="text-neutral-600 group-hover:text-neutral-300">
                                We offer replacement tips and parts at a discounted rate — just $50.00 including shipping. That way, you’re never stuck without a rod.
                            </p>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-start space-x-4">
                            <div className="text-4xl">⚖️</div>
                            <div>
                                <h3 className="font-bold uppercase text-xl mb-2">Why this works</h3>
                                <p>
                                    We don’t play the blame game. We just want to keep you fishing — and improving. Our team is here to help, no matter your skill level.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-black pt-8 mt-12">
                        <p className="uppercase text-neutral-500 mb-2">Contact Support</p>
                        <a href="mailto:info@heyskipperfishing.com" className="text-xl font-bold underline hover:text-neutral-600">
                            info@heyskipperfishing.com
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RodWarrantyPage;
