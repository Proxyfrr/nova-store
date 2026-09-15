import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: '5rem',
      padding: '4rem 1.5rem 2rem'
    }}>
      {/* Brand Value Pillars */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto 4rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
        paddingBottom: '3rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Truck style={{ color: 'var(--accent-gold)', width: 32, height: 32, flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Express Global Shipping</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Complimentary insured courier delivery</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ShieldCheck style={{ color: 'var(--accent-gold)', width: 32, height: 32, flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Authenticity Guaranteed</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>100% genuine craftsmanship</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <RefreshCw style={{ color: 'var(--accent-gold)', width: 32, height: 32, flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Hassle-Free Returns</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>30-day effortless return window</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Award style={{ color: 'var(--accent-gold)', width: 32, height: 32, flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Sustainable Luxury</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Responsibly sourced organic materials</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        paddingBottom: '3rem'
      }}>
        {/* Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #d4af37 0%, #996515 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0b0d12',
              fontWeight: 900
            }}>
              N
            </div>
            <span className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
              NOVA <span style={{ color: 'var(--accent-gold)' }}>STORE</span>
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Redefining modern luxury apparel with uncompromised craftsmanship, clean aesthetics, and timeless style.
          </p>
        </div>

        {/* Collections */}
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>Collections</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li><button onClick={() => onNavigate('/products')} style={{ hover: { color: 'var(--accent-gold)' } }}>Outerwear & Coats</button></li>
            <li><button onClick={() => onNavigate('/products')} style={{ hover: { color: 'var(--accent-gold)' } }}>Tops & Essential Tees</button></li>
            <li><button onClick={() => onNavigate('/products')} style={{ hover: { color: 'var(--accent-gold)' } }}>Japanese Denim & Pants</button></li>
            <li><button onClick={() => onNavigate('/products')} style={{ hover: { color: 'var(--accent-gold)' } }}>Footwear & Boots</button></li>
            <li><button onClick={() => onNavigate('/products')} style={{ hover: { color: 'var(--accent-gold)' } }}>Leather Accessories</button></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>Customer Care</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li><button onClick={() => onNavigate('/orders')}>Track My Order</button></li>
            <li><a href="#shipping">Shipping & Returns Policy</a></li>
            <li><a href="#size-guide">Size & Fit Guide</a></li>
            <li><a href="#contact">Contact Concierge</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>Exclusive Access</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Subscribe to receive private invitations to new collection debuts and seasonal drops.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={{ flex: 1, padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            />
            <button className="btn-primary" style={{ padding: '0.6rem 1rem' }}>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <p>© {new Date().getFullYear()} NOVA STORE Brand Inc. All rights reserved.</p>
        <p>Built with React, FastAPI, Motor & MongoDB</p>
      </div>
    </footer>
  );
};
