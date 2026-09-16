import React from 'react';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onOpenDetail, onShowToast }) => {
  const { addToCart, cart } = useCart();
  
  const inCartItem = cart.find(item => item.id === product.id);
  const cartQty = inCartItem ? inCartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0 || !product.is_available;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const msg = addToCart(product, 1);
    if (onShowToast) onShowToast(msg);
  };

  return (
    <div 
      className="glass-panel"
      onClick={() => onOpenDetail(product.id)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
        e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Product Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '120%',
        overflow: 'hidden',
        backgroundColor: '#131722'
      }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        
        {/* Category Pill */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(11, 13, 18, 0.75)',
          backdropFilter: 'blur(8px)',
          color: 'var(--text-secondary)',
          fontSize: '0.725rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '9999px',
          border: '1px solid var(--border-color)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {product.category}
        </span>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
            fontSize: '0.725rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '9999px'
          }}>
            Sold Out
          </span>
        ) : product.stock <= 10 ? (
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.9)',
            color: '#0b0d12',
            fontSize: '0.725rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '9999px'
          }}>
            Low Stock ({product.stock})
          </span>
        ) : null}
      </div>

      {/* Product Content Details */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            lineHeight: 1.35
          }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineClamp: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--accent-gold)'
            }}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cartQty > 0 ? "btn-secondary" : "btn-primary"}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-sm)',
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            {cartQty > 0 ? (
              <>
                <Check size={14} style={{ color: 'var(--accent-gold)' }} />
                <span>{cartQty} in Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
