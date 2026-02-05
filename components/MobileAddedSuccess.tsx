import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MobileAddedSuccess: React.FC = () => {
    const { showMobileAddedSuccess } = useCart();

    return (
        <AnimatePresence>
            {showMobileAddedSuccess && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-black text-white rounded-full shadow-xl flex items-center gap-3 w-max max-w-[90vw]"
                >
                    <div className="bg-white/20 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-sm tracking-wide">Added to Cart</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileAddedSuccess;
