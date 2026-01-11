import api from "./api";

// Register user
export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
};

// Get current user profile (for OAuth)
export const fetchUserProfile = async (token) => {
  const response = await api.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Teacher-only check (JWT auto-attached by interceptor)
export const checkTeacherAccess = async () => {
  const response = await api.get("/api/auth/teacher-only");
  return response.data;
};
