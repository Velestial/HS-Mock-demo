// CheckoutSuccessStep — order confirmation screen showing Leaflet map of shipping destination, address, and order summary
import React from 'react';
import { ArrowLeft, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { CartItem } from '../../context/CartContext';

// Fix for default marker icon in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ChangeView — updates map center when coords change
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

interface FormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface ConfirmedOrder {
  items: CartItem[];
  total: number;
  shipping: number;
  tax: number;
  shippingAddress?: string;
}

interface CheckoutSuccessStepProps {
  confirmedOrder: ConfirmedOrder;
  mapCoords: [number, number] | null;
  formData: FormData;
  onBack: () => void;
}

const CheckoutSuccessStep: React.FC<CheckoutSuccessStepProps> = ({
  confirmedOrder,
  mapCoords,
  formData,
  onBack,
}) => {
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
              {confirmedOrder.items.map((item) => (
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
                <span>${(confirmedOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span>{confirmedOrder.shipping > 0 ? `$${confirmedOrder.shipping.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Taxes</span>
                <span>${confirmedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-black border-t border-black pt-3 mt-2">
                <span>Total Paid</span>
                <span>${confirmedOrder.total.toFixed(2)}</span>
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
};

export default CheckoutSuccessStep;
