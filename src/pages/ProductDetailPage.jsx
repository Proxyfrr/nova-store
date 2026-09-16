import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, AlertCircle, Plus, Minus } from 'lucide-react';
import { apiClient } from '../api/client';
import { useCart } from '../context/CartContext';

export const ProductDetailPage = ({ productId, onBack, onShowToast, onNavigate }) => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error loading product details:", err);
        setError("Product not found or removed.");
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchDetail();
  }, [productId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
        <RefreshCw size={28} className="spin" style={{ color: 'var(--accent-gold)' }} />
        <p style={{ marginTop: '1rem' }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem', textAlign: 'center' }} className="glass-panel">
        <AlertCircle size={36} style={{ color: '#ef4444', marginBottom: '1rem' }} />
        <h2>Product Unavailable</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>{error}</p>
        <button onClick={onBack} className="btn-primary">
          <ArrowLeft size={16} /> Return to Shop
        </button>
      </div>
    );
  }

  const inCartItem = cart.find(item => item.id === product.id);
  const cartQty = inCartItem ? inCartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0 || !product.is_available;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const msg = addToCart(product, quantity);
    onShowToast(msg);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Back Link */}
      <button 
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          fontWeight: 600,
          marginBottom: '2rem'
        }}
      >
        <ArrowLeft size={18} /> Back to Catalog
      </button>

      {/* Main Product Layout Grid */}
      <div className="glass-panel" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '3.5rem',
        padding: '3rem',
        alignItems: 'start'
      }}>
        {/* Left: Product Media Gallery */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: '#131722',
          border: '1px solid var(--border-color)'
        }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
          <span className="badge-gold" style={{ position: 'absolute', top: '16px', left: '16px' }}>
            {product.category}
          </span>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              {product.name}
            </h1>
            
            {/* Price Tag */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '1rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                ${product.price.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Tax calculated at checkout
              </span>
            </div>
          </div>

          {/* Stock Availability Indicator */}
          <div style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isOutOfStock 
              ? 'rgba(239, 68, 68, 0.1)' 
              : product.stock <= 10 
              ? 'rgba(245, 158, 11, 0.1)' 
              : 'rgba(16, 185, 129, 0.1)',
            border: `1px solid ${
              isOutOfStock 
                ? 'rgba(239, 68, 68, 0.3)' 
                : product.stock <= 10 
                ? 'rgba(245, 158, 11, 0.3)' 
                : 'rgba(16, 185, 129, 0.3)'
            }`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isOutOfStock ? '#ef4444' : product.stock <= 10 ? '#f59e0b' : '#10b981'
            }} />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: isOutOfStock ? '#fca5a5' : product.stock <= 10 ? '#fbbf24' : '#34d399'
            }}>
              {isOutOfStock 
                ? 'Out of Stock' 
                : `In Stock: ${product.stock} items available in MongoDB database`}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Description & Details
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>
              {product.description}
            </p>
          </div>

          {/* Quantity Controls & Add to Cart */}
          {!isOutOfStock && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity:</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    style={{ padding: '0.6rem 0.85rem', opacity: quantity <= 1 ? 0.4 : 1 }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0 1rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    style={{ padding: '0.6rem 0.85rem', opacity: quantity >= product.stock ? 0.4 : 1 }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleAddToCart}
                  className="btn-primary"
                  style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
                >
                  <ShoppingBag size={20} /> Add {quantity} to Cart (${(product.price * quantity).toFixed(2)})
                </button>
                {cartQty > 0 && (
                  <button
                    onClick={() => onNavigate('/cart')}
                    className="btn-secondary"
                    style={{ padding: '1rem 1.5rem' }}
                  >
                    View Cart ({cartQty})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Guarantees */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} style={{ color: 'var(--accent-gold)' }} />
              <span>Free Express Worldwide Courier</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--accent-gold)' }} />
              <span>Authenticity & Stock Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
