import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminRoutes from './AdminPanel/router'
import { BrowserRouter } from 'react-router'

const basename = import.meta.env.BASE_URL.replace(/\/$/, "")

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={basename || undefined}><AdminRoutes/></BrowserRouter>
)
