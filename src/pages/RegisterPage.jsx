import React, { useState } from 'react';
import { User, Mail, KeyRound, ArrowRight, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = ({ onNavigate, onShowToast }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await register(name, email, password);
      if (onShowToast) onShowToast(`Account created! Welcome to NOVA STORE, ${user.name}.`);
      onNavigate('/products');
    } catch (err) {
      console.error("Registration failed:", err);
      const detail = err.response?.data?.detail || "Registration failed. Please check your information.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <div className="glass-panel" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="badge-gold" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> JOIN THE ARCHIVE
          </div>
          <h1 className="font-serif" style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Join NOVA STORE to enjoy express checkout and order tracking.
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
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

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
              Password (min. 6 characters)
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                minLength={6}
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
                <RefreshCw size={18} className="spin" /> Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button onClick={() => onNavigate('/login')} style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
