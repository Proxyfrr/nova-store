import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle, MapPin, User, Phone, Mail, Calendar } from 'lucide-react';
import { apiClient } from '../api/client';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

export const OrderDetailPage = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Order detail error:", err);
        setError("Unable to locate order details.");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
        <RefreshCw size={28} className="spin" style={{ color: 'var(--accent-gold)' }} />
        <p style={{ marginTop: '1rem' }}>Retrieving order details from MongoDB...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem', textAlign: 'center' }} className="glass-panel">
        <AlertCircle size={36} style={{ color: '#ef4444', marginBottom: '1rem' }} />
        <h2>Order Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>{error}</p>
        <button onClick={onBack} className="btn-primary">
          <ArrowLeft size={16} /> Back to My Orders
        </button>
      </div>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button 
        onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} /> Back to My Orders
      </button>

      {/* Header Info */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="font-serif" style={{ fontSize: '2.2rem', color: '#fff' }}>
              Order {order.order_id}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem' }}>
            <Calendar size={14} /> Placed on {formattedDate}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Paid</p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            ${order.total.toFixed(2)}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        {/* Item List */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            Ordered Items ({order.items.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {order.items.map((item, idx) => (
              <div 
                key={idx} 
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'center',
                  paddingBottom: idx < order.items.length - 1 ? '1.25rem' : '0',
                  borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-color)' : 'none'
                }}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{ width: '70px', height: '80px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#131722' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.25rem' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  ${item.total_price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.925rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tax (10%)</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#fff', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--accent-gold)' }}>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Customer Details */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            Customer Info
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <User size={18} style={{ color: 'var(--accent-gold)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Name</p>
                <p style={{ color: '#fff', fontWeight: 600 }}>{order.customer_name}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Mail size={18} style={{ color: 'var(--accent-gold)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Email</p>
                <p style={{ color: '#fff', fontWeight: 600 }}>{order.customer_email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Phone size={18} style={{ color: 'var(--accent-gold)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Phone</p>
                <p style={{ color: '#fff', fontWeight: 600 }}>{order.customer_phone}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <MapPin size={18} style={{ color: 'var(--accent-gold)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Shipping Address</p>
                <p style={{ color: '#fff', fontWeight: 600, lineHeight: 1.5 }}>{order.customer_address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
