// CheckoutPage — thin orchestrator holding checkout state and delegating step rendering to CheckoutFormStep and CheckoutSuccessStep
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../context/CartContext';
import { trackBeginCheckout } from '../../utils/analytics';
import { useCheckoutSubmit } from '../../hooks/useCheckoutSubmit';
import CheckoutFormStep from './CheckoutFormStep';
import CheckoutSuccessStep from './CheckoutSuccessStep';

interface CheckoutPageProps {
  onBack: () => void;
}

interface ConfirmedOrder {
  items: CartItem[];
  total: number;
  shipping: number;
  tax: number;
  shippingAddress?: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack }) => {
  const { items, cartTotal, clearCart } = useCart();
  const { submit } = useCheckoutSubmit();

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [mapCoords, setMapCoords] = useState<[number, number] | null>(null);

  const [formData, setFormData] = useState({
    email: '', phone: '', firstName: '', lastName: '',
    address: '', address2: '', city: '', state: '',
    country: 'United States', zip: '',
  });

  // Fire begin_checkout once when checkout page mounts
  useEffect(() => {
    const ga4Items = items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    }));
    trackBeginCheckout(ga4Items, cartTotal);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Shipping Rule: Rods ($15) overrides Standard ($10). E-books are free ($0).
  const hasRod = items.some(item => item.category === 'rod');
  const hasStandardShipping = items.some(item => ['bait', 'tackle', 'bundle'].includes(item.category));
  const shippingCost = hasRod ? 15.00 : (hasStandardShipping ? 10.00 : 0);
  const taxAmount = 0;
  const finalTotal = cartTotal + taxAmount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    setError(null);
    submit(e, {
      items, cartTotal, shippingCost, taxAmount, finalTotal,
      formData, turnstileToken,
      onProcessing: () => setStep('processing'),
      onSuccess: (order, coords) => {
        setConfirmedOrder(order);
        setMapCoords(coords);
        setStep('success');
        clearCart();
      },
      onError: (msg) => { setError(msg); setStep('form'); },
    });
  };

  if (step === 'success' && confirmedOrder) {
    return (
      <CheckoutSuccessStep
        confirmedOrder={confirmedOrder}
        mapCoords={mapCoords}
        formData={formData}
        onBack={onBack}
      />
    );
  }

  return (
    <CheckoutFormStep
      formData={formData}
      handleInputChange={handleInputChange}
      step={step}
      error={error}
      onSubmit={handleSubmit}
      shippingCost={shippingCost}
      taxAmount={taxAmount}
      finalTotal={finalTotal}
      cartTotal={cartTotal}
      items={items}
      turnstileToken={turnstileToken}
      setTurnstileToken={setTurnstileToken}
      onBack={onBack}
    />
  );
};

export default CheckoutPage;
