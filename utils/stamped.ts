// stamped — loads the Stamped.io CDN script and initializes the widget SDK once on app mount.

export function initStamped(): void {
  const apiKey = import.meta.env.VITE_STAMPED_API_KEY as string | undefined;
  const sId = import.meta.env.VITE_STAMPED_STORE_HASH as string | undefined;

  // Skip if env vars not configured (dev without Stamped account)
  if (!apiKey || !sId) return;

  // Guard: skip if script already injected (prevents double-init on hot reload)
  if (document.querySelector('script[src*="stamped.io/files/widget.min.js"]')) return;

  const script = document.createElement('script');
  script.src = 'https://cdn1.stamped.io/files/widget.min.js';
  script.type = 'text/javascript';
  script.async = true;
  script.onload = () => {
    if (typeof (window as any).StampedFn !== 'undefined') {
      (window as any).StampedFn.init({ apiKey, sId });
    }
  };
  document.head.appendChild(script);
}
