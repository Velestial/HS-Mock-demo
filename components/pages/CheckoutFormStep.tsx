// CheckoutFormStep — checkout form UI with contact, shipping, payment fields, Turnstile widget, and order summary sidebar
import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { ArrowLeft, ShieldCheck, Lock, Truck, AlertCircle } from 'lucide-react';
import { useStripe, CardElement } from '@stripe/react-stripe-js';
import type { CartItem } from '../../context/CartContext';

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const CARD_STYLE = { style: { base: { color:"#000000", fontFamily:'"Inter", ui-sans-serif, system-ui, sans-serif', fontSmoothing:"antialiased", fontSize:"16px", "::placeholder":{ color:"#737373" } }, invalid:{ color:"#dc2626", iconColor:"#dc2626" } } };

interface FormData { email:string; phone:string; firstName:string; lastName:string; address:string; address2:string; city:string; state:string; country:string; zip:string; }
interface CheckoutFormStepProps {
  formData: FormData; handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  step: 'form' | 'processing' | 'success'; error: string | null; onSubmit: (e: React.FormEvent) => void;
  shippingCost: number; taxAmount: number; finalTotal: number; cartTotal: number; items: CartItem[];
  turnstileToken: string; setTurnstileToken: (token: string) => void; onBack: () => void;
}

const inp = "w-full bg-neutral-50 border-b border-black/20 p-3 outline-none focus:border-black transition-colors";

const CheckoutFormStep: React.FC<CheckoutFormStepProps> = ({
  formData, handleInputChange, step, error, onSubmit,
  shippingCost, taxAmount, finalTotal, cartTotal, items,
  turnstileToken, setTurnstileToken, onBack,
}) => {
  const stripe = useStripe();
  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6">
      {/* Mobile order total bar — visible only below lg */}
      <div className="lg:hidden max-w-7xl mx-auto mb-6 bg-white border border-black p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase text-neutral-500">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs uppercase">
          <span className="text-neutral-500">Shipping {shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}</span>
          <span className="font-bold text-black text-sm">Total ${finalTotal.toFixed(2)}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Shop
          </button>
          <form onSubmit={onSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /><p className="text-sm">{error}</p>
              </div>
            )}
            {/* Contact */}
            <div className="bg-white p-8 border border-black/10 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs font-mono">1</span>
                Contact Info
              </h3>
              <div className="grid gap-6">
                <div>
                  <label htmlFor="checkout-email" className="block text-xs font-mono uppercase text-neutral-500 mb-1">Email Address</label>
                  <input id="checkout-email" required type="email" name="email" value={formData.email} onChange={handleInputChange} className={`${inp} font-medium`} placeholder="operator@example.com" />
                </div>
              </div>
            </div>
            {/* Shipping */}
            <div className="bg-white p-8 border border-black/10 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs font-mono">2</span>
                Shipping Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label htmlFor="checkout-country" className="block text-xs font-mono uppercase text-neutral-500 mb-1">Country / Region</label>
                  <select id="checkout-country" required name="country" value={formData.country} onChange={handleInputChange} className={`${inp} appearance-none cursor-pointer`}>
                    {["United States","Canada","United Kingdom","Australia","Germany","Japan","New Zealand","Singapore","Philippines"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="checkout-firstName" className="block text-xs font-mono uppercase text-neutral-500 mb-1">First Name</label>
                  <input id="checkout-firstName" required name="firstName" value={formData.firstName} onChange={handleInputChange} className={inp} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="checkout-lastName" className="block text-xs font-mono uppercase text-neutral-500 mb-1">Last Name</label>
                  <input id="checkout-lastName" required name="lastName" value={formData.lastName} onChange={handleInputChange} className={inp} />
                </div>
                <div className="col-span-2">
                  <label htmlFor="checkout-address" className="block text-xs font-mono uppercase text-neutral-500 mb-1">Address</label>
                  <input id="checkout-address" required name="address" value={formData.address} onChange={handleInputChange} className={inp} placeholder="Street Address" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="checkout-address2" className="block text-xs font-mono uppercase text-neutral-500 mb-1">Apartment, suite, etc. (optional)</label>
                  <input id="checkout-address2" name="address2" value={formData.address2} onChange={handleInputChange} className={inp} placeholder="Unit 101" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="checkout-city" className="block text-xs font-mono uppercase text-neutral-500 mb-1">City</label>
                  <input id="checkout-city" required name="city" value={formData.city} onChange={handleInputChange} className={inp} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="checkout-state" className="block text-xs font-mono uppercase text-neutral-500 mb-1">{formData.country === 'United States' ? 'State' : 'Province / State'}</label>
                  {formData.country === 'United States' ? (
                    <select id="checkout-state" required name="state" value={formData.state} onChange={handleInputChange} className={`${inp} appearance-none cursor-pointer`}>
                      <option value="" disabled>Select State</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input id="checkout-state" required name="state" value={formData.state} onChange={handleInputChange} className={inp} />
                  )}
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="checkout-zip" className="block text-xs font-mono uppercase text-neutral-500 mb-1">Postal Code</label>
                  <input id="checkout-zip" required name="zip" value={formData.zip} onChange={handleInputChange} className={inp} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="checkout-phone" className="block text-xs font-mono uppercase text-neutral-500 mb-1">Phone Number</label>
                  <input id="checkout-phone" required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inp} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>
            {/* Payment */}
            <div className="bg-white p-8 border border-black/10 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs font-mono">3</span>
                Payment
              </h3>
              <div className="mb-6 p-4 bg-neutral-50 border border-black/5 flex items-center gap-3">
                <Lock className="w-4 h-4 text-green-600" />
                <span className="text-xs font-mono uppercase text-neutral-500">Payments are secure and encrypted via Stripe.</span>
              </div>
              <div className="grid gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <p className="block text-xs font-mono uppercase text-neutral-500 mb-2">Credit Card Details</p>
                  <div className="w-full bg-neutral-50 border-b border-black/20 p-3">
                    <CardElement options={CARD_STYLE} />
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} onSuccess={setTurnstileToken} onError={() => setTurnstileToken('')} onExpire={() => setTurnstileToken('')} />
              </div>
            </div>
            <button type="submit" disabled={step === 'processing' || !stripe}
              className="w-full bg-black text-white h-16 flex items-center justify-between px-8 hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed group">
              {step === 'processing' ? (
                <div className="flex items-center gap-4 mx-auto">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="font-bold uppercase tracking-widest">Processing Securely...</span>
                </div>
              ) : (
                <>
                  <span className="font-bold uppercase tracking-widest text-sm">{`Pay $${finalTotal.toFixed(2)}`}</span>
                  <div className="flex items-center gap-2 font-mono text-xs group-hover:translate-x-1 transition-transform">
                    SECURE_CHECKOUT <ShieldCheck className="w-4 h-4" />
                  </div>
                </>
              )}
            </button>
          </form>
        </div>
        {/* Order Summary sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-32">
            <div className="bg-white p-8 border border-black shadow-lg">
              <h3 className="font-black uppercase tracking-widest text-sm mb-6 pb-4 border-b border-black">Order Summary</h3>
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 flex-shrink-0">
                      <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold uppercase text-xs w-[70%]">{item.name}</h4>
                        <span className="font-mono text-xs">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <span className="font-mono text-xs text-neutral-500 uppercase block mt-1">Qty: {item.quantity}</span>
                      {item.specs && <span className="font-mono text-[10px] text-neutral-400 uppercase block">{item.specs}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 font-mono text-xs uppercase border-t border-black/10 pt-4">
                <div className="flex justify-between text-neutral-500"><span>Subtotal</span><span className="tabular-nums">${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-neutral-500"><span>Shipping</span><span className="tabular-nums">{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}</span></div>
                <div className="flex justify-between text-neutral-500"><span>Taxes</span><span className="tabular-nums">${taxAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm font-bold text-black border-t border-black pt-3 mt-2"><span>Total Paid</span><span className="tabular-nums">${finalTotal.toFixed(2)}</span></div>
              </div>
              <div className="mt-8 flex items-start gap-3 bg-neutral-50 p-4 border border-black/5">
                <Truck className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <p className="text-xs font-mono text-neutral-500 uppercase leading-relaxed">Orders placed before 2PM EST ship same day. All rods ship in reinforced protective tubes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFormStep;
