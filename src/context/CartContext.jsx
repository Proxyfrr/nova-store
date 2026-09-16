import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('nova_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nova_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    let message = "";
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        const newQty = currentQty + quantity;
        if (newQty > product.stock) {
          message = `Cannot add more. Stock limit is ${product.stock}.`;
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        message = `Updated ${product.name} quantity to ${newQty}.`;
        return updated;
      } else {
        if (quantity > product.stock) {
          message = `Cannot add. Stock limit is ${product.stock}.`;
          return prevCart;
        }
        message = `Added ${product.name} to your cart.`;
        return [...prevCart, { ...product, quantity }];
      }
    });
    return message;
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQty, maxStock) => {
    if (newQty < 1) return;
    if (maxStock && newQty > maxStock) return;
    
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.10; // 10% tax estimate
  const total = subtotal + tax;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      tax,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
