import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router";

// import './styles/Registration.css';

function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  function validate(): string | null {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address";
    if (!password) return "Password is required";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    setFormError(""); 

    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await login(email.trim(), password);
      console.log("Logged in successfully");
      navigate("/dashboard"); // შეცვალე შენი სასურველი როუტით
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  return (
    <div className="registration-container">
      {/* iPhone-style rounded card */}
      <div className="iphone-card">
        {/* Dynamic Island / Notch decoration */}
        {/* <div className="notch-pill"></div> */}

        <div className="card-header">
          <h2>Sign In</h2>
          <p>Welcome back to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              disabled={isLoading}
              required
              className="ios-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
              className="ios-input"
            />
          </div>

          {(formError || error) && (
            <div className="error-banner">
              <p className="error-message">{formError || error}</p>
            </div>
          )}

          <button type="submit" className="ios-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loader-text">Loading...</span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.85rem", margin: 0 }}>
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              style={{ color: "#E58392", textDecoration: "none", fontWeight: "600" }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );2
}

export default SignIn;