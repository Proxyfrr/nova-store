import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Modal } from './components/Modal';
import { Search } from 'lucide-react';

export function AppContent() {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Search Overlay
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Global Toast
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleNavigate = (path) => {
    // Parse query params if any
    if (path.includes('?category=')) {
      const cat = decodeURIComponent(path.split('?category=')[1]);
      setCategoryFilter(cat);
      setCurrentPath('/products');
    } else {
      setCategoryFilter('All');
      setCurrentPath(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductDetail = (productId) => {
    setSelectedProductId(productId);
    setCurrentPath('/product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrderDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setCurrentPath('/order-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExecuteSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchModalOpen(false);
      handleNavigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar 
        onNavigate={handleNavigate} 
        currentPath={currentPath}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {currentPath === '/' && (
          <HomePage 
            onNavigate={handleNavigate}
            onOpenDetail={handleOpenProductDetail}
            onShowToast={showToast}
          />
        )}

        {currentPath === '/products' && (
          <ProductsPage
            initialCategory={categoryFilter}
            onOpenDetail={handleOpenProductDetail}
            onShowToast={showToast}
          />
        )}

        {currentPath === '/product-detail' && (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => handleNavigate('/products')}
            onShowToast={showToast}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}

        {currentPath === '/checkout' && (
          <CheckoutPage 
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPath === '/orders' && (
          <OrdersPage 
            onOpenOrderDetail={handleOpenOrderDetail}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/order-detail' && (
          <OrderDetailPage
            orderId={selectedOrderId}
            onBack={() => handleNavigate('/orders')}
          />
        )}

        {currentPath === '/login' && (
          <LoginPage 
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPath === '/register' && (
          <RegisterPage 
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPath === '/admin' && (
          <AdminDashboardPage 
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Global Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'success' })} 
      />

      {/* Search Overlay Modal */}
      <Modal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        title="Search Collection"
      >
        <form onSubmit={handleExecuteSearch} style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by jacket, denim, boots..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
              style={{ width: '100%', paddingLeft: '38px' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Search
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
