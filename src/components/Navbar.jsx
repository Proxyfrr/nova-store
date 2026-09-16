import React, { useState } from 'react';
import { ShoppingBag, User, LogOut, LayoutDashboard, PackageCheck, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({ onNavigate, currentPath, onOpenSearch }) => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop Catalog', path: '/products' },
  ];

  const handleNav = (path) => {
    onNavigate(path);
    setMenuOpen(false);
    setUserDropdown(false);
  };

  return (
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('/')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #d4af37 0%, #996515 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0b0d12',
            fontWeight: 900,
            fontSize: '1.2rem',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)'
          }}>
            N
          </div>
          <span className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.08em', color: '#fff' }}>
            NOVA <span style={{ color: 'var(--accent-gold)' }}>STORE</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-links">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              style={{
                fontSize: '0.95rem',
                fontWeight: currentPath === item.path ? 700 : 500,
                color: currentPath === item.path ? 'var(--accent-gold)' : 'var(--text-secondary)',
                transition: 'color 0.2s ease',
                position: 'relative'
              }}
            >
              {item.label}
              {currentPath === item.path && (
                <span style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '18px',
                  height: '2px',
                  backgroundColor: 'var(--accent-gold)',
                  borderRadius: '2px'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Right Actions (Search, Cart, User Auth) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Search trigger */}
          <button 
            onClick={onOpenSearch}
            style={{ 
              color: 'var(--text-secondary)', 
              padding: '8px',
              borderRadius: '50%',
              transition: 'background 0.2s ease'
            }}
            title="Search products"
          >
            <Search size={20} />
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => handleNav('/cart')}
            style={{
              position: 'relative',
              color: 'var(--text-primary)',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Shopping Cart"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                backgroundColor: 'var(--accent-gold)',
                color: '#0b0d12',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.725rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.6)'
              }}>
                {itemCount}
              </span>
            )}
          </button>

          {/* Auth Section */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#0b0d12',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </button>

              {/* User Dropdown */}
              {userDropdown && (
                <div 
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '220px',
                    padding: '8px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                    zIndex: 1100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="badge-gold" style={{ marginTop: '4px', display: 'inline-block' }}>ADMINISTRATOR</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleNav('/orders')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      textAlign: 'left'
                    }}
                  >
                    <PackageCheck size={16} /> My Orders
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleNav('/admin')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: 'var(--accent-gold)',
                        fontWeight: 700,
                        textAlign: 'left'
                      }}
                    >
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdown(false);
                      onNavigate('/');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#fca5a5',
                      textAlign: 'left',
                      borderTop: '1px solid var(--border-color)',
                      marginTop: '4px'
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => handleNav('/login')}
                className="btn-secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                Login
              </button>
              <button 
                onClick={() => handleNav('/register')}
                className="btn-primary" 
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
