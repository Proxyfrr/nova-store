import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, CheckCircle2, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { apiClient } from '../api/client';

export const CheckoutPage = ({ onNavigate, onShowToast }) => {
  const { user } = useAuth();
  const { cart, clearCart, subtotal, tax, total } = useCart();

  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    customer_address: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.name || prev.customer_name,
        customer_email: user.email || prev.customer_email
      }));
    }
  }, [user]);

  if (cart.length === 0 && !completedOrder) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem', textAlign: 'center' }} className="glass-panel">
        <h2>Your Bag is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <button onClick={() => onNavigate('/products')} className="btn-primary">
          Browse Catalog
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.customer_phone || !formData.customer_address) {
      setError("Please complete all shipping details.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Build order items array with ONLY product_id and quantity
      // (Backend calculates prices & stock directly from MongoDB!)
      const itemsPayload = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const payload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
        items: itemsPayload
      };

      const res = await apiClient.post('/orders', payload);
      const newOrder = res.data;
      
      clearCart();
      setCompletedOrder(newOrder);
      if (onShowToast) onShowToast(`Order ${newOrder.order_id} placed successfully!`);
    } catch (err) {
      console.error("Order error:", err);
      const detail = err.response?.data?.detail || "Failed to process order. Please try again.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '4rem 2.5rem', textAlign: 'center' }} className="glass-panel">
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle2 size={40} />
        </div>
        <span className="badge-gold" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          CONFIRMED ORDER
        </span>
        <h1 className="font-serif" style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '0.5rem' }}>
          Thank You For Your Order
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
          Order reference: <strong style={{ color: 'var(--accent-gold)' }}>{completedOrder.order_id}</strong>
        </p>

        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'left',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
            <span style={{ fontWeight: 600 }}>{completedOrder.customer_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Shipping Address:</span>
            <span style={{ fontWeight: 600 }}>{completedOrder.customer_address}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Paid:</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>${completedOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => onNavigate('/orders')} className="btn-primary">
            View My Orders
          </button>
          <button onClick={() => onNavigate('/products')} className="btn-secondary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button 
        onClick={() => onNavigate('/cart')} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} /> Return to Bag
      </button>

      <h1 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '2rem' }}>
        Checkout & Delivery
      </h1>

      {error && (
        <div className="glass-panel" style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '3rem', alignItems: 'start' }}>
        {/* Shipping Form */}
        <form onSubmit={handleSubmitOrder} className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            1. Shipping Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                placeholder="e.g. Alex Mercer"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                required
                placeholder="alex@example.com"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              required
              placeholder="+1 (555) 019-2834"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Delivery Street Address *
            </label>
            <textarea
              name="customer_address"
              value={formData.customer_address}
              onChange={handleChange}
              required
              rows={3}
              placeholder="742 Evergreen Terrace, Suite 4B, New York, NY 10001"
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1rem' }}>
              2. Payment Method
            </h2>
            <div style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid var(--accent-gold-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Lock size={20} style={{ color: 'var(--accent-gold)' }} />
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Express Order Verification</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Backend MongoDB order verification handles payment tokenization securely.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', padding: '1.1rem', fontSize: '1.05rem', marginTop: '1rem' }}
          >
            {submitting ? (
              <>
                <RefreshCw size={20} className="spin" /> Processing Order...
              </>
            ) : (
              <>
                <Lock size={18} /> Confirm & Place Order (${total.toFixed(2)})
              </>
            )}
          </button>
        </form>

        {/* Order Items Review Side Bar */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            Items in Order ({cart.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{ width: '56px', height: '64px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{item.name}</p>
                  <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#fff', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent-gold)' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
