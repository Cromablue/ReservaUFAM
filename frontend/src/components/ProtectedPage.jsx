import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedPage = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <>
      <Header />
      {children}
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedPage;
