import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  const navigate = useNavigate();

  // ✅ password validation rules
  const rules = {
    length: password.length >= 8,
    digit: /\d/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    match: password !== "" && password === confirmPassword,
  };

  const allRulesPassed = Object.values(rules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!allRulesPassed) {
      setError("Password does not meet all requirements.");
      return;
    }

    setError(""); // Clear any previous errors

    try {
      const response = await axios.post(`${API_BASE_URL}/api/Auth/register`, {
        username: name,
        email: email,
        password: password,
      });
      console.log("Success:", response.data.token);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userName", name);
      navigate("/catalog");
    } catch (err) {
      const message =
        err.response?.data?.[0]?.description ||
        err.response?.data?.message ||
        "Registration failed.";
      setError(message);
    }
  };

    const handleLogin = async () => {
    try {
      window.location.href = `${API_BASE_URL}/api/Auth/logintest?returnUrl=http://localhost:5173/`;
      // const response = await axios.get(`${API_BASE_URL}/api/Auth/logintest?returnUrl=/`);
      // login(response.data.token);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(error.message);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Google credential is missing!");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/Auth/google-login`,
        credentialResponse.credential,
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, redirectUrl, userName } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userName", userName);

      if (redirectUrl) {
        window.location.href = "/catalog";
      }
    } catch (error) {
      console.error("Error during Google login:", error.response?.data || error.message);
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google login failed!");
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="p-4 border rounded shadow bg-light" id="register-form-container">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ live password rules */}
          <ul className="list-unstyled small mb-3">
            <li className={rules.length ? "text-success" : "text-danger"}>
              {rules.length ? "✔" : "✘"} At least 8 characters
            </li>
            <li className={rules.digit ? "text-success" : "text-danger"}>
              {rules.digit ? "✔" : "✘"} At least one digit
            </li>
            <li className={rules.uppercase ? "text-success" : "text-danger"}>
              {rules.uppercase ? "✔" : "✘"} At least one uppercase letter
            </li>
            <li className={rules.lowercase ? "text-success" : "text-danger"}>
              {rules.lowercase ? "✔" : "✘"} At least one lowercase letter
            </li>
            <li className={rules.special ? "text-success" : "text-danger"}>
              {rules.special ? "✔" : "✘"} At least one special character
            </li>
            <li className={rules.match ? "text-success" : "text-danger"}>
              {rules.match ? "✔" : "✘"} Passwords match
            </li>
          </ul>

          {error && (
            <div className="alert alert-danger text-center mb-3">{error}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={!allRulesPassed}
          >
            Register
          </button>
        </form>

        <button
          type="button"
          className="btn btn-light border w-100 d-flex align-items-center justify-content-center mb-3"
          onClick={handleLogin}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            style={{ width: "20px", marginRight: "8px" }}
          />
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
