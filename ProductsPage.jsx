import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage = ({ initialCategory = 'All', initialSearch = '', onOpenDetail, onShowToast }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortOption, setSortOption] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortOption]);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories([{ id: 'all', name: 'All' }, ...res.data]);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (sortOption === 'price_asc') params.sort = 'price_asc';
      if (sortOption === 'price_desc') params.sort = 'price_desc';

      const res = await apiClient.get('/products', { params });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Unable to connect to product server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '0.5rem' }}>
          Explore Collection
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Browse our complete catalog of luxury apparel, Japanese denim, outerwear, and accessories.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.25rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.5rem' }}>
            Category:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                  color: isSelected ? '#0b0d12' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Search Bar & Sort Dropdown */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search 
              size={16} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} 
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: '36px',
                width: '100%',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ fontSize: '0.875rem', padding: '0.6rem 1rem' }}
            >
              <option value="newest">Sort by: Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid / Loading / Error State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="spin" style={{ marginBottom: '1rem', color: 'var(--accent-gold)' }} />
          <p>Loading collection from MongoDB database...</p>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: '#fca5a5' }}>
          <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{error}</p>
          <button onClick={fetchProducts} className="btn-secondary" style={{ marginTop: '1.5rem' }}>
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>No products match your query</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Try adjusting your search terms or category selection filters.
          </p>
          <button 
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="btn-primary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Showing {products.length} products
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '1.75rem'
          }}>
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenDetail={onOpenDetail}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
