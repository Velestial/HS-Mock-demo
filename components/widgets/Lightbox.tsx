// Lightbox — full-screen image viewer overlay with navigation for product image galleries.
import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex, isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

    // Sync internal state if initialIndex changes when opening
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [initialIndex, isOpen]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, handleNext, handlePrev]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Navigation - Prev */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrev();
                            }}
                            className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors p-4"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>
                    )}

                    {/* Main Image */}
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`Product view ${currentIndex + 1}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="max-h-[85vh] max-w-[85vw] object-contain select-none"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Navigation - Next */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors p-4"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>
                    )}

                    {/* Counter/Indicator */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-mono text-xs tracking-widest">
                            {currentIndex + 1} / {images.length}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Lightbox;
