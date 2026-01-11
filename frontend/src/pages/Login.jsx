import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, LogIn } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/auth.service";
import OAuthButton from "../components/auth/OAuthButton";
import "./Auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      const authUser = { ...data.user, token: data.token };
      login(authUser);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-logo">
          <div className="logo-icon">
            <BookOpen size={32} color="white" />
          </div>
        </div>
        <h1 className="auth-title">Welcome to Doubtly</h1>
        <p className="auth-subtitle">
          Join the high-energy, gamified Q&A platform designed for students and
          teachers to learn better together.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Login to continue your learning journey</p>

          {!showEmailForm ? (
            <>
              <OAuthButton preselectedRole={null} />

              <div className="divider">
                <span>OR CONTINUE WITH EMAIL</span>
              </div>

              <button
                type="button"
                className="email-toggle-btn"
                onClick={() => setShowEmailForm(true)}
              >
                Continue with Email
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email or Username</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label>Password</label>
                  <a href="#" className="forgot-link">
                    Forgot password?
                  </a>
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <button type="submit" className="submit-btn">
                Login
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => setShowEmailForm(false)}
              >
                Back to options
              </button>
            </form>
          )}

          <p className="switch-auth">
            Don't have an account?{" "}
            <Link to="/register" className="switch-link">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
