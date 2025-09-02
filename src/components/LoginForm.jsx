import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";
import appleSignIn from "../assets/apple_sign_in.png";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;
  const FE_BASE_URL = import.meta.env.VITE_BASE_URL;

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
      login({ userName: response.data.userName, token : response.data.token });
      navigate("/");
    } catch (error) {
      console.error("Error during Google login:", error.response?.data || error.message);
      setError(error.response?.data || error.message);
    }
  };

  // const handleLogin = async () => {
  //   try {
  //     window.location.href = `${API_BASE_URL}/api/Auth/logintest?returnUrl=${FE_BASE_URL}`;
  //     // const response = await axios.get(`${API_BASE_URL}/api/Auth/logintest?returnUrl=/`);
  //     // login(response.data.token);
  //   } catch (error) {
  //     console.error("Login failed:", error.response?.data || error.message);
  //     setError(error.message);
  //   }
  // };


  const handleGoogleLoginError = () => {
    setError("Google login failed!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Auth/login`,
        { email, password },
        { withCredentials: true }   // 👈 important
      );
      if (response.status === 200) {

        login({ userName: response.data.userName, token : response.data.token });
        navigate("/");
      }
      // login(response.data.token);

    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
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
