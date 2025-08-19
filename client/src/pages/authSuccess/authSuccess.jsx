import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard"); // Changed from "/" to "/dashboard"
    } else {
      navigate("/login"); // fallback if no token
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
};

export default AuthSuccess;