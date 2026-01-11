import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, GraduationCap, Briefcase, UserPlus } from "lucide-react";
import { registerUser } from "../services/auth.service";
import OAuthButton from "../components/auth/OAuthButton";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
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
          <h2 className="form-title">Create Account</h2>
          <p className="form-subtitle">Choose your role to get started</p>

          {!showEmailForm ? (
            <>
              <div className="role-cards">
                <div
                  className={`role-card ${
                    formData.role === "student" ? "active" : ""
                  }`}
                  onClick={() => handleRoleSelect("student")}
                >
                  <div className="role-icon">
                    <GraduationCap size={44} />
                  </div>
                  <div className="role-name">Student</div>
                </div>
                <div
                  className={`role-card ${
                    formData.role === "teacher" ? "active" : ""
                  }`}
                  onClick={() => handleRoleSelect("teacher")}
                >
                  <div className="role-icon">
                    <Briefcase size={44} />
                  </div>
                  <div className="role-name">Teacher</div>
                </div>
              </div>

              <OAuthButton preselectedRole={formData.role} />

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
                <label>Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
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
                <label>Password</label>
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

              <div className="form-group">
                <label>Role</label>
                <div className="role-select-inline">
                  <button
                    type="button"
                    className={`role-btn ${
                      formData.role === "student" ? "active" : ""
                    }`}
                    onClick={() => handleRoleSelect("student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${
                      formData.role === "teacher" ? "active" : ""
                    }`}
                    onClick={() => handleRoleSelect("teacher")}
                  >
                    Teacher
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Register
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
            Already have an account?{" "}
            <Link to="/login" className="switch-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
