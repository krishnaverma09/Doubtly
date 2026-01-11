import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContextCreator";
import { checkTeacherAccess } from "../../services/auth.service";

const RoleCheck = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const handleCheck = async () => {
    if (!user) {
      setMessage("Not logged in");
      return;
    }

    try {
      const data = await checkTeacherAccess(user.token);
      setMessage(data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Access denied"
      );
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Role Based Access Test</h3>
      <button onClick={handleCheck}>
        Check Teacher Access
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RoleCheck;
