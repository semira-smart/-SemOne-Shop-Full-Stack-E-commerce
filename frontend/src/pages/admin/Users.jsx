import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { adminService } from "../../services/adminService";
import "../../styles/admin.css";

const AdminUsers = () => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      const res = await adminService.registerAdmin(form, token);
      if (res?.success) {
        setMessage(`Admin created: ${res.user?.email}`);
        setForm({ username: "", email: "", password: "" });
      } else {
        throw new Error(res?.message || "Failed to create admin");
      }
    } catch (err) {
      setError(err.message || "Error creating admin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1>Admin Users</h1>
        <p>Create new admin accounts</p>
      </div>

      <div className="admin-card">
        <h2>Register Admin</h2>
        <form className="admin-form" onSubmit={submit}>
          <div className="form-row">
            <label>Username</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <div className="submit-error">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <div className="form-actions">
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsers;
