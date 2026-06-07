import { Navigate, useLocation } from "react-router";

export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!userStr || !token) return null;
    const user = JSON.parse(userStr);
    if (!user?._id) return null;
    return user;
  } catch (err) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
};

import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
