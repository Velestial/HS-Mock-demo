import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, ShieldCheck, Lock, MapPin, Truck, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckoutPageProps {
  onBack: () => void;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack }) => {
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    country: 'United States',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // Calculate costs
  const shippingCost = items.some(item => item.id === 'travel-rod-92') ? 15.00 : 0;
  const taxAmount = cartTotal * 0.07;
  const finalTotal = cartTotal + taxAmount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      clearCart();
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mb-8">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Order Confirmed</h2>
        <p className="font-mono text-sm text-neutral-500 mb-8 uppercase">
          Reference: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
        <p className="max-w-md text-neutral-600 mb-12 leading-relaxed">
          Thank you for your purchase. A confirmation email has been sent to <span className="font-bold text-black">{formData.email}</span> with your tracking details.
        </p>
        <button 
          onClick={onBack}
          className="border border-black px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
        >
          Return to Base
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-7">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Shop
          </button>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Contact */}
            <div className="bg-white p-8 border border-black/10 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-mono">1</span>
                Contact Info
              </h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors font-medium"
                    placeholder="operator@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white p-8 border border-black/10 shadow-sm">
               <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-mono">2</span>
                Shipping Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">Country / Region</label>
                  <select
                    required
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Philippines">Philippines</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">First Name</label>
                  <input 
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">Last Name</label>
                  <input 
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">Address</label>
                  <input 
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors"
                    placeholder="Street Address"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">Apartment, suite, etc. (optional)</label>
                  <input 
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors"
                    placeholder="Unit 101"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                   <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">City</label>
                   <input 
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors"
                   />
                </div>
                <div className="col-span-2 md:col-span-1">
                   <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                     {formData.country === 'United States' ? 'State' : 'Province / State'}
                   </label>
                   {formData.country === 'United States' ? (
                     <select
                        required
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                     >
                       <option value="" disabled>Select State</option>
                       {US_STATES.map(state => (
                         <option key={state} value={state}>{state}</option>
                       ))}
                     </select>
                   ) : (
                     <input 
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors"
                     />
                   )}
                </div>
                <div className="col-span-2 md:col-span-1">
                   <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">Postal Code</label>
                   <input 
                    required
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors"
                   />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white p-8 border border-black/10 shadow-sm">
               <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-mono">3</span>
                Payment
              </h3>
              
              <div className="mb-6 p-4 bg-neutral-50 border border-black/5 rounded-sm flex items-center gap-3">
                 <Lock className="w-4 h-4 text-green-600" />
                 <span className="text-xs font-mono uppercase text-neutral-500">Payments are secure and encrypted.</span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 border text-center flex flex-col items-center gap-2 transition-all ${paymentMethod === 'stripe' ? 'border-black bg-black text-white' : 'border-black/20 hover:border-black text-neutral-500 hover:text-black'}`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider">Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 border text-center flex flex-col items-center gap-2 transition-all ${paymentMethod === 'paypal' ? 'border-black bg-black text-white' : 'border-black/20 hover:border-black text-neutral-500 hover:text-black'}`}
                >
                   <span className="w-6 h-6 font-bold italic serif">P</span>
                  <span className="text-xs font-bold uppercase tracking-wider">PayPal</span>
                </button>
              </div>

              {/* Stripe (Credit Card) Fields */}
              {paymentMethod === 'stripe' && (
                <div className="grid gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                   <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">Card Number</label>
                      <div className="relative">
                        <input 
                          required={paymentMethod === 'stripe'}
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors pl-10 font-mono"
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                          <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">Expiry Date</label>
                          <input 
                              required={paymentMethod === 'stripe'}
                              name="expiry"
                              placeholder="MM / YY"
                              value={formData.expiry}
                              onChange={handleInputChange}
                              className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors font-mono"
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">CVC</label>
                          <input 
                              required={paymentMethod === 'stripe'}
                              name="cvc"
                              placeholder="123"
                              value={formData.cvc}
                              onChange={handleInputChange}
                              className="w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors font-mono"
                          />
                      </div>
                   </div>
                </div>
              )}

              {/* PayPal Message */}
              {paymentMethod === 'paypal' && (
                <div className="bg-neutral-100 p-6 text-center animate-in fade-in slide-in-from-top-4 duration-300">
                  <p className="text-sm font-medium text-neutral-600 mb-2">You will be redirected to PayPal to securely complete your payment.</p>
                </div>
              )}
            </div>

            <button 
                type="submit"
                disabled={step === 'processing'}
                className="w-full bg-black text-white h-16 flex items-center justify-between px-8 hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
                {step === 'processing' ? (
                     <div className="flex items-center gap-4 mx-auto">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="font-bold uppercase tracking-widest">Processing Securely...</span>
                     </div>
                ) : (
                    <>
                        <span className="font-bold uppercase tracking-widest text-sm">
                            {paymentMethod === 'paypal' ? 'Proceed to PayPal' : `Pay $${finalTotal.toFixed(2)}`}
                        </span>
                        <div className="flex items-center gap-2 font-mono text-xs group-hover:translate-x-1 transition-transform">
                            SECURE_CHECKOUT <ShieldCheck className="w-4 h-4" />
                        </div>
                    </>
                )}
            </button>

          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
            <div className="sticky top-32">
                <div className="bg-white p-8 border border-black shadow-lg">
                    <h3 className="font-black uppercase tracking-widest text-sm mb-6 pb-4 border-b border-black">Order Summary</h3>
                    
                    <div className="space-y-4 mb-8">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold uppercase text-xs w-[70%]">{item.name}</h4>
                                        <span className="font-mono text-xs">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <span className="font-mono text-[10px] text-neutral-500 uppercase block mt-1">Qty: {item.quantity}</span>
                                    {item.specs && <span className="font-mono text-[10px] text-neutral-400 uppercase block">{item.specs}</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 font-mono text-xs uppercase border-t border-black/10 pt-6">
                        <div className="flex justify-between text-neutral-500">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                            <span>Shipping</span>
                            <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}</span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                            <span>Taxes (Est.)</span>
                            <span>${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-black border-t border-black pt-4 mt-2">
                            <span>Total</span>
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex items-start gap-3 bg-neutral-50 p-4 border border-black/5">
                        <Truck className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                        <p className="text-[10px] font-mono text-neutral-500 uppercase leading-relaxed">
                            Orders placed before 2PM EST ship same day. All rods ship in reinforced protective tubes.
                        </p>
                    </div>

                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;