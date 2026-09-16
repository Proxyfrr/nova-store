import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, RefreshCw, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onNavigate, onShowToast }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      if (onShowToast) onShowToast(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') {
        onNavigate('/admin');
      } else {
        onNavigate('/products');
      }
    } catch (err) {
      console.error("Login failed:", err);
      const detail = err.response?.data?.detail || "Invalid credentials. Please try again.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <div className="glass-panel" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #d4af37 0%, #996515 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0b0d12',
            marginBottom: '1rem',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)'
          }}>
            <Lock size={24} />
          </div>
          <h1 className="font-serif" style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to access your orders and personal concierge.
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="spin" /> Verifying...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Quick Demo Accounts
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={() => handleQuickLogin('customer@novastore.com', 'customerpassword123')}
              className="btn-secondary"
              style={{ fontSize: '0.785rem', padding: '0.5rem' }}
            >
              Demo Customer
            </button>
            <button
              onClick={() => handleQuickLogin('admin@novastore.com', 'adminpassword123')}
              className="btn-secondary"
              style={{ fontSize: '0.785rem', padding: '0.5rem', color: 'var(--accent-gold)', borderColor: 'var(--accent-gold-light)' }}
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <button onClick={() => onNavigate('/register')} style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};
