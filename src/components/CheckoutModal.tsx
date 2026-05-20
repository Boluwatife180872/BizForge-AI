'use client';

import { useState } from 'react';
import { ShoppingCart, Check, X, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  productId: string;
  productTitle: string;
  price: number;
  businessName: string;
  brandColor: string;
  onClose: () => void;
}

export default function CheckoutModal({
  productId,
  productTitle,
  price,
  businessName,
  brandColor,
  onClose,
}: CheckoutModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email, name }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Checkout failed');

      setReference(data.reference);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-sm bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="h-0.5 w-full" style={{ backgroundColor: brandColor }} />

        {!success ? (
          <form onSubmit={handleCheckout} className="p-5 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-medium">Checkout</h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Simulated payment via Paystack</p>
            </div>

            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{productTitle}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{businessName}</p>
              </div>
              <span className="text-base font-semibold">${price.toFixed(2)}</span>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-[var(--input)] border border-[var(--input-border)] focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--ring)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none transition-all"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-[var(--input)] border border-[var(--input-border)] focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--ring)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none transition-all"
              />
            </div>

            {error && (
              <p className="text-xs text-[var(--error)] bg-[var(--error-bg)] border border-[var(--error)]/20 p-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email.includes('@')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-40 disabled:pointer-events-none hover:opacity-90"
              style={{ backgroundColor: brandColor }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Pay ${price.toFixed(2)}
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--success-bg)] flex items-center justify-center">
              <Check className="w-6 h-6 text-[var(--success)]" />
            </div>
            <h3 className="text-base font-medium">Payment complete</h3>
            <p className="text-xs text-[var(--muted)]">
              Reference: <span className="font-mono font-medium text-[var(--foreground)]">{reference}</span>
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Confirmation sent to <span className="text-[var(--foreground)]">{email}</span>
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-xl bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--foreground)] text-sm font-medium transition-colors border border-[var(--border)]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
