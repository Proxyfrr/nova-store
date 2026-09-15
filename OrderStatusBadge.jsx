import React from 'react';

export const OrderStatusBadge = ({ status }) => {
  const getStyle = (s) => {
    switch (s) {
      case 'Pending':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      case 'Confirmed':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
      case 'Preparing':
        return { bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.3)' };
      case 'Shipped':
        return { bg: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' };
      case 'Delivered':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
      case 'Cancelled':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.1)', color: '#94a3b8', border: 'rgba(255, 255, 255, 0.2)' };
    }
  };

  const style = getStyle(status);

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '0.8rem',
      fontWeight: 700,
      backgroundColor: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: style.color
      }} />
      {status}
    </span>
  );
};
