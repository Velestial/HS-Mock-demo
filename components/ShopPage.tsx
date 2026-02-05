import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Anchor, Filter, Crosshair, Wrench, Layers, ArrowUpDown, Circle, BookOpen, Package, Fish, TrendingUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products, Product } from '../data/products';

interface ShopPageProps {
    onBack: () => void;
    onProductSelect?: (product: Product) => void;
}

type ShopCategory = 'ALL' | 'RIGS' | 'LURES' | 'SINKERS' | 'TOOLS' | 'RODS' | 'BAITS' | 'BUNDLES' | 'EBOOKS';
type SortOption = 'default' | 'price-asc' | 'price-desc';

const categories: { id: ShopCategory; label: string; icon: any }[] = [
    { id: 'ALL', label: 'All Units', icon: Layers },
    { id: 'RIGS', label: 'Rigs', icon: Crosshair },
    { id: 'LURES', label: 'Lures', icon: Anchor },
    { id: 'SINKERS', label: 'Sinkers', icon: Circle },
    { id: 'TOOLS', label: 'Accessories', icon: Wrench },
    { id: 'RODS', label: 'Rods', icon: TrendingUp },
    { id: 'BAITS', label: 'Baits', icon: Fish },
    { id: 'BUNDLES', label: 'Bundles', icon: Package },
    { id: 'EBOOKS', label: 'Ebooks', icon: BookOpen },
];

const ShopPage: React.FC<ShopPageProps> = ({ onBack, onProductSelect }) => {
    const { addToCart } = useCart();
    const [activeCategory, setActiveCategory] = useState<ShopCategory>('ALL');
    const [sortBy, setSortBy] = useState<SortOption>('default');

    const filteredProducts = products.filter(p => {
        if (activeCategory === 'ALL') return true;

        // Map shop categories to product properties
        if (activeCategory === 'RIGS') return p.subCategory === 'RIGS' || (p.categoryId === 'tackle' && p.specs?.includes('Rig'));
        if (activeCategory === 'LURES') return p.subCategory === 'LURES';
        if (activeCategory === 'SINKERS') return p.subCategory === 'SINKERS';
        if (activeCategory === 'TOOLS') return p.subCategory === 'TOOLS';
        if (activeCategory === 'RODS') return p.categoryId === 'rod';
        if (activeCategory === 'BAITS') return p.categoryId === 'bait';
        if (activeCategory === 'BUNDLES') return p.categoryId === 'bundle';
        if (activeCategory === 'EBOOKS') return p.categoryId === 'ebook';

        return false;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            default:
                return 0;
        }
    });

    const handleAddToCart = (item: Product) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            specs: item.specs
        });
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-6">
            <div className="max-w-[1920px] mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 hover:text-black mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Base
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black">
                        <div>
                            <span className="font-mono text-xs uppercase text-neutral-500 block mb-2">/// FULL_INVENTORY</span>
                            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Shop<br />All</h1>
                        </div>
                        <div className="max-w-md">
                            <p className="font-mono text-xs md:text-sm text-neutral-600 uppercase leading-relaxed">
                                Complete inventory access. Rods, tackle, bait, and tactical resources.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Category Filter Tabs & Sorting */}
                <div className="mb-12 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-start md:items-center border-b border-neutral-200">
                    <div className="flex flex-wrap gap-4 md:gap-0">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`
                        flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative
                        ${isActive ? 'text-black bg-neutral-100' : 'text-neutral-500 hover:text-black hover:bg-neutral-50'}
                     `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Sorting Controls */}
                    <div className="relative group px-6 py-4 md:py-0">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer text-neutral-500 hover:text-black transition-colors">
                            <ArrowUpDown className="w-4 h-4" />
                            <span>Sort By</span>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                            <option value="default">Default</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>

                        {/* Visual label update based on selection */}
                        <div className="absolute top-full right-0 mt-2 bg-black text-white p-2 text-[10px] uppercase font-mono hidden group-hover:block whitespace-nowrap z-50">
                            Current: {sortBy === 'default' ? 'Default' :
                                sortBy === 'price-asc' ? 'Low to High' : 'High to Low'}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black border border-black"
                >
                    <AnimatePresence mode="popLayout">
                        {sortedProducts.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white p-8 group flex flex-col h-full hover:bg-neutral-50 transition-colors relative"
                            >
                                {/* Spec Tag */}
                                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                    <span className="font-mono text-[10px] text-neutral-400 uppercase border border-neutral-200 px-2 py-1 bg-white">
                                        {item.categoryId || item.subCategory || 'GEAR'}
                                    </span>
                                    {item.tag && (
                                        <span className="font-mono text-[10px] text-white uppercase border border-black px-2 py-1 bg-black">
                                            {item.tag.replace('_', ' ')}
                                        </span>
                                    )}
                                </div>

                                {/* Image */}
                                <div
                                    className="aspect-square mb-8 relative flex items-center justify-center p-4 cursor-pointer"
                                    onClick={() => onProductSelect && onProductSelect(item)}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-grow flex flex-col justify-between">
                                    <div className="mb-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3
                                                className="text-lg font-black uppercase tracking-tight leading-none cursor-pointer hover:text-neutral-600 transition-colors"
                                                onClick={() => onProductSelect && onProductSelect(item)}
                                            >
                                                {item.name}
                                            </h3>
                                            <span className="font-mono text-sm font-bold">${item.price}</span>
                                        </div>
                                        <span className="block font-mono text-[10px] text-neutral-500 uppercase mb-4">{item.specs}</span>
                                        <p className="text-xs text-neutral-600 font-medium uppercase leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full bg-white border border-black text-black h-10 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all uppercase font-bold text-[10px] tracking-widest"
                                    >
                                        <Plus className="w-3 h-3" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State if needed */}
                {sortedProducts.length === 0 && (
                    <div className="py-24 text-center border border-black border-t-0">
                        <Filter className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
                        <p className="font-mono text-sm uppercase text-neutral-500">No matching gear found.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ShopPage;
