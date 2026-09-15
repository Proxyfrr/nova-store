import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      borderRadius: '12px',
      background: type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(19, 23, 34, 0.95)',
      color: type === 'error' ? '#fff' : '#f8fafc',
      border: type === 'error' ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(212, 175, 55, 0.4)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(12px)',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {type === 'error' ? (
        <AlertCircle style={{ color: '#fff', width: 20, height: 20 }} />
      ) : (
        <CheckCircle2 style={{ color: '#d4af37', width: 20, height: 20 }} />
      )}
      <span style={{ fontSize: '0.925rem', fontWeight: 600 }}>{message}</span>
      <button onClick={onClose} style={{ marginLeft: '8px', opacity: 0.7, hover: { opacity: 1 } }}>
        <X style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
};
