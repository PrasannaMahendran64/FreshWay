import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import Routers from './Components/Routers.jsx'
import { AuthProvider } from './Components/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
  <AuthProvider><Routers/></AuthProvider>
  
  
  </BrowserRouter>
)
