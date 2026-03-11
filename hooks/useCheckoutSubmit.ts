// useCheckoutSubmit — encapsulates the createOrder → createPaymentIntent → confirmPayment → updateOrderStatus flow
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { createOrder, createPaymentIntent, updateOrderStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { CartItem } from '../context/CartContext';
import { trackPurchase } from '../utils/analytics';

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

interface SubmitOptions {
  items: CartItem[];
  cartTotal: number;
  shippingCost: number;
  taxAmount: number;
  finalTotal: number;
  formData: FormData;
  turnstileToken: string;
  onProcessing: () => void;
  onSuccess: (confirmedOrder: {
    items: CartItem[];
    total: number;
    shipping: number;
    tax: number;
    shippingAddress?: string;
  }, mapCoords: [number, number]) => void;
  onError: (message: string) => void;
}

export function useCheckoutSubmit() {
  const stripe = useStripe();
  const elements = useElements();
  const { getAccessToken } = useAuth();

  const submit = async (e: React.FormEvent, opts: SubmitOptions) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!opts.turnstileToken) {
      opts.onError("Please complete the security check.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    opts.onProcessing();

    let createdOrderId: number | null = null;
    const { formData, items, cartTotal, shippingCost, finalTotal, taxAmount } = opts;

    try {
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
          country: formData.country === 'United States' ? 'US' : 'US',
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
        line_items: items
          .filter(i => i.wcProductId)
          .map(i => ({ product_id: i.wcProductId, quantity: i.quantity })),
        fee_lines: items.filter(i => !i.wcProductId).length > 0 ? [{
          name: items.filter(i => !i.wcProductId).map(i => `${i.name} x${i.quantity}`).join(', '),
          total: items.filter(i => !i.wcProductId).reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2),
          tax_class: '',
          tax_status: 'none',
        }] : [],
        shipping_lines: [
          {
            method_id: "flat_rate",
            method_title: shippingCost === 15 ? "Rod Shipping" : (shippingCost === 10 ? "Standard Shipping" : "Free Shipping"),
            total: shippingCost.toString()
          }
        ]
      };

      const token = getAccessToken();
      const order = await createOrder(orderData, token);
      createdOrderId = order.id;

      const { clientSecret } = await createPaymentIntent(finalTotal, order.id);

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
              country: 'US',
            }
          },
        },
      });

      if (result.error) throw new Error(result.error.message || 'Payment failed');

      if (result.paymentIntent?.status === 'succeeded') {
        await updateOrderStatus(order.id, 'processing', result.paymentIntent.id, token);

        // Fire purchase event ONLY after Stripe confirmed + WC order updated
        const ga4Items = items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: item.quantity,
        }));
        trackPurchase(order.id, finalTotal, ga4Items, shippingCost, taxAmount);

        let coords: [number, number] = [39.8283, -98.5795];
        try {
          const query = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zip}`;
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
          const data = await response.json();
          if (data && data.length > 0) coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        } catch (geoError) {
          console.error("Geocoding failed:", geoError);
        }

        opts.onSuccess({
          items: [...items],
          total: finalTotal,
          shipping: shippingCost,
          tax: taxAmount,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`
        }, coords);
      }

    } catch (err: any) {
      if (createdOrderId) {
        try { await updateOrderStatus(createdOrderId, 'cancelled', undefined, getAccessToken()); }
        catch { /* best-effort cancel */ }
      }
      const d = err.response?.data;
      const backendError = (typeof d?.message === 'string' ? d.message : null)
        || (typeof d?.details === 'string' ? d.details : null)
        || err.message
        || 'An unexpected error occurred. Please try again.';
      opts.onError(backendError);
    }
  };

  return { submit, stripe };
}
