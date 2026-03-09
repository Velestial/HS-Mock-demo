import React, { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, ShieldCheck, Lock, Truck, AlertCircle, MapPin } from 'lucide-react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { createOrder, createPaymentIntent, updateOrderStatus } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map center when coords change
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

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
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  // State to persist order details after cart is cleared
  const [confirmedOrder, setConfirmedOrder] = useState<{
    items: typeof items;
    total: number;
    shipping: number;
    tax: number;
    shippingAddress?: string;
  } | null>(null);

  const [mapCoords, setMapCoords] = useState<[number, number] | null>(null);

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
  });

  // Calculate costs
  // Calculate costs
  // Shipping Rule: Rods ($15) overrides Standard ($10). E-books are free ($0).
  const hasRod = items.some(item => item.category === 'rod');
  const hasStandardShipping = items.some(item => ['bait', 'tackle', 'bundle'].includes(item.category));
  const shippingCost = hasRod ? 15.00 : (hasStandardShipping ? 10.00 : 0);

  // Tax Rule: All items are tax-free as per new requirement.
  const taxAmount = 0;

  const finalTotal = cartTotal + taxAmount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    if (!turnstileToken) {
      setError("Please complete the security check.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setStep('processing');

    let createdOrderId: number | null = null;

    try {
      // 1. Create Order in WooCommerce (Pending)
      const orderData = {
        payment_method: "stripe",
        payment_method_title: "Credit Card (Stripe)",
        set_paid: false,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          address_2: formData.address2,
          city: formData.city,
          state: formData.state,
          postcode: formData.zip,
          country: formData.country === 'United States' ? 'US' : 'US', // Simplification for now
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          address_2: formData.address2,
          city: formData.city,
          state: formData.state,
          postcode: formData.zip,
          country: formData.country === 'United States' ? 'US' : 'US'
        },
        line_items: items.map(item => ({
          // Send product_id if available and numeric (WooCommerce needs primitive IDs often).
          // If our IDs are strings like 'bait-salted-clams', WC might not accept them as 'product_id' unless they match a real WC ID.
          // However, we stored the legitimate WC ID in the 'id' field during mapping if it came from WC.
          // Let's try to pass it. If it's a string that doesn't look numeric, we might send 0 or undefined to let it be a custom line item.
          product_id: !isNaN(Number(item.id)) ? Number(item.id) : 0,
          name: item.name,
          price: item.price.toString(),
          quantity: item.quantity
        })),
        shipping_lines: [
          {
            method_id: "flat_rate",
            method_title: shippingCost === 15 ? "Rod Shipping" : (shippingCost === 10 ? "Standard Shipping" : "Free Shipping"),
            total: shippingCost.toString()
          }
        ]
      };

      console.log("Creating order...", orderData);
      const order = await createOrder(orderData);
      createdOrderId = order.id;
      console.log("Order created:", order);

      // 2. Create Payment Intent
      console.log("Creating payment intent for amount:", finalTotal);
      const { clientSecret } = await createPaymentIntent(finalTotal, order.id);

      // 3. Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement as any,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
              line2: formData.address2,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zip,
              country: 'US', // Simplification
            }
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed');
      }

      if (result.paymentIntent?.status === 'succeeded') {
        // 4. Update Order Status
        console.log("Payment succeeded. Updating order...");
        await updateOrderStatus(order.id, 'processing', result.paymentIntent.id);

        // Save details for success page BEFORE clearing cart
        setConfirmedOrder({
          items: [...items],
          total: finalTotal,
          shipping: shippingCost,
          tax: taxAmount,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`
        });

        // Geocode the address for the map
        try {
          const query = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zip}`;
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
          const data = await response.json();
          if (data && data.length > 0) {
            setMapCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        } catch (geoError) {
          console.error("Geocoding failed:", geoError);
          // Fallback coords (e.g. center of US)
          setMapCoords([39.8283, -98.5795]);
        }

        setStep('success');
        clearCart();
      }

    } catch (err: any) {
      console.error("Checkout Error:", err);
      if (createdOrderId) {
        try {
          await updateOrderStatus(createdOrderId, 'cancelled');
        } catch (cancelErr) {
          console.error('Failed to cancel order:', cancelErr);
        }
      }
      // Extract specific error message from backend response if available
      const backendError = err.response?.data?.details || err.response?.data?.error || err.message;
      setError(typeof backendError === 'string' ? backendError : JSON.stringify(backendError) || "An unexpected error occurred. Please try again.");
      setStep('form');
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: "#000000",
        fontFamily: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#737373"
        }
      },
      invalid: {
        color: "#dc2626",
        iconColor: "#dc2626"
      }
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white border border-black shadow-2xl overflow-hidden relative">

          {/* Header */}
          <div className="bg-black text-white p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Order Confirmed</h2>
              <p className="font-mono text-sm text-neutral-400 uppercase">
                Reference: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
            {/* Abstract Pattern Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-black to-black"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Left Col: Details & Disclaimer */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-black/10">

              <div className="mb-8">
                <h3 className="font-bold uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Shipping Destination
                </h3>
                {/* Leaflet Map */}
                <div className="w-full h-48 bg-neutral-100 border border-black/10 relative overflow-hidden mb-4 z-0">
                  {mapCoords ? (
                    <MapContainer
                      center={mapCoords}
                      zoom={13}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                      className="z-0"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      />
                      <Marker position={mapCoords}>
                        <Popup>
                          Shipping Destination
                        </Popup>
                      </Marker>
                      <ChangeView center={mapCoords} />
                    </MapContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-500 font-mono text-xs">
                      Loading Map...
                    </div>
                  )}
                </div>
                <div className="font-mono text-xs text-neutral-600">
                  <p className="font-bold text-black">{formData.firstName} {formData.lastName}</p>
                  <p>{formData.address}</p>
                  {formData.address2 && <p>{formData.address2}</p>}
                  <p>{formData.city}, {formData.state} {formData.zip}</p>
                  <p>{formData.country}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4">
                <h4 className="font-bold uppercase text-[10px] tracking-widest text-amber-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Shipping Schedule
                </h4>
                <p className="text-[10px] uppercase font-mono leading-relaxed text-amber-900/80">
                  To ensure the best service, we ship orders <span className="font-bold">Tuesday through Thursday</span>.
                  Any orders placed between Friday and Monday will be processed and dispatched on the following Tuesday.
                </p>
              </div>

            </div>

            {/* Right Col: Order Items */}
            <div className="p-8 bg-neutral-50/50">
              <h3 className="font-bold uppercase text-xs tracking-widest mb-6">Order Summary</h3>

              <div className="space-y-4 mb-8">
                {confirmedOrder?.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-12 h-12 bg-white border border-black/10 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold uppercase text-[10px] w-[70%] leading-tight">{item.name}</h4>
                        <span className="font-mono text-[10px]">${item.price.toFixed(2)}</span>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-500 uppercase block mt-1">Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 font-mono text-[10px] uppercase border-t border-black/10 pt-4">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span>${(confirmedOrder?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span>{confirmedOrder?.shipping && confirmedOrder.shipping > 0 ? `$${confirmedOrder.shipping.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Taxes</span>
                  <span>${confirmedOrder?.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-black border-t border-black pt-3 mt-2">
                  <span>Total Paid</span>
                  <span>${confirmedOrder?.total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-neutral-100 border-t border-black/10 flex justify-center">
            <button
              onClick={onBack}
              className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
            >
              Return to Base <ArrowLeft className="w-3 h-3 rotate-180" />
            </button>
          </div>

        </div>
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

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
                <span className="text-xs font-mono uppercase text-neutral-500">Payments are secure and encrypted via Stripe.</span>
              </div>

              {/* Stripe (Credit Card) Fields */}
              <div className="grid gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-2">Credit Card Details</label>
                  <div className="w-full bg-neutral-50 border-b border-black/20 p-3">
                    <CardElement options={cardStyle} />
                  </div>
                </div>
              </div>

              {/* Turnstile Widget */}
              <div className="mt-8">
                <Turnstile
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                  onSuccess={setTurnstileToken}
                  onError={() => setTurnstileToken('')}
                  onExpire={() => setTurnstileToken('')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={step === 'processing' || !stripe}
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
                    {`Pay $${finalTotal.toFixed(2)}`}
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

              <div className="space-y-2 font-mono text-[10px] uppercase border-t border-black/10 pt-4">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Taxes</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-black border-t border-black pt-3 mt-2">
                  <span>Total Paid</span>
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