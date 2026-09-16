import React, { useState, useEffect } from 'react';
import { PackageCheck, ChevronRight, RefreshCw, AlertCircle, ShoppingBag } from 'lucide-react';
import { apiClient } from '../api/client';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

export const OrdersPage = ({ onOpenOrderDetail, onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to retrieve order history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
        <RefreshCw size={28} className="spin" style={{ color: 'var(--accent-gold)' }} />
        <p style={{ marginTop: '1rem' }}>Loading your order history from MongoDB...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: '75vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '0.25rem' }}>My Orders</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View and track your recent apparel orders and delivery statuses.</p>
        </div>
        <button onClick={fetchOrders} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#fca5a5' }}>
          <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
          <p>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <PackageCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>No orders found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You have not placed any orders yet.
          </p>
          <button onClick={() => onNavigate('/products')} className="btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => {
            const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={order.id}
                className="glass-panel"
                onClick={() => onOpenOrderDetail(order.id)}
                style={{
                  padding: '1.5rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                        {order.order_id}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Ordered on {formattedDate} • {order.items.length} items
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
