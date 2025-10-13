import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminRoutes from './AdminPanel/router'
import { BrowserRouter } from 'react-router'


createRoot(document.getElementById('root')).render(
  <BrowserRouter><AdminRoutes/></BrowserRouter>
)
