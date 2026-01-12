import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchUserProfile } from "../services/auth.service";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login({ ...user, token });
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Failed to parse user data", error);
        navigate("/login", { replace: true });
      }
    } else if (token) {
     
      fetchUserProfile(token)
        .then((user) => {
          login({ ...user, token });
          navigate("/dashboard", { replace: true });
        })
        .catch(() => {
          navigate("/login", { replace: true });
        });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, login]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Logging you in...</h2>
      <p>Please wait while we complete your authentication.</p>
    </div>
  );
};

export default OAuthSuccess;
