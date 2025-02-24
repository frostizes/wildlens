import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import appleSignIn from "../assets/apple_sign_in.png";
import googleSignIn from "../assets/google_sign_in.png";
import axios from "axios"; 
import { useAuth } from "../context/AuthContext"; // ✅ Import AuthContext


function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // ✅ Get login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:54125/api/Auth/login", {
        email: email,
        password: password,
      });
      console.log("Success:", response.data.token);
      // ✅ Update global auth state
      login(response.data.token);

    }
    catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
    
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div id="login-form-container" className="p-4 border rounded shadow bg-light" >
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
          <a href="/login">
            <img src={appleSignIn} className="img-fluid mb-2" alt="Sign in with Apple" class="token-sign-in"/>
          </a>
          <a href="/login">
            <img src={googleSignIn} className="img-fluid" alt="Sign in with Google" class="token-sign-in"/>
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
