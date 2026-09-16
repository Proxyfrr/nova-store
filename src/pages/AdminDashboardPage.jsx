import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Layers, ShoppingBag, Users, DollarSign, 
  Plus, Edit, Trash2, CheckCircle, RefreshCw, AlertCircle, Filter, 
  Search, ShieldAlert, Check, X, Eye
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { Modal } from '../components/Modal';

export const AdminDashboardPage = ({ onNavigate, onShowToast }) => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'products' | 'categories' | 'orders' | 'users'

  // Data states
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [productModal, setProductModal] = useState({ isOpen: false, mode: 'add', data: null });
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, mode: 'add', data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: null, id: null, name: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    is_available: true
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: ''
  });

  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin, activeTab, orderStatusFilter]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'stats') {
        const res = await apiClient.get('/admin/stats');
        setStats(res.data);
      } else if (activeTab === 'products') {
        const [pRes, cRes] = await Promise.all([
          apiClient.get('/products'),
          apiClient.get('/categories')
        ]);
        setProducts(pRes.data);
        setCategories(cRes.data);
      } else if (activeTab === 'categories') {
        const res = await apiClient.get('/categories');
        setCategories(res.data);
      } else if (activeTab === 'orders') {
        const params = {};
        if (orderStatusFilter !== 'All') params.status = orderStatusFilter;
        const res = await apiClient.get('/admin/orders', { params });
        setOrders(res.data);
      } else if (activeTab === 'users') {
        const res = await apiClient.get('/admin/users');
        setCustomers(res.data);
      }
    } catch (err) {
      console.error("Admin data error:", err);
      setError(err.response?.data?.detail || "Failed to connect to admin endpoints.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>Verifying administrative security clearance...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div style={{ maxWidth: '560px', margin: '4rem auto', padding: '3rem', textAlign: 'center' }} className="glass-panel">
        <ShieldAlert size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
          Administrative privileges are required to access this portal. Please log in with an admin account.
        </p>
        <button onClick={() => onNavigate('/login')} className="btn-primary">
          Log In as Admin
        </button>
      </div>
    );
  }

  // Handle Product CRUD
  const openAddProductModal = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: categories[0]?.name || 'Outerwear',
      image: '',
      stock: '20',
      is_available: true
    });
    setProductModal({ isOpen: true, mode: 'add', data: null });
  };

  const openEditProductModal = (prod) => {
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      category: prod.category,
      image: prod.image,
      stock: prod.stock.toString(),
      is_available: prod.is_available
    });
    setProductModal({ isOpen: true, mode: 'edit', data: prod });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        category: productForm.category,
        image: productForm.image,
        stock: parseInt(productForm.stock, 10),
        is_available: productForm.is_available
      };

      if (productModal.mode === 'add') {
        await apiClient.post('/products', payload);
        onShowToast("Product successfully created in MongoDB!");
      } else {
        await apiClient.put(`/products/${productModal.data.id}`, payload);
        onShowToast("Product successfully updated!");
      }

      setProductModal({ isOpen: false, mode: 'add', data: null });
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to save product.");
    }
  };

  const confirmDeleteProduct = (prod) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'product',
      id: prod.id,
      name: prod.name
    });
  };

  // Handle Category CRUD
  const openAddCategoryModal = () => {
    setCategoryForm({ name: '', description: '', image: '' });
    setCategoryModal({ isOpen: true, mode: 'add', data: null });
  };

  const openEditCategoryModal = (cat) => {
    setCategoryForm({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || ''
    });
    setCategoryModal({ isOpen: true, mode: 'edit', data: cat });
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (categoryModal.mode === 'add') {
        await apiClient.post('/categories', categoryForm);
        onShowToast("Category created successfully!");
      } else {
        await apiClient.put(`/categories/${categoryModal.data.id}`, categoryForm);
        onShowToast("Category updated successfully!");
      }
      setCategoryModal({ isOpen: false, mode: 'add', data: null });
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to save category.");
    }
  };

  const confirmDeleteCategory = (cat) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'category',
      id: cat.id,
      name: cat.name
    });
  };

  // Execute Deletion
  const handleExecuteDelete = async () => {
    try {
      if (deleteConfirm.type === 'product') {
        await apiClient.delete(`/products/${deleteConfirm.id}`);
        onShowToast(`Deleted product '${deleteConfirm.name}' from MongoDB.`);
      } else if (deleteConfirm.type === 'category') {
        await apiClient.delete(`/categories/${deleteConfirm.id}`);
        onShowToast(`Deleted category '${deleteConfirm.name}' from MongoDB.`);
      }
      setDeleteConfirm({ isOpen: false, type: null, id: null, name: '' });
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.detail || "Deletion failed.");
    }
  };

  // Handle Order Status Change
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      onShowToast(`Order status updated to '${newStatus}'`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      loadDashboardData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: '85vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge-gold" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
            ADMINISTRATOR SUITE
          </div>
          <h1 className="font-serif" style={{ fontSize: '2.5rem', color: '#fff' }}>
            Store Management Portal
          </h1>
        </div>
        <button onClick={loadDashboardData} className="btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
          <RefreshCw size={16} /> Sync Live DB Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.75rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'stats', label: 'Live Stats', icon: LayoutDashboard },
          { id: 'products', label: 'Products Catalog', icon: Package },
          { id: 'categories', label: 'Categories', icon: Layers },
          { id: 'orders', label: 'Order Pipeline', icon: ShoppingBag },
          { id: 'users', label: 'Registered Customers', icon: Users },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? 'var(--accent-gold-light)' : 'transparent',
                color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="spin" style={{ color: 'var(--accent-gold)' }} />
          <p style={{ marginTop: '1rem' }}>Querying MongoDB database...</p>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#fca5a5' }}>
          <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* TAB 1: DASHBOARD STATS */}
          {activeTab === 'stats' && stats && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem'
              }}>
                <div className="glass-panel" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Revenue</span>
                    <DollarSign size={24} />
                  </div>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>${stats.total_revenue.toFixed(2)}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.4rem' }}>Calculated from MongoDB non-cancelled orders</p>
                </div>

                <div className="glass-panel" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#60a5fa', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Orders</span>
                    <ShoppingBag size={24} />
                  </div>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{stats.total_orders}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Active order documents</p>
                </div>

                <div className="glass-panel" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fbbf24', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Pending Orders</span>
                    <RefreshCw size={24} />
                  </div>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{stats.pending_orders}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '0.4rem' }}>Requires fulfillment action</p>
                </div>

                <div className="glass-panel" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#a78bfa', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Products in Catalog</span>
                    <Package size={24} />
                  </div>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{stats.total_products}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Live store items</p>
                </div>

                <div className="glass-panel" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#34d399', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Registered Customers</span>
                    <Users size={24} />
                  </div>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{stats.total_customers}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Verified user profiles</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Product Inventory ({products.length})</h2>
                <button onClick={openAddProductModal} className="btn-primary">
                  <Plus size={18} /> Add New Product
                </button>
              </div>

              <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '1rem 1.25rem' }}>Image</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Product Name</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Category</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Price</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Stock</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem 1.25rem' }}>
                          <img src={prod.image} alt={prod.name} style={{ width: '48px', height: '54px', objectFit: 'cover', borderRadius: '6px' }} />
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: '#fff' }}>
                          {prod.name}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', color: 'var(--text-secondary)' }}>
                          {prod.category}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                          ${prod.price.toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', fontWeight: 600 }}>
                          {prod.stock}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: prod.is_available ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: prod.is_available ? '#34d399' : '#fca5a5'
                          }}>
                            {prod.is_available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => openEditProductModal(prod)} className="btn-secondary" style={{ padding: '0.4rem 0.6rem' }} title="Edit Product">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => confirmDeleteProduct(prod)} className="btn-danger" style={{ padding: '0.4rem 0.6rem' }} title="Delete Product">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORY MANAGEMENT */}
          {activeTab === 'categories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Categories ({categories.length})</h2>
                <button onClick={openAddCategoryModal} className="btn-primary">
                  <Plus size={18} /> Create Category
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {categories.map((cat) => (
                  <div key={cat.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{cat.name}</h3>
                        <span className="badge-gold" style={{ fontSize: '0.7rem' }}>slug: {cat.slug}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        {cat.description || "No description specified."}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      <button onClick={() => openEditCategoryModal(cat)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => confirmDeleteCategory(cat)} className="btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Orders ({orders.length})</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status Filter:</span>
                  <select 
                    value={orderStatusFilter} 
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '1rem 1.25rem' }}>Order ID</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Customer</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Items</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Total</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Change Status</th>
                      <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                          {ord.order_id}
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <p style={{ color: '#fff', fontWeight: 600 }}>{ord.customer_name}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{ord.customer_email}</p>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                          {ord.items.length} items
                        </td>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#fff' }}>
                          ${ord.total.toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <OrderStatusBadge status={ord.status} />
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <button onClick={() => setSelectedOrder(ord)} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REGISTERED CUSTOMERS */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Registered Customers ({customers.length})</h2>

              <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '1rem 1.25rem' }}>Customer ID</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Full Name</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Email</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Role</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {c.id}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#fff' }}>
                          {c.name}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                          {c.email}
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span className="badge-gold" style={{ fontSize: '0.7rem' }}>{c.role}</span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* PRODUCT FORM MODAL */}
      <Modal
        isOpen={productModal.isOpen}
        onClose={() => setProductModal({ isOpen: false, mode: 'add', data: null })}
        title={productModal.mode === 'add' ? "Add New Apparel Product" : "Edit Product"}
      >
        <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Product Name *</label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Price ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Stock Inventory *</label>
              <input
                type="number"
                required
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Category *</label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                style={{ width: '100%' }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Is Available?</label>
              <select
                value={productForm.is_available ? "true" : "false"}
                onChange={(e) => setProductForm({ ...productForm, is_available: e.target.value === "true" })}
                style={{ width: '100%' }}
              >
                <option value="true">Yes - Listed</option>
                <option value="false">No - Hidden</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Image URL *</label>
            <input
              type="url"
              required
              value={productForm.image}
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Description *</label>
            <textarea
              required
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
            Save Product to MongoDB
          </button>
        </form>
      </Modal>

      {/* CATEGORY FORM MODAL */}
      <Modal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal({ isOpen: false, mode: 'add', data: null })}
        title={categoryModal.mode === 'add' ? "Create Category" : "Edit Category"}
      >
        <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Category Name *</label>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              placeholder="e.g. Footwear"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Category Description</label>
            <textarea
              rows={2}
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Image URL</label>
            <input
              type="url"
              value={categoryForm.image}
              onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0.85rem' }}>
            Save Category
          </button>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: null, id: null, name: '' })}
        title={`Confirm Delete ${deleteConfirm.type === 'product' ? 'Product' : 'Category'}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to permanently delete <strong style={{ color: '#fff' }}>"{deleteConfirm.name}"</strong>? This will remove the document from MongoDB.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteConfirm({ isOpen: false, type: null, id: null, name: '' })} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleExecuteDelete} className="btn-danger" style={{ padding: '0.75rem 1.5rem' }}>
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details - ${selectedOrder.order_id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontWeight: 600, color: '#fff' }}>Customer: {selectedOrder.customer_name}</p>
              <p style={{ color: 'var(--text-muted)' }}>Email: {selectedOrder.customer_email}</p>
              <p style={{ color: 'var(--text-muted)' }}>Phone: {selectedOrder.customer_phone}</p>
              <p style={{ color: 'var(--text-muted)' }}>Address: {selectedOrder.customer_address}</p>
            </div>

            <h4 style={{ fontWeight: 700, color: '#fff', marginTop: '0.5rem' }}>Items Purchased:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span>{item.name} (x{item.quantity})</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>${item.total_price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#fff', paddingTop: '0.5rem' }}>
              <span>Total Amount:</span>
              <span style={{ color: 'var(--accent-gold)' }}>${selectedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
