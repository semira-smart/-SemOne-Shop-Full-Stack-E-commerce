import { useContext, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { orderService } from "../services/orderService";
import "../styles/cart.css";

const Cart = () => {
  const { cart, updateQty, removeFromCart, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    email: "",
    payment: "Cash on Delivery",
  });
  const [error, setError] = useState(null);

  const total = useMemo(() => {
    return cart.reduce((acc, p) => acc + (Number(p.price || 0) * (p.qty || 1)), 0);
  }, [cart]);

  const onQtyChange = (id, next) => updateQty(id, next);
  const onRemove = (id) => removeFromCart(id);

  const onPlaceOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFormOpen(true);
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    try {
      setPlacing(true);
      setError(null);
      const products = cart.map((p) => ({ product: p._id, quantity: p.qty || 1 }));
      const payload = {
        products,
        address: orderForm.address,
        phone: orderForm.phone,
        paymentMethod: orderForm.payment,
      };
      const res = await orderService.createOrder(payload, token);
      if (res?.success) {
        clearCart();
        setFormOpen(false);
        navigate("/orders");
      } else {
        throw new Error(res?.message || "Order failed");
      }
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="cart-page container">
      <h1 className="cart-title">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/products" className="browse-btn">Browse Products</Link>
        </div>
      ) : (
        <>
          <div className="cart-grid">
            <div className="cart-items">
              {cart.map((p) => (
                <div className="cart-item" key={p._id}>
                  <div className="item-image">
                    <img src={p.image || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800"} alt={p.name} />
                  </div>
                  <div className="item-info">
                    <h3 className="item-name">{p.name}</h3>
                    <p className="item-category">{p.category}</p>
                    <p className="item-price">${Number(p.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="item-qty">
                    <button onClick={() => onQtyChange(p._id, Math.max(1, (p.qty || 1) - 1))} className="qty-btn">-</button>
                    <input
                      type="number"
                      min={1}
                      value={p.qty || 1}
                      onChange={(e) => onQtyChange(p._id, Math.max(1, Number(e.target.value) || 1))}
                    />
                    <button onClick={() => onQtyChange(p._id, (p.qty || 1) + 1)} className="qty-btn">+</button>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => onRemove(p._id)} className="remove-btn">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Items</span>
                <span>{cart.reduce((acc, i) => acc + (i.qty || 1), 0)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span className="total-amount">${total.toFixed(2)}</span>
              </div>
              <div className="summary-actions">
                <button className="clear-btn" onClick={clearCart}>Remove all</button>
                <button className="primary-btn" onClick={onPlaceOrder}>Place Order</button>
              </div>
              <p className="summary-note">Prices include tax where applicable.</p>
            </div>
          </div>
        </>
      )}

      {formOpen && (
        <div className="order-modal">
          <div className="order-card">
            <h2>Order Details</h2>
            <form onSubmit={submitOrder} className="order-form">
              <div className="form-row">
                <label>Full name</label>
                <input
                  type="text"
                  value={orderForm.fullName}
                  onChange={(e) => setOrderForm({ ...orderForm, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <label>Phone number</label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <label>Address</label>
                <input
                  type="text"
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input
                  type="email"
                  value={orderForm.email}
                  onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <label>Payment method</label>
                <select
                  value={orderForm.payment}
                  onChange={(e) => setOrderForm({ ...orderForm, payment: e.target.value })}
                >
                  <option>Cash on Delivery</option>
                  <option>Card (Mock)</option>
                  <option>Bank Transfer (Mock)</option>
                </select>
              </div>

              {error && <div className="submit-error">{error}</div>}

              <div className="form-actions">
                <button type="button" className="clear-btn" onClick={() => setFormOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={placing}>
                  {placing ? "Placing..." : "Submit order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
