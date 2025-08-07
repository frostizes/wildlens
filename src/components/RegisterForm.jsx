import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import "bootstrap/dist/css/bootstrap.min.css";
import appleSignIn from "../assets/apple_sign_in.png";
import googleSignIn from "../assets/google_sign_in.png";
import axios from "axios";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
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
      localStorage.setItem("authToken", response.data.token); // Save token to localStorage
      localStorage.setItem("userName", name); // Save name to localStorage
      // Redirect to login page
      navigate("/catalog");
    } catch (err) {
      const message =
        err.response?.data?.[0]?.description ||
        err.response?.data?.message ||
        "Registration failed.";
      setError(message);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Google credential is missing!");
      }

      // Send the credential as a raw string
      const response = await axios.post(
        `${API_BASE_URL}/api/Auth/google-login`,
        credentialResponse.credential, // Pass the credential directly
        {
          headers: {
            "Content-Type": "application/json", // Ensure the content type is set correctly
          },
        }
      );
      const { token, redirectUrl, userName } = response.data; // Extract token and redirect URL
      localStorage.setItem("authToken", token); // Save token to localStorage
      localStorage.setItem("userName", userName); // Save token to localStorage
      // Redirect to the specified URL
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

          {/* Error message */}
          {error && (
            <div className="alert alert-danger text-center mb-3">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-3">Register</button>
        </form>

        <div className="text-center">
          <div className="text-center">
            <GoogleOAuthProvider clientId="932744116215-gpnj47qo47vopq9ba133ergimtoisbj6.apps.googleusercontent.com">

              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                shape="rectangular"
                theme="outline"
                text="signin_with"
                size="large"
                logo_alignment="left"
              />
            </GoogleOAuthProvider>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
