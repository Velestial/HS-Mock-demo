import React, { useState } from 'react';
import { X, Anchor } from 'lucide-react';
import gallery3 from '../assets/gallery-3.jpg';

const EmotivePopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    // Open State: The Mocked Modal
    if (isOpen) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div
                    className="relative w-full max-w-[600px] aspect-square md:aspect-[4/3] bg-cover bg-center rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center p-8"
                    style={{ backgroundImage: `url(${gallery3})` }}
                >
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Close button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 z-20 hover:opacity-70 transition-opacity"
                    >
                        <X size={28} className="text-gray-600" />
                    </button>

                    {/* Content */}
                    <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
                        {/* Logo area */}
                        <div className="flex flex-col items-center mb-2">
                            <div className="flex items-center gap-2 text-black mb-1">
                                <Anchor size={40} strokeWidth={2.5} />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="font-black text-xl tracking-tighter">HEY</span>
                                    <span className="font-black text-3xl tracking-tighter">SKIPPER<span className="text-xs align-top ml-0.5">TM</span></span>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight drop-shadow-sm">
                            Sign up and receive a FREE GIFT with your purchase!
                        </h2>

                        <form className="w-full flex flex-col gap-3 mt-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="tel"
                                placeholder="Your phone number"
                                className="w-full px-4 py-3 bg-white rounded-md text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black shadow-lg"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-900 transition-colors shadow-lg uppercase tracking-wider"
                            >
                                Submit
                            </button>
                        </form>

                        <p className="text-[10px] text-white/90 leading-tight max-w-xs mx-auto drop-shadow-md">
                            By signing up via text, you agree to receive recurring automated promotional and personalized marketing text messages (e.g., cart reminders) at the cell number used when signing up. Consent is not a condition of any purchase. Reply STOP to cancel. Message frequency varies. Message and data rates may apply.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Teaser State: The "Pill" widget
    return (
        <div className="fixed bottom-6 left-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div
                className="flex items-center gap-3 bg-black text-white pl-5 pr-2 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 group"
                onClick={() => setIsOpen(true)}
            >
                <span className="font-medium text-sm select-none">
                    <span className="font-bold">FREE GIFT</span> with your purchase
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsVisible(false);
                    }}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Dismiss offer"
                >
                    <X size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                </button>
            </div>
        </div>
    );
};

export default EmotivePopup;
