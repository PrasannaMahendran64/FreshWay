import { Routes, Route } from "react-router"; // ✅ use react-router-dom
import Layoutadmin from "./Component/layoutadmin";
import Dashboard from "./Dashboard";
import Users from "./User";
import ProductsPage from "./product";
import OrdersPage from "./order";
import CategoriesPage from "./categories";
import ReviewsPage from "./review";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLoginPage from "./adminlogin";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public route for admin login */}
      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/dashboard" element={<Layoutadmin />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
