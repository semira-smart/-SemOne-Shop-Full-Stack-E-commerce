import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { productService } from "../services/productService";
import SearchBar from "../components/SearchBar";
import "../styles/products.css";

const DEMO_PRODUCTS = [
  { _id: "d1", name: "Wireless Headphones", description: "Noise-cancelling over-ear headphones", price: 129.99, category: "Electronics", inStock: 24, image: "https://images.unsplash.com/photo-1518449021794-5bcf98d2aa6b?w=800" },
  { _id: "d2", name: "Smart Watch", description: "Fitness tracking with heart rate monitor", price: 89.99, category: "Wearables", inStock: 18, image: "https://images.unsplash.com/photo-1516574187841-234108bdf181?w=800" },
  { _id: "d3", name: "Travel Backpack", description: "Water-resistant with laptop compartment", price: 59.99, category: "Accessories", inStock: 12, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800" },
  { _id: "d4", name: "Running Shoes", description: "Lightweight and breathable for daily runs", price: 74.99, category: "Footwear", inStock: 30, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" },
  { _id: "d5", name: "Bluetooth Speaker", description: "Portable speaker with deep bass", price: 39.99, category: "Electronics", inStock: 45, image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800" },
  { _id: "d6", name: "Sunglasses", description: "Polarized UV protection", price: 24.99, category: "Accessories", inStock: 50, image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800" },
  { _id: "d7", name: "Gaming Mouse", description: "Ergonomic design with 7 buttons", price: 29.99, category: "Electronics", inStock: 40, image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800" },
  { _id: "d8", name: "Coffee Maker", description: "Programmable drip coffee machine", price: 49.99, category: "Home", inStock: 22, image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800" },
];

const Products = () => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext) || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 8;
  const [query, setQuery] = useState("");

  const handleSearch = (q) => {
    setQuery(q.trim());
    setPage(1);
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await productService.getAllProducts(page, limit, query);
        if (!mounted) return;
        if (res?.success && Array.isArray(res.products)) {
          setProducts(res.products);
        } else {
          setProducts([]);
        }
      } catch {
        setProducts(DEMO_PRODUCTS);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [page, query]);

  const onAdd = (p) => {
    if (!user) return;
    if (addToCart) addToCart(p);
  };

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1));

  return (
    <div className="products-page">
      <div className="products-header container">
        <h1>Shop Products</h1>
        <p>Browse our latest products with great prices and fast shipping.</p>
        <SearchBar onSearch={handleSearch} placeholder="Search products by name, category, or description" />
      </div>

      <div className="products-content">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        )}
        {error && !loading && (
          <div className="loading-container">
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div className="loading-container">
            <p>No products found</p>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="product-grid container">
            {products.map((p) => {
              const imageSrc = p.image
                ? p.image.startsWith("http")
                  ? p.image
                  : p.image
                : "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800";
              return (
                <div className="product-card" key={p._id}>
                  <div className="product-image">
                    <img src={imageSrc} alt={p.name} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{p.name}</h3>
                    <p className="product-desc">{p.description || "No description provided"}</p>
                    <div className="product-meta">
                      <span className="price">${Number(p.price || 0).toFixed(2)}</span>
                      <span className="category">{p.category || "General"}</span>
                      <span className={`stock ${p.inStock > 0 ? "in" : "out"}`}>
                        {p.inStock > 0 ? `${p.inStock} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <Link to={`/products/${p._id}`} className="details-btn">View Details</Link>
                    {!user ? (
                      <Link to="/login" className="primary-btn disabled">Login to add</Link>
                    ) : (
                      <button
                        className="primary-btn"
                        onClick={() => onAdd(p)}
                        disabled={p.inStock <= 0}
                      >
                        {p.inStock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pagination container">
        <button className="page-btn" onClick={prevPage} disabled={page === 1}>Previous</button>
        <span className="page-indicator">Page {page}</span>
        <button className="page-btn" onClick={nextPage}>Next</button>
      </div>
    </div>
  );
};

export default Products;
