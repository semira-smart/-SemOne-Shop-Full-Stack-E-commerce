import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { orderService } from "../services/orderService";
import "../styles/orders.css";

const Orders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await orderService.getUserOrders(token);
        if (!mounted) return;
        if (res?.success && Array.isArray(res.orders)) {
          setOrders(res.orders);
        } else {
          setOrders([]);
        }
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [token]);

  // User orders page does not display charts; charts are admin-only

  return (
    <div className="orders-page container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>View your order history and summary insights.</p>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      )}
      {error && !loading && (
        <div className="loading-container"><p>{error}</p></div>
      )}

      {!loading && !error && (
        <>
          <div className="orders-list">
            {orders.length === 0 ? (
              <div className="loading-container"><p>No orders found</p></div>
            ) : (
              orders.map((o) => (
                <div className="order-card" key={o._id}>
                  <div className="order-summary">
                    <div>
                      <h3>Order #{o._id.slice(-6)}</h3>
                      <p className="order-date">{new Date(o.createdAt || Date.now()).toLocaleString()}</p>
                    </div>
                    <div className="order-meta">
                      <span className={`status ${o.status?.toLowerCase() || 'pending'}`}>{o.status || "Pending"}</span>
                      <span className="total">${Number(o.totalPrice || 0).toFixed(2)}</span>
                      <button className="details-btn" onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                        {expanded === o._id ? "Hide Details" : "View Details"}
                      </button>
                    </div>
                  </div>
                  {expanded === o._id && (
                    <div className="order-details">
                      {(o.products || []).map((it, idx) => (
                        <div className="order-item" key={idx}>
                          <div className="oi-info">
                            <h4>{it.product?.name || "Product"}</h4>
                            <p className="oi-price">${Number(it.product?.price || 0).toFixed(2)}</p>
                          </div>
                          <div className="oi-qty">
                            <span>Qty: {it.quantity || 1}</span>
                          </div>
                          <div className="oi-sub">
                            <span>Subtotal: ${Number((it.product?.price || 0) * (it.quantity || 1)).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
