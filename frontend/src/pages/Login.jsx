// frontend/src/pages/Login.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/authService";
import { jwtDecode } from "jwt-decode"; // Changed from default import to named import
import "../styles/main.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loginType: "user", // "user" or "admin"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleLoginTypeChange = (type) => {
    setFormData({
      ...formData,
      loginType: type,
    });
    setErrors({}); // Clear errors when switching
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );

      if (response.success && response.token) {
        try {
          // Decode JWT token to get actual user information
          const decoded = jwtDecode(response.token);
          
          // Create user data object with actual role from token
          const userData = {
            userId: decoded.userId,
            role: decoded.role, // Actual role from backend (Admin or User)
            email: formData.email,
          };
          
          // Save user data and token
          login(userData, response.token);
          
          // Navigate based on actual role from token
          if (decoded.role === "Admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          setErrors({ submit: "Failed to process login. Please try again." });
        }
      } else {
        setErrors({ submit: response.message || "Invalid credentials" });
      }
    } catch (error) {
      setErrors({ submit: error.message || "An error occurred during login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {/* Login Type Toggle */}
        <div className="login-type-toggle">
          <button
            type="button"
            className={`toggle-btn ${formData.loginType === "user" ? "active" : ""}`}
            onClick={() => handleLoginTypeChange("user")}
          >
            User Login
          </button>
          <button
            type="button"
            className={`toggle-btn ${formData.loginType === "admin" ? "active" : ""}`}
            onClick={() => handleLoginTypeChange("admin")}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              {formData.loginType === "admin" ? "Admin Email" : "Email"}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder={
                formData.loginType === "admin"
                  ? "Enter admin email"
                  : "Enter your email"
              }
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading
              ? "Signing In..."
              : formData.loginType === "admin"
              ? "Sign In as Admin"
              : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
