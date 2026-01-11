import { useContext } from "react";
import { AuthContext } from "../context/AuthContextCreator";

const useAuth = () => {
  const { user, login, logout } = useContext(AuthContext);

  const isAuthenticated = !!user;
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  return {
    user,
    login,
    logout,
    isAuthenticated,
    isTeacher,
    isStudent,
  };
};

export default useAuth;
