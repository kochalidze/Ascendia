import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import NavBar from '../components/NavBar';

import './style/Register.css';

function Login() {
  const navigate = useNavigate();
   
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
      e.preventDefault();
      if (isAuthenticated) {
          navigate('/profile');
          return;
      }
      try {
          await login(formData.email, formData.password);
          setFormData({ email: '', password: '' });
          navigate('/home');
      } catch (err) {
          console.log('login fall')
      }
  };

  return (
    <div className="register-root">
      <div className="bg-grid"></div>
      <div className="glow glow-cyan"></div>
      <div className="glow glow-fuchsia"></div>

      <div className="terminal-card">

        <div className="terminal-header">
          <div className="sys-status sys-status--secure">SYS_SECURE_GATEWAY_V.1.0.4</div>
          <h1 className="terminal-title">Access Terminal</h1>
          <p className="terminal-subtitle">
            შეიყვანე შენი ციფრული კოდები მატრიცაში დასაბრუნებლად
          </p>
        </div>

        {error && (
          <div className="error-box">
            <span className="error-dot"></span>
            <span className="error-label">[ACCESS DENIED]:</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="register-form">

          <div className="field-group">
            <label className="field-label field-label--cyan">
              <span>01 // Matrix Address (Email)</span>
              <span className="field-hint">შენი იდენტიფიკატორი</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="field-input field-input--cyan"
              placeholder="neo@example.com"
            />
          </div>

          <div className="field-group">
            <label className="field-label field-label--fuchsia">
              <span>02 // Encryption Key (Password)</span>
              <span className="field-hint">უსაფრთხოების გასაღები</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="field-input field-input--fuchsia"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>მონაცემთა სინქრონიზაცია...</span>
              </>
            ) : (
              <span>კავშირის დამყარება [CONNECT]</span>
            )}
          </button>
        </form>

        <div className="login-link-row">
          ჯერ კიდევ არ გაქვს ციფრული ID?{" "}
          <Link to="/register" className="login-link">
            გაიარე რეგისტრაცია &rarr;
          </Link>
        </div>
      </div>
      <NavBar />
    </div>
  );
}

export default Login;