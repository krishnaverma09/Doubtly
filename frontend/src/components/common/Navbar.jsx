import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, Bell, Zap } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/dashboard" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '20px', textDecoration: 'none' }}>
          <div style={{ background: 'var(--primary-color)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: '900', fontSize: '1.2rem' }}>D</span>
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1a1e26' }}>Doubtly</span>
        </NavLink>
        
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
      </div>

      <div className="nav-right">
        <div className="user-profile">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
        </div>

        <button 
          onClick={handleLogout}
          className="logout-minimal"
          title="Logout"
          style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '10px' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
