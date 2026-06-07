import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminRoutes from './AdminPanel/router'
import { BrowserRouter } from 'react-router'
import axios from "axios";

// Configure axios interceptor to automatically attach the admin token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const basename = import.meta.env.BASE_URL.replace(/\/$/, "")

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={basename || undefined}><AdminRoutes/></BrowserRouter>
)
