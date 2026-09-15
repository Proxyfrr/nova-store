import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Layers } from 'lucide-react';
import { apiClient } from '../api/client';
import { ProductCard } from '../components/ProductCard';

export const HomePage = ({ onNavigate, onOpenDetail, onShowToast }) => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          apiClient.get('/categories'),
          apiClient.get('/products')
        ]);
        setCategories(catRes.data);
        setFeaturedProducts(prodRes.data.slice(0, 4));
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '82vh',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '4rem 2rem',
        margin: '1rem 1.5rem 0',
        background: 'linear-gradient(135deg, rgba(19, 23, 34, 0.9) 0%, rgba(11, 13, 18, 0.95) 100%), url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80") center/cover no-repeat',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ maxWidth: '680px', zIndex: 2 }}>
          <div className="badge-gold" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> AUTUMN / WINTER ARCHIVE 2026
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            color: '#fff'
          }}>
            Elegance Defined in Every <span style={{ color: 'var(--accent-gold)' }}>Stitch.</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            lineHeight: 1.7
          }}>
            Discover tailored outerwear, raw Japanese selvedge denim, and handcrafted leather goods engineered for modern living.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onNavigate('/products')}
              className="btn-primary"
              style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}
            >
              Shop Collection <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => onNavigate('/products')}
              className="btn-secondary"
              style={{ padding: '1rem 2rem', fontSize: '1rem' }}
            >
              Explore Categories
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Curated Selections</span>
            <h2 style={{ fontSize: '2.2rem', color: '#fff' }}>Shop by Category</h2>
          </div>
          <button 
            onClick={() => onNavigate('/products')}
            style={{ color: 'var(--accent-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            View All Catalog <ArrowRight size={16} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              className="glass-panel"
              style={{
                position: 'relative',
                height: '280px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                transition: 'transform 0.4s ease, border-color 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <img 
                src={cat.image || 'https://images.unsplash.com/photo-1544441893-675973e31985'} 
                alt={cat.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.65)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.5rem',
                background: 'linear-gradient(to top, rgba(11, 13, 18, 0.95) 0%, transparent 100%)'
              }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.25rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineClamp: 1 }}>{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Essential Pieces</span>
            <h2 style={{ fontSize: '2.2rem', color: '#fff' }}>Featured Products</h2>
          </div>
          <button 
            onClick={() => onNavigate('/products')}
            className="btn-secondary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
          >
            Explore All
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Loading catalog...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        )}
      </section>

      {/* Brand Story Banner */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem',
        width: '100%'
      }}>
        <div className="glass-panel" style={{
          padding: '4rem 3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '1rem', display: 'inline-block' }}>Uncompromising Philosophy</span>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              Designed in Tokyo & Paris. Crafted for Eternity.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              NOVA STORE rejects fast fashion in pursuit of perpetual refinement. Each piece undergoes months of textile engineering, precision pattern making, and rigorous quality testing.
            </p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>100%</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Organic Textiles</p>
              </div>
              <div>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>30-Day</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complimentary Returns</p>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', minHeight: '320px' }}>
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80" 
              alt="Craftsmanship"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
