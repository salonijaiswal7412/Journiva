import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      navigate("/login"); // fallback if no token
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default AuthSuccess;
