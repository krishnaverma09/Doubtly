import React, { useState } from "react";

const OAuthButton = ({ preselectedRole }) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(preselectedRole || "student");

  const handleGoogleLogin = () => {
    if (preselectedRole) {
      // If role is already selected (from Register page dropdown), use it
      redirectToGoogle(preselectedRole);
    } else {
      // Show modal to select role
      setShowRoleModal(true);
    }
  };

  const redirectToGoogle = (role) => {
    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
    window.location.href = `${baseUrl}?role=${role}`;
  };

  const handleRoleSelection = () => {
    setShowRoleModal(false);
    redirectToGoogle(selectedRole);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleLogin}
        style={{
          backgroundColor: "#DB4437",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
          width: "100%",
          fontWeight: "bold",
        }}
      >
        {preselectedRole ? `Sign up with Google as ${preselectedRole}` : "Continue with Google"}
      </button>

      {showRoleModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowRoleModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Select Your Role</h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Are you signing in as a student or teacher?
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={selectedRole === "student"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                Student
              </label>
              <label style={{ display: "block", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={selectedRole === "teacher"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                Teacher
              </label>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleRoleSelection}
                style={{
                  flex: 1,
                  backgroundColor: "#DB4437",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Continue
              </button>
              <button
                onClick={() => setShowRoleModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#ccc",
                  color: "#333",
                  border: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OAuthButton;
