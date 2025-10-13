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

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = getUserFromStorage();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
