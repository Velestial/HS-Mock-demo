// useCheckoutSubmit — encapsulates the createOrder → createPaymentIntent → confirmPayment → updateOrderStatus flow
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { createOrder, createPaymentIntent, updateOrderStatus } from '../services/api';
import type { CartItem } from '../context/CartContext';

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
    const { formData, items, shippingCost, finalTotal, taxAmount } = opts;

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
        line_items: items.map(item => ({
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

      console.log("Creating payment intent for amount:", finalTotal);
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
        console.log("Payment succeeded. Updating order...");
        await updateOrderStatus(order.id, 'processing', result.paymentIntent.id);

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
      console.error("Checkout Error:", err);
      if (createdOrderId) {
        try { await updateOrderStatus(createdOrderId, 'cancelled'); }
        catch (cancelErr) { console.error('Failed to cancel order:', cancelErr); }
      }
      const backendError = err.response?.data?.details || err.response?.data?.error || err.message;
      opts.onError(typeof backendError === 'string' ? backendError : JSON.stringify(backendError) || "An unexpected error occurred. Please try again.");
    }
  };

  return { submit, stripe };
}
