import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import NavBar from '../components/NavBar';

import './style/Register.css';

function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
    avatar: '',
  });

  const avatarOptions = [
    'https://tse3.mm.bing.net/th/id/OIP.CVKk_KghqqPxagMszQURJAHaHV?pid=Api&h=220&P=0',
    'https://i.imgur.com/2Q9Z2ZL.pnghttps://images.search.yahoo.com/search/images;_ylt=AwriiYbhiyVq7QIAujqJzbkF;_ylu=Y29sbwNiZjEEcG9zAzIEdnRpZAMEc2VjA3Ny?fr=mcafee&p=Cute+Cartoon+Profile&imgurl=https%3A%2F%2Fi.pinimg.com%2F474x%2F12%2Ffb%2F46%2F12fb46e27d649b3eab28bfa2777595f4.jpg%3Fnii%3Dt',
    'https://i.imgur.com/3Q9Z3ZL.png',
    'https://i.imgur.com/4Q9Z4ZL.png',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      alert('You are already logged in');
      return;
    }

    try {
      register(formData.username, formData.email, formData.password, formData.bio, formData.avatar);
      setFormData({ username: '', email: '', password: '', bio: '', avatar: '' });
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="register-root">
      {/* ფონის დეკორატიული ნეონის ელემენტები */}
      <div className="bg-grid"></div>
      <div className="glow glow-fuchsia"></div>
      <div className="glow glow-cyan"></div>
 
      {/* მთავარი ტერმინალის კონტეინერი */}
      <div className="terminal-card">
 
        {/* ტერმინალის ჰედერი */}
        <div className="terminal-header">
          <div className="sys-status">SYS_V.1.0.4_ONLINE</div>
          <h1 className="terminal-title">Digital City</h1>
          <p className="terminal-subtitle">
            შექმენი შენი ციფრული ავატარი და შემოაბიჯე სამყაროში
          </p>
        </div>
 
        {/* შეცდომის შეტყობინება */}
        {error && (
          <div className="error-box">
            <span className="error-dot"></span>
            <span className="error-label">[SYSTEM CRITICAL]:</span> {error}
          </div>
        )}
 
        {/* სარეგისტრაციო ფორმა */}
        <form onSubmit={handleRegister} className="register-form">
 
          {/* USERNAME */}
          <div className="field-group">
            <label className="field-label field-label--cyan">
              <span>01 // Citizen Name (Username)</span>
              <span className="field-hint">საჯარო სახელი</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="field-input field-input--cyan"
              placeholder="მაგ: cyber_punk99"
            />
          </div>

          {/* AVATAR */}
          {/* <div className="field-group">
            <label className="field-label field-label--fuchsia">
              <span>00 // Avatar Selection</span>
              <span className="field-hint">აირჩიე შენი ციფრული სახე</span>
            </label> */}
            {/* <div className="avatar-options">
              {avatarOptions.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Avatar ${index + 1}`}
                  className={`avatar-option ${
                    formData.avatar === url ? 'selected' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, avatar: url })}
                />
              ))}
            </div> */}
          {/* </div>  */}
 
          {/* EMAIL */}
          <div className="field-group">
            <label className="field-label field-label--cyan">
              <span>02 // Matrix Address (Email)</span>
              <span className="field-hint">ავტორიზაციისთვის</span>
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
 
          {/* PASSWORD */}
          <div className="field-group">
            <label className="field-label field-label--cyan">
              <span>03 // Encryption Key (Password)</span>
              <span className="field-hint">დაცული კოდი</span>
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
 
          {/* BIO */}
          <div className="field-group">
            <label className="field-label field-label--fuchsia">
              <span>04 // Character Lore (Bio)</span>
              <span className="field-hint">არასავალდებულო</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="field-input field-input--fuchsia field-textarea"
              placeholder="დაწერე მოკლედ, ვინ ხარ ამ ქალაქში... ნეო-ჰაკერი, კორპორატიული აგენტი, თუ ქუჩის მებრძოლი?"
            />
          </div>
 
          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>ინექცია მიმდინარეობს...</span>
              </>
            ) : (
              <span>ინიცირება [START GAME]</span>
            )}
          </button>
        </form>
 
        {/* ლოგინის ლინკი */}
        <div className="login-link-row">
          უკვე დარეგისტრირებული ხარ სისტემაში?{" "}
          <Link to="/login" className="login-link">
            შედი ტერმინალიდან &rarr;
          </Link>
        </div>
      </div>
      <NavBar />
    </div>
  );
}

export default Register;