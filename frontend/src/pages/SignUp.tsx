import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router";
// import axios from "axios";

import './styles/Registration.css';

function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  // const [pfp, setPfp] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const { register, isLoading, error, clearError } = useAuthStore();

  const navigate = useNavigate();

  function validate(): string | null {
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address";
    if (password.length < 8) return "Password must be at least 8 characters";
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
      await register(name.trim(), email.trim(), password);
      console.log("Registered successfully");
      navigate("/signin");

    } catch (err) {
      console.error("Registration failed:", err);
    }
  }

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset
  }

  return (
    <div className="registration-container">
      <div className="iphone-card">
        {/* <div className="notch-pill"></div> */}

        <div className="card-header">
          <h2>Sign Up</h2>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={isLoading}
              required
              maxLength={255}
              className="ios-input"
            />
          </div>

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
              placeholder="At least 8 characters"
              disabled={isLoading}
              required
              minLength={8}
              className="ios-input"
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="pfp">Profile Picture URL</label>
            <input
              id="pfp"
              name="pfp"
              type="text"
              value={pfp}
              onChange={(e) => setPfp(e.target.value)}
              placeholder="Enter profile picture URL"
              disabled={isLoading}
              className="ios-input"
            />
          </div> */}

          {(formError || error) && (
            <div className="error-banner">
              <p className="error-message">{formError || error}</p>
            </div>
          )}

          <button type="submit" className="ios-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loader-text">Loading...</span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;