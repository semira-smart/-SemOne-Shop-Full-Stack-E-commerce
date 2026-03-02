import { createContext, useState, useEffect } from "react";

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((p) => p._id === product._id);
      if (found) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: (p.qty || 1) + qty } : p
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((p) => p._id !== id));

  const updateQty = (id, qty) =>
    setCart((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, qty: Math.max(1, qty) } : p
      )
    );

  const clearCart = () => setCart([]);

  const getCartItemCount = () =>
    cart.reduce((acc, item) => acc + (item.qty || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
