import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/header.css'
import './css/backgroundimage.css'
import './css/login.css'
import './css/register.css'
import './css/AnimalDetail.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter basename="/wildlens">
      <App />
    </BrowserRouter>
  </AuthProvider>,
)
