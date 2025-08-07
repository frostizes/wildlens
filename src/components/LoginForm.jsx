import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";
import appleSignIn from "../assets/apple_sign_in.png";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

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
        window.location.href = `${window.location.origin}/wildlens/catalog`;
      }
    } catch (error) {
      console.error("Error during Google login:", error.response?.data || error.message);
      setError(error.response?.data || error.message);
    }
  };

  const handleGoogleLoginError = () => {
    setError("Google login failed!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Auth/login`, {
        email,
        password,
      });
      // login(response.data.token);
      localStorage.setItem("authToken", response.data.token); // Save token to localStorage
      localStorage.setItem("userName", response.data.userName); // Save token to localStorage
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div id="login-form-container" className="p-4 border rounded shadow bg-light">
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
        </form>

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
        {error && (
          <div className="alert alert-danger text-center mb-3 mt-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
