import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { orderService } from "../../services/orderService";
import "../../styles/admin.css";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const s = await api.get("/admin/dashboard", token);
        const o = await orderService.getAllOrders(token);
        if (!mounted) return;
        if (s?.success && s.stats) setStats(s.stats);
        if (o?.success && Array.isArray(o.orders)) setOrders(o.orders);
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [token]);

  const insights = useMemo(() => {
    const now = new Date();
    const mondayIndex = (now.getDay() + 6) % 7;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - mondayIndex);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekCounts = Array(7).fill(0);
    let ordersThisWeek = 0;
    let ordersToday = 0;
    const topProducts = {};

    orders.forEach((o) => {
      const d = new Date(o.createdAt || Date.now());
      if (d.toDateString() === now.toDateString()) ordersToday++;
      if (d >= startOfWeek && d <= endOfWeek) {
        ordersThisWeek++;
        const idx = (d.getDay() + 6) % 7;
        weekCounts[idx] += 1;
      }
      (o.products || []).forEach((it) => {
        const name = it.product?.name || "Unknown";
        topProducts[name] = (topProducts[name] || 0) + (it.quantity || 1);
      });
    });
    const topsArr = Object.entries(topProducts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const totalTop = topsArr.reduce((acc, [, c]) => acc + c, 0) || 1;
    const topsPercents = topsArr.map(([name, c]) => ({ name, count: c, percent: (c / totalTop) * 100 }));
    return { ordersToday, ordersThisWeek, weekLabels, weekCounts, topsPercents };
  }, [orders]);

  const maxWeekCount = Math.max(1, ...insights.weekCounts);

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Overview and quick insights</p>
      </div>
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      )}
      {error && !loading && <div className="loading-container"><p>{error}</p></div>}
      {!loading && !error && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.users}</p>
            </div>
            <div className="stat-card">
              <h3>Total Products</h3>
              <p className="stat-value">{stats.products}</p>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.orders}</p>
            </div>
            <div className="stat-card">
              <h3>Orders This Week</h3>
              <p className="stat-value">{insights.ordersThisWeek}</p>
            </div>
          </div>

          <div className="admin-charts">
            <div className="chart-card">
              <h3>Orders per day (this week)</h3>
              <div className="bar-chart">
                {insights.weekLabels.map((label, idx) => {
                  const count = insights.weekCounts[idx];
                  return (
                    <div className="bar" key={label}>
                      <span className="bar-value">{count}</span>
                      <div
                        className="bar-fill"
                        style={{ height: `${(count / maxWeekCount) * 100}%` }}
                        title={`${label}: ${count}`}
                      />
                      <span className="bar-label">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="chart-card">
              <h3>Top sold products</h3>
              <div className="donut-chart">
                <svg className="donut-svg" viewBox="0 0 200 200">
                  {(() => {
                    const R = 80;
                    const C = 2 * Math.PI * R;
                    const palette = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                    let offset = 0;
                    return insights.topsPercents.map((seg, i) => {
                      const len = (seg.percent / 100) * C;
                      const el = (
                        <circle
                          key={seg.name}
                          r={R}
                          cx={100}
                          cy={100}
                          fill="none"
                          stroke={palette[i % palette.length]}
                          strokeWidth={32}
                          strokeDasharray={`${len} ${C - len}`}
                          strokeDashoffset={-offset}
                          transform="rotate(-90 100 100)"
                        />
                      );
                      offset += len;
                      return el;
                    });
                  })()}
                  <circle r="50" cx="100" cy="100" fill="white" />
                </svg>
                <div className="donut-legend">
                  {insights.topsPercents.map((seg, i) => {
                    const palette = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                    return (
                      <div className="legend-item" key={seg.name}>
                        <span className="legend-swatch" style={{ background: palette[i % palette.length] }} />
                        <span className="legend-label">{seg.name}</span>
                        <span className="legend-value">{Math.round(seg.percent)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
