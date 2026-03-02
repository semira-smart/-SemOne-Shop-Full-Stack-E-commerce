import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { productService } from "../services/productService";
import "../styles/product-details.css";

const demoProducts = [
  { _id: "d1", name: "Wireless Headphones", description: "Noise-cancelling over-ear headphones", price: 129.99, category: "Electronics", inStock: 24, image: "https://images.unsplash.com/photo-1518449021794-5bcf98d2aa6b?w=1200" },
  { _id: "d2", name: "Smart Watch", description: "Fitness tracking with heart rate monitor", price: 89.99, category: "Wearables", inStock: 18, image: "https://images.unsplash.com/photo-1516574187841-234108bdf181?w=1200" },
  { _id: "d3", name: "Travel Backpack", description: "Water-resistant with laptop compartment", price: 59.99, category: "Accessories", inStock: 12, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200" },
];

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { cart, addToCart } = useContext(CartContext) || { cart: [], addToCart: () => {} };
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await productService.getProductById(id);
        if (!mounted) return;
        if (res?.success && res.product) setProduct(res.product);
        else setProduct(null);
      } catch {
        const fallback = demoProducts.find((p) => p._id === id) || demoProducts[0];
        setProduct(fallback);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const inCart = cart?.some((p) => p._id === id);
  const onAdd = () => {
    if (!user || !product) return;
    addToCart(product, qty);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="loading-container">
        <p>Product not found</p>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : product.image
    : "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200";

  return (
    <div className="product-details container">
      <div className="pdp-grid">
        <div className="pdp-image">
          <img src={imageSrc} alt={product.name} />
        </div>
        <div className="pdp-info">
          <h1 className="pdp-title">{product.name}</h1>
          <p className="pdp-category">{product.category}</p>
          <p className="pdp-price">${Number(product.price || 0).toFixed(2)}</p>
          <p className="pdp-desc">{product.description || "No description provided"}</p>

          <div className="pdp-stock">
            {product.inStock > 0 ? (
              <span className="in-stock">{product.inStock} in stock</span>
            ) : (
              <span className="out-stock">Out of stock</span>
            )}
            {inCart && <span className="in-cart">Already added in cart</span>}
          </div>

          <div className="pdp-actions">
            <div className="qty">
              <label htmlFor="qty">Quantity</label>
              <input
                id="qty"
                type="number"
                min={1}
                max={Math.max(1, product.inStock || 1)}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value) || 1, product.inStock || 1)))}
              />
            </div>

            {!user ? (
              <Link to="/login" className="primary-btn">Login to add</Link>
            ) : (
              <button
                className="primary-btn"
                onClick={onAdd}
                disabled={product.inStock <= 0}
              >
                {product.inStock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            )}
          </div>

          <div className="pdp-links">
            <Link to="/products" className="details-btn">Back to Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
