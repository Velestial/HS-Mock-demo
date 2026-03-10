// analytics — GA4 init and typed ecommerce event tracking (single integration point for all analytics)

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;

// initGA — injects gtag.js CDN script and initializes GA4 with page_view disabled (App.tsx fires manually)
export function initGA(): void {
  if (!GA_ID || typeof window === 'undefined') return;
  if (window.gtag) return; // already initialized — prevent double-inject on hot reload

  window.dataLayer = window.dataLayer || [];
  // Must be a regular function — not an arrow function — so `arguments` is the real Arguments object.
  // GA4 depends on the Arguments object; arrow functions capture a true Array which breaks GA4.
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });
}

// trackPageView — fires page_view event on every view/route change
export function trackPageView(path: string, title: string): void {
  if (!window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
}

// GA4Item — standard ecommerce item shape required by all GA4 ecommerce events
export interface GA4Item {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  quantity: number;
}

// trackViewItem — fires view_item when a customer opens a product detail page
export function trackViewItem(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}): void {
  if (!window.gtag) return;
  const item: GA4Item = {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category ?? '',
    price: product.price,
    quantity: 1,
  };
  window.gtag('event', 'view_item', {
    currency: 'USD',
    value: product.price,
    items: [item],
  });
}

// trackAddToCart — fires add_to_cart when a customer adds an item to their cart
export function trackAddToCart(item: {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}): void {
  if (!window.gtag) return;
  const ga4Item: GA4Item = {
    item_id: item.id,
    item_name: item.name,
    item_category: item.category,
    price: item.price,
    quantity: item.quantity,
  };
  window.gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: item.price * item.quantity,
    items: [ga4Item],
  });
}

// trackRemoveFromCart — fires remove_from_cart when a customer removes an item from their cart
export function trackRemoveFromCart(item: {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}): void {
  if (!window.gtag) return;
  const ga4Item: GA4Item = {
    item_id: item.id,
    item_name: item.name,
    item_category: item.category,
    price: item.price,
    quantity: item.quantity,
  };
  window.gtag('event', 'remove_from_cart', {
    currency: 'USD',
    value: item.price * item.quantity,
    items: [ga4Item],
  });
}

// trackBeginCheckout — fires begin_checkout when the customer opens the checkout page
export function trackBeginCheckout(items: GA4Item[], value: number): void {
  if (!window.gtag) return;
  window.gtag('event', 'begin_checkout', {
    currency: 'USD',
    value,
    items,
  });
}

// trackPurchase — fires purchase ONLY after paymentIntent.status === 'succeeded' — never before Stripe confirmation
export function trackPurchase(
  orderId: number,
  value: number,
  items: GA4Item[],
  shipping: number,
  tax: number
): void {
  if (!window.gtag) return;
  window.gtag('event', 'purchase', {
    transaction_id: String(orderId),
    value,
    currency: 'USD',
    shipping,
    tax,
    items,
  });
}
