'use client';
import { useEffect, useState } from 'react';
import { formatUSD } from '@/lib/currency';
import Link from 'next/link';
import { toast } from 'sonner';
import { Package, ShoppingBag } from 'lucide-react';

type Order = {
  id: string;
  status: string;
  totalCents: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    unitCents: number;
    nameSnap: string;
    product: {
      slug: string;
      imageUrl: string;
    };
  }>;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId: string) => {
    setReordering(orderId);
    try {
      const res = await fetch('/api/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (res.ok) {
        const data = await res.json();
        const checkoutRes = await fetch('/api/checkout/hosted', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderId }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          toast.error('Failed to start checkout');
        }
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to reorder. Please try again.');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setReordering(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PAID: 'bg-green-100 text-green-800',
      FULFILLED: 'bg-blue-100 text-blue-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCELED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-8 w-48 bg-neutral-100 rounded animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4 animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-neutral-100 rounded" />
                <div className="h-3 w-24 bg-neutral-100 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-neutral-100 rounded" />
                <div className="h-5 w-16 bg-neutral-100 rounded" />
              </div>
            </div>
            <div className="h-16 bg-neutral-50 rounded" />
            <div className="h-10 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-4">
      <h1 className="mb-6 text-3xl font-bold">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
            <Package className="text-neutral-400" size={28} />
          </div>
          <p className="text-neutral-600">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <ShoppingBag size={16} />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-medium">Order #{order.id.slice(-8)}</p>
                  <p className="text-sm text-neutral-600">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatUSD(order.totalCents)}</p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.nameSnap}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.nameSnap}</p>
                      <p className="text-sm text-neutral-600">
                        Qty: {item.quantity} &times; {formatUSD(item.unitCents)}
                      </p>
                    </div>
                    <p className="font-medium text-sm">{formatUSD(item.unitCents * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleReorder(order.id)}
                disabled={reordering === order.id}
                className="w-full rounded-lg bg-black px-4 py-2.5 text-white text-sm font-medium disabled:opacity-50 hover:bg-neutral-800 transition-colors"
              >
                {reordering === order.id ? 'Processing...' : 'Reorder'}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
