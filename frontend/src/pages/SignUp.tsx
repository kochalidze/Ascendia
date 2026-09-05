import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router";

import './styles/Registration.css'

function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const { register, isLoading, error, clearError } = useAuthStore();

  const navigate = useNavigate();

  function validate(): string | null {
    if (!name.trim()) return "სახელი სავალდებულოა";
    if (!email.trim()) return "Email სავალდებულოა";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email არასწორია";
    if (password.length < 8) return "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს";
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
      console.log("დარეგისტრირდა წარმატებით");
      navigate("/signin");

    } catch (err) {
      console.error("რეგისტრაცია ვერ მოხერხდა:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">სახელი</label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="სახელი"
          disabled={isLoading}
          required
          maxLength={255}
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
          placeholder="Email"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">პაროლი</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="პაროლი"
          disabled={isLoading}
          required
          minLength={8}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "იტვირთება..." : "რეგისტრაცია"}
      </button>

      {(formError || error) && (
        <p className="error-message">{formError || error}</p>
      )}
    </form>
  );
}

export default SignUp;