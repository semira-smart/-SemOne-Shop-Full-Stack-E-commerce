import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { productService } from "../../services/productService";
import "../../styles/admin.css";

const emptyForm = { name: "", description: "", price: "", category: "", inStock: "", image: "" };

const AdminProducts = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProducts(1, 100);
      if (res?.success && Array.isArray(res.products)) {
        setProducts(res.products);
      } else {
        setProducts([]);
      }
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        inStock: Number(form.inStock || 0),
        image: form.image.trim(),
      };
      const res = await productService.createProduct(payload, token);
      if (res?.success) {
        setForm(emptyForm);
        await load();
      } else {
        throw new Error(res?.message || "Create failed");
      }
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, patch) => {
    try {
      const res = await productService.updateProduct(id, patch, token);
      if (res?.success) {
        await load();
      }
    } catch {
      setError("Update failed");
    }
  };

  const remove = async (id) => {
    try {
      const res = await productService.deleteProduct(id, token);
      if (res?.success) {
        await load();
      }
    } catch {
      setError("Delete failed");
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price || "",
      category: p.category || "",
      inStock: p.inStock || "",
      image: p.image || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await update(editingId, {
      name: editForm.name.trim(),
      description: editForm.description.trim(),
      price: Number(editForm.price),
      category: editForm.category.trim(),
      inStock: Number(editForm.inStock || 0),
      image: editForm.image.trim(),
    });
    cancelEdit();
  };


  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1>Admin Products</h1>
        <p>Manage inventory and product catalog</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Add Product</h2>
          <form className="admin-form" onSubmit={submit}>
            <div className="form-row">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-row">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Price</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="form-row">
              <label>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div className="form-row">
              <label>Stock</label>
              <input type="number" value={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Image URL</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            {error && <div className="submit-error">{error}</div>}
            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={saving}>{saving ? "Saving..." : "Add Product"}</button>
            </div>
          </form>
        </div>

        <div className="admin-card">
          <h2>Product List</h2>
          {loading ? (
            <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>
          ) : (
            <div className="admin-product-grid">
              {products.map((p) => {
                const imageSrc = p.image && p.image.startsWith("http") ? p.image : (p.image || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800");
                return (
                  <div className="admin-product-card" key={p._id}>
                    <div className="card-image"><img src={imageSrc} alt={p.name} /></div>
                    <div className="card-body">
                      <h3>{p.name}</h3>
                      <p className="card-desc">{p.description || "No description provided"}</p>
                      <div className="card-meta">
                        <span className="price">${Number(p.price || 0).toFixed(2)}</span>
                        <span className="category">{p.category || "General"}</span>
                        <span className={`stock ${p.inStock > 0 ? "in" : "out"}`}>{p.inStock > 0 ? `${p.inStock} in stock` : "Out of stock"}</span>
                      </div>

                      {editingId === p._id ? (
                        <div className="admin-edit-form">
                          <div className="form-row">
                            <label>Name</label>
                            <input value={editForm.name} onChange={(e)=>setEditForm({...editForm, name:e.target.value})} />
                          </div>
                          <div className="form-row">
                            <label>Price</label>
                            <input type="number" step="0.01" value={editForm.price} onChange={(e)=>setEditForm({...editForm, price:e.target.value})} />
                          </div>
                          <div className="form-row">
                            <label>Category</label>
                            <input value={editForm.category} onChange={(e)=>setEditForm({...editForm, category:e.target.value})} />
                          </div>
                          <div className="form-row">
                            <label>Stock</label>
                            <input type="number" value={editForm.inStock} onChange={(e)=>setEditForm({...editForm, inStock:e.target.value})} />
                          </div>
                          <div className="form-row" style={{gridColumn:'1 / -1'}}>
                            <label>Image URL</label>
                            <input value={editForm.image} onChange={(e)=>setEditForm({...editForm, image:e.target.value})} />
                          </div>
                          <div className="form-row" style={{gridColumn:'1 / -1'}}>
                            <label>Description</label>
                            <textarea value={editForm.description} onChange={(e)=>setEditForm({...editForm, description:e.target.value})} />
                          </div>
                          <div className="form-actions" style={{gridColumn:'1 / -1'}}>
                            <button type="button" className="primary-btn" onClick={saveEdit}>Save</button>
                            <button type="button" className="remove-btn" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="admin-product-actions">
                          <button className="details-btn" onClick={() => startEdit(p)}>Edit</button>
                          <button className="remove-btn" onClick={() => remove(p._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
