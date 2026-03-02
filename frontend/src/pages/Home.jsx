// frontend/src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { productService } from "../services/productService";
import "../styles/home.css";

const DEMO_PRODUCTS = [
  { _id: "d1", name: "Travel Backpack", description: "Water-resistant with laptop compartment", price: 59.99, category: "Accessories", inStock: 12, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800" },
  { _id: "d2", name: "Running Shoes", description: "Lightweight and breathable for daily runs", price: 74.99, category: "Footwear", inStock: 30, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" },
  { _id: "d3", name: "Bluetooth Speaker", description: "Portable speaker with deep bass", price: 39.99, category: "Electronics", inStock: 45, image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80" },
  { _id: "d4", name: "Sunglasses", description: "Polarized UV protection", price: 24.99, category: "Accessories", inStock: 50, image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800" },
  { _id: "d5", name: "Gaming Mouse", description: "Ergonomic design with 7 buttons", price: 29.99, category: "Electronics", inStock: 40, image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800" },
  { _id: "d6", name: "Coffee Maker", description: "Programmable drip coffee machine", price: 49.99, category: "Home", inStock: 22, image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80" }, 
  { _id: "d7", name: "Wireless Headphones", description: "Noise-cancelling over-ear headphones", price: 129.99, category: "Electronics", inStock: 24, image: "https://images.unsplash.com/photo-1516700643252-4e6f7a0b5905?auto=format&fit=crop&w=800&q=80" },
  { _id: "d8", name: "Smart Watch", description: "Fitness tracking with heart rate monitor", price: 89.99, category: "Wearables", inStock: 18, image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=800&q=80" },
];      

const HERO_SLIDES = [
  {
    title: "Shop gifts",
    highlight: "Eid al-Fitr",
    subtitle: "Celebrate with curated gifts and festive offers",
    cta: " Shop Products",
    href: "/products",
    image: "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Shop for your",
    highlight: "home essentials",
    subtitle: "Cleaning tools, home storage, kitchenware & more",
    cta: " Shop Products",
    href: "/products",
    image: "https://images.pexels.com/photos/3768169/pexels-photo-3768169.jpeg?_gl=1*moy838*_ga*MTA0MTExMjY3OS4xNzcyNDM3NzU3*_ga_8JE65Q40S6*czE3NzI0Mzc3NTckbzEkZzEkdDE3NzI0Mzk1NDIkajYwJGwwJGgw",
  },
  {
    title: "Shop",
    highlight: "Electronics",
    subtitle: "Headphones, smart watches, speakers, and accessories",
    cta: " Shop Products",
    href: "/products",
    image: "https://plus.unsplash.com/premium_photo-1679079456083-9f288e224e96?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const res = await productService.getAllProducts(1, 8);
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
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIdx((i) => (i + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const prevSlide = () => setHeroIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length);

  return (
    <div className="home">
      <section
        className="hero-rotator"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255,122,24,0.55) 0%, rgba(255,177,153,0.55) 100%), url('${HERO_SLIDES[heroIdx].image}')`,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat',
        }}
      >
        <button className="hero-arrow left" onClick={prevSlide} aria-label="Previous">‹</button>
        <div className="promo-card full">
          <div className="promo-left">
            <h2>{HERO_SLIDES[heroIdx].title} <span className="promo-highlight">{HERO_SLIDES[heroIdx].highlight}</span></h2>
            <p>{HERO_SLIDES[heroIdx].subtitle}</p>
            <Link to={HERO_SLIDES[heroIdx].href} className="hero-cta">Shop Products</Link>
          </div>
          <div className="promo-right" />
        </div>
        <button className="hero-arrow right" onClick={nextSlide} aria-label="Next">›</button>
      </section>

      <section className="products-section">
        <h2>Featured Products</h2>
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
            <p>No products available yet</p>
            <Link to="/products">Browse all products</Link>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((p) => (
              <div className="product-card" key={p._id}>
                <div className="product-image">
                  <img src={p.image || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800"} alt={p.name} />
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
                    <Link to="/login" className="disabled-btn">Login to add</Link>
                  ) : (
                    <button className="disabled-btn" disabled>Add to Cart</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="browse-link">
          <Link to="/products" className="browse-btn">Browse All Products</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
