import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface FinalChancePageProps {
    onNavigateHome: () => void;
    onProductClick: (product: any) => void;
}

const FinalChancePage: React.FC<FinalChancePageProps> = ({ onNavigateHome, onProductClick }) => {
    const { addToCart, setIsOpen } = useCart();

    const finalChanceProducts = products.filter(p => p.isFinalChance);

    return (
        <div className="pt-24 min-h-screen bg-neutral-50 font-sans">

            {/* Hero Section */}
            <div className="bg-black text-white py-16 px-6 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="max-w-[1920px] mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                            Final <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Chance</span>
                        </h1>
                        <p className="text-xl text-neutral-400 font-light max-w-2xl">
                            Last call for these legendary items. Once they're gone, they're gone for good.
                        </p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="inline-block border border-white/20 px-6 py-2">
                            <span className="font-mono text-xs tracking-widest text-red-500">LIMITED STOCK AVAILABLE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-[1920px] mx-auto px-6 pb-24">

                {finalChanceProducts.length === 0 ? (
                    <div className="text-center py-24 text-neutral-400">
                        <p className="text-2xl font-light">All final chance items have been sold out.</p>
                        <button
                            onClick={onNavigateHome}
                            className="mt-6 text-black underline underline-offset-4 hover:text-red-500 transition-colors"
                        >
                            Return Home
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {finalChanceProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                                onClick={() => onProductClick(product)}
                            >
                                {/* Image Container */}
                                <div className="relative aspect-square mb-6 bg-white overflow-hidden border border-neutral-200 group-hover:border-black transition-colors duration-300">
                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                        {product.tag && (
                                            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                                                {product.tag.replace('_', ' ')}
                                            </span>
                                        )}
                                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                                            LAST CHANCE
                                        </span>
                                    </div>

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                                    />

                                    {/* Quick Add Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm border-t border-black/10 flex justify-between items-center"
                                        onClick={(e) => e.stopPropagation()}>
                                        <span className="font-mono text-xs font-bold text-black">{product.price.toFixed(2)} USD</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(product);
                                                setIsOpen(true);
                                            }}
                                            className="bg-black text-white p-2 hover:bg-red-600 transition-colors"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-red-600 transition-colors leading-tight">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-neutral-500 font-medium line-clamp-2 h-10">
                                        {product.description}
                                    </p>
                                    <p className="font-mono text-xs text-neutral-400 pt-2 border-t border-neutral-100 mt-3">
                                        {product.specs}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinalChancePage;
