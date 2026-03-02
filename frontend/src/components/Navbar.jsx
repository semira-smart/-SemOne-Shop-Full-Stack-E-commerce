// frontend/src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const cartContext = useContext(CartContext);

  // Safe cart item count - handle null/undefined context
  const cartItemCount = cartContext?.getCartItemCount 
    ? cartContext.getCartItemCount() 
    : 0;
  const admin = !!user && isAdmin();

  return (
    <nav className="navbar">
      {/* Left - Logo */}
      <div className="navbar-logo">
        <Link to={admin ? "/admin/dashboard" : "/"}>SemOne<span className="mylogo">Shop</span></Link>
      </div>

      {/* Center - Navigation */}
      <ul className="navbar-links">
        {admin ? (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/orders">Orders</Link></li>
          </>
        ) : user ? (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
          </>
        )}
      </ul>

      {/* Right - Auth & Cart */}
      <div className="navbar-right">
        {user ? (
          <>
            {!admin && (
              <Link to="/cart" className="cart-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4"></path>
                  <circle cx="9" cy="7" r="1"></circle>
                  <circle cx="20" cy="7" r="1"></circle>
                </svg>
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>
            )}
            
            {/* User Menu */}
            <div className="user-menu">
              <span className="user-name">{user.username || user.email}</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </div>
          </>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
