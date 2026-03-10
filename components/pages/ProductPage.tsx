// ProductPage — detailed product view with image gallery, specs, and add-to-cart for a single product.
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import Lightbox from '../widgets/Lightbox';
import { trackViewItem } from '../../utils/analytics';

interface ProductPageProps {
    product: Product;
    onBack: () => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onBack }) => {
    const { addToCart } = useCart();
    const [selectedImage, setSelectedImage] = React.useState(0);
    const [lightboxOpen, setLightboxOpen] = React.useState(false);
    const [hasReviews, setHasReviews] = React.useState(false);
    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    // Reset selected image when product changes
    React.useEffect(() => {
        setSelectedImage(0);
    }, [product.id]);

    React.useEffect(() => {
        // Track GA4 view_item event
        trackViewItem({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categoryId ?? 'fishing',
        });

        // Reset review visibility when product changes
        setHasReviews(false);

        // Listen for Stamped to confirm reviews exist before showing the widget
        const onReviewsLoaded = () => {
            const count = document.querySelectorAll('#stamped-main-widget .stamped-review').length;
            if (count > 0) setHasReviews(true);
        };
        document.addEventListener('stamped:reviews:loaded', onReviewsLoaded);

        // Tell Stamped to re-scan the DOM for the new product's widget div
        if (typeof (window as any).StampedFn !== 'undefined') {
            (window as any).StampedFn.reloadUGC();
        }

        return () => {
            document.removeEventListener('stamped:reviews:loaded', onReviewsLoaded);
        };
    }, [product.id]);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            specs: product.specs
        });
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-6">
            <div className="max-w-[1920px] mx-auto">

                {/* Navigation */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to List
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left Column - Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <Lightbox
                            images={images}
                            initialIndex={selectedImage}
                            isOpen={lightboxOpen}
                            onClose={() => setLightboxOpen(false)}
                        />

                        <div
                            className="aspect-square bg-neutral-100 border border-black/10 relative overflow-hidden mb-4 cursor-zoom-in group"
                            onClick={() => setLightboxOpen(true)}
                        >
                            <img
                                key={selectedImage}
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-24 aspect-square border-2 transition-all flex-shrink-0 ${selectedImage === idx
                                            ? 'border-black'
                                            : 'border-transparent hover:border-black/20'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} view ${idx + 1}`}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Spec Tag */}
                        <div className="absolute top-6 left-6 pointer-events-none">
                            <span className="bg-white/90 backdrop-blur border border-black/10 px-3 py-1.5 font-mono text-[10px] uppercase font-medium tracking-wide">
                                {product.specs}
                            </span>
                        </div>
                    </motion.div>

                    {/* Right Column - Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col justify-center"
                    >
                        <span className="font-mono text-xs uppercase text-neutral-400 mb-4 block">/// PRODUCT_DETAIL</span>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-8 border-b border-black/10 pb-8">
                            <span className="text-3xl font-mono font-bold">${product.price}</span>
                            {/* Placeholder stock status */}
                            <span className="text-xs font-mono uppercase text-green-600 bg-green-50 px-2 py-1 rounded-sm border border-green-200">
                                In Stock / Ready to Ship
                            </span>
                        </div>

                        <p className="font-medium text-neutral-600 leading-relaxed max-w-lg mb-12">
                            {product.description}
                        </p>

                        <div className="space-y-6 max-w-md">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black text-white h-14 flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all uppercase font-bold text-sm tracking-widest"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add to Cart</span>
                            </button>

                            <div className="grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-neutral-400" />
                                    <span className="text-[10px] uppercase font-mono text-neutral-500">Secure<br />Checkout</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <Truck className="w-5 h-5 text-neutral-400" />
                                    <span className="text-[10px] uppercase font-mono text-neutral-500">Fast<br />Shipping</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <RotateCcw className="w-5 h-5 text-neutral-400" />
                                    <span className="text-[10px] uppercase font-mono text-neutral-500">30-Day<br />Returns</span>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>

                {hasReviews && (
                    <div className="mt-12 pt-8 border-t border-black/10">
                        <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Customer Reviews</h2>
                        <div
                            id="stamped-main-widget"
                            data-widget-type="standard"
                            data-product-id={product.id}
                            data-name={product.name}
                            data-url={`https://heyskipper.com/product/${product.id}`}
                            data-image-url={product.image}
                            data-description={product.description ?? ''}
                            data-product-sku={product.id}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
