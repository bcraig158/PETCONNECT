// src/app/orders/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { formatUSD } from '@/lib/currency';
import Link from 'next/link';

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
    } catch (error) {
      console.error('Failed to fetch orders:', error);
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
        // Create hosted checkout session for the reorder
        const checkoutRes = await fetch('/api/checkout/hosted', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderId }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          alert('Failed to start checkout');
        }
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to reorder. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-600 mb-4">You haven't placed any orders yet.</p>
          <Link href="/products" className="text-black underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-medium">Order #{order.id.slice(-8)}</p>
                  <p className="text-sm text-neutral-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatUSD(order.totalCents)}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded text-xs ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden">
                      <img
                        src={item.product.imageUrl}
                        alt={item.nameSnap}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.nameSnap}</p>
                      <p className="text-sm text-neutral-600">
                        Quantity: {item.quantity} × {formatUSD(item.unitCents)}
                      </p>
                    </div>
                    <p className="font-medium">{formatUSD(item.unitCents * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleReorder(order.id)}
                disabled={reordering === order.id}
                className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
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

