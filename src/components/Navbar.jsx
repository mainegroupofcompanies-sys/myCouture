import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, role, logout } = useAuth()
  const isAdmin = role === 'admin'
  const location = useLocation()
  const navigate = useNavigate()

  function isActive(path) {
    return location.pathname === path
  }

  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate('/login')
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">myCouture</div>

      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
        <NavLink to="/clients" className={({ isActive }) => (isActive ? 'active' : '')}>Clients</NavLink>
        <NavLink to="/measurements" className={({ isActive }) => (isActive ? 'active' : '')}>Measurements</NavLink>
        {isAdmin && <NavLink to="/workers" className={({ isActive }) => (isActive ? 'active' : '')}>Workers</NavLink>}
        <NavLink to="/orders" className={({ isActive }) => (isActive ? 'active' : '')}>Orders</NavLink>
        <NavLink to="/appointments" className={({ isActive }) => (isActive ? 'active' : '')}>Appointments</NavLink>
        <NavLink to="/invoices" className={({ isActive }) => (isActive ? 'active' : '')}>Invoices</NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>Settings</NavLink>
      </div>

      <div className="navbar-footer">
        {user ? (
          <>
            <div className={`sidebar-user ${isActive('/settings') ? 'active' : ''}`}>{user.displayName || 'User'}</div>
            <button className="sidebar-logout" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <div className="auth-links">
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Log In</NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>Register</NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar