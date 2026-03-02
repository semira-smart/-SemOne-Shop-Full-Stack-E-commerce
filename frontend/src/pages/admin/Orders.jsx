import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { orderService } from "../../services/orderService";
import "../../styles/admin.css";

const AdminOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders(token);
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
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, status) => {
    try {
      const res = await orderService.updateOrderStatus(id, status, token);
      if (res?.success) {
        await load();
      }
    } catch {
      setError("Failed to update status");
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1>Admin Orders</h1>
        <p>Manage customer orders</p>
      </div>

      <div className="admin-card">
        {error && <div className="submit-error">{error}</div>}
        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>
        ) : (
          <div className="admin-table">
            <div className="table-head">
              <span>Order</span>
              <span>User</span>
              <span>Total</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {orders.map((o) => (
              <div className="table-row" key={o._id}>
                <span>#{o._id.slice(-6)}</span>
                <span>{o.user?.email || o.user?.username || "User"}</span>
                <span>${Number(o.totalPrice || 0).toFixed(2)}</span>
                <span>
                  <select
                    value={o.status || "Pending"}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </span>
                <span className="row-actions">
                  <details>
                    <summary>Products</summary>
                    {(o.products || []).map((it, idx) => (
                      <div key={idx} className="mini-row">
                        <span>{it.product?.name || "Product"}</span>
                        <span>Qty: {it.quantity || 1}</span>
                        <span>${Number(it.product?.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </details>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
