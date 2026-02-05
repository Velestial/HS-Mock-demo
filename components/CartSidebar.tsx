import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ onCheckout }) => {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  const handleCheckoutClick = () => {
    setIsOpen(false);
    onCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-[70] border-l border-black shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-black bg-white z-10">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">/// SYSTEM_CART</span>
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  Your Gear <span className="text-neutral-400 font-mono text-lg ml-2">[{items.length}]</span>
                </h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-black hover:text-white transition-colors rounded-sm"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-6 bg-neutral-50 relative">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-24 h-24 border border-black flex items-center justify-center mb-6 rotate-45">
                    <div className="w-16 h-16 border border-black rotate-90"></div>
                  </div>
                  <p className="font-mono text-xs uppercase tracking-widest">Cart_Empty</p>
                  <p className="text-2xl font-black uppercase mt-2">No Equipment<br/>Selected</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="bg-white border border-black/10 p-4 flex gap-4 relative group"
                    >
                      {/* Image */}
                      <div className="w-24 h-24 bg-neutral-100 flex-shrink-0 border border-neutral-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>

                      {/* Details */}
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold uppercase text-sm leading-tight">{item.name}</h3>
                            {item.specs && <span className="font-mono text-[10px] text-neutral-500 uppercase">{item.specs}</span>}
                          </div>
                          <span className="font-mono text-sm font-bold">${item.price}</span>
                        </div>

                        <div className="flex justify-between items-end">
                          {/* Qty Control */}
                          <div className="flex items-center border border-black/20">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="p-1 hover:bg-black hover:text-white transition-colors disabled:opacity-30"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-black hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] font-mono uppercase text-neutral-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-black bg-white space-y-4">
                <div className="space-y-2 font-mono text-xs uppercase">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Shipping</span>
                    <span>Calculated Next Step</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-black border-t border-black/10 pt-2 mt-2">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckoutClick}
                  className="w-full bg-black text-white h-14 flex items-center justify-between px-6 hover:bg-neutral-800 transition-colors group relative overflow-hidden"
                >
                  <span className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Checkout
                  </span>
                  <span className="flex items-center gap-2 font-mono text-xs group-hover:translate-x-1 transition-transform">
                    SECURE_PAYMENT <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
