import { Navigate, Outlet } from "react-router"; // ✅ use react-router-dom, not react-router

const AdminProtectedRoute = () => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  const isAdmin = user?.isAdmin === true;

  if (!isAdmin) {
    // Redirect non-admins to admin login page
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />; // Render child admin routes
};

export default AdminProtectedRoute;
