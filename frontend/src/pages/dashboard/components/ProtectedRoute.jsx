import { useUser } from "@clerk/react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <p>Loading authentication...</p>;

  if (!isSignedIn) {
    return (
      <Navigate
        to="/"
        replace
        state={{ unauthorized: true }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
