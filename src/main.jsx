import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/header.css'
import './css/backgroundimage.css'
import './css/login.css'
import './css/register.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
