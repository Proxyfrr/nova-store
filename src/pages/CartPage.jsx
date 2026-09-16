import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, tax, total } = useCart();

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '4rem 2rem', textAlign: 'center' }} className="glass-panel">
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--accent-gold)'
        }}>
          <ShoppingBag size={32} />
        </div>
        <h2 className="font-serif" style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.75rem' }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Explore our minimalist clothing catalog and add curated items to your bag.
        </p>
        <button onClick={() => onNavigate('/products')} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
          Explore Catalog <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#fff' }}>Shopping Bag</h1>
        <button 
          onClick={clearCart} 
          style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Trash2 size={16} /> Clear Bag
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
        {/* Cart Item List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.map((item) => (
            <div 
              key={item.id} 
              className="glass-panel"
              style={{
                display: 'flex',
                gap: '1.5rem',
                padding: '1.5rem',
                alignItems: 'center'
              }}
            >
              {/* Product Thumbnail */}
              <img 
                src={item.image} 
                alt={item.name}
                style={{
                  width: '100px',
                  height: '110px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#131722'
                }}
              />

              {/* Title & Details */}
              <div style={{ flex: 1 }}>
                <span className="badge-gold" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  {item.category}
                </span>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: '0.4rem 0 0.25rem' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Unit Price: ${item.price.toFixed(2)}
                </p>

                {/* Stock limit info */}
                {item.quantity >= item.stock && (
                  <p style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.25rem' }}>
                    Maximum available stock reached ({item.stock})
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                  style={{ padding: '0.5rem 0.75rem', color: item.quantity <= 1 ? 'var(--text-muted)' : '#fff' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 0.75rem', fontWeight: 700, fontSize: '0.95rem' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                  disabled={item.quantity >= item.stock}
                  style={{ padding: '0.5rem 0.75rem', opacity: item.quantity >= item.stock ? 0.3 : 1 }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Total Item Price */}
              <div style={{ minWidth: '100px', textAlign: 'right' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove button */}
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ color: 'var(--text-muted)', padding: '6px', hover: { color: '#ef4444' } }}
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button 
            onClick={() => onNavigate('/products')} 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginTop: '1rem', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Continue Shopping
          </button>
        </div>

        {/* Order Summary Card */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Estimated Tax (10%)</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span style={{ fontWeight: 700, color: '#34d399' }}>COMPLIMENTARY</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '1.3rem',
              fontWeight: 800
            }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent-gold)' }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/checkout')}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', justifyContent: 'center' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-gold)' }} />
            <span>Encrypted SSL 256-Bit Order Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};
