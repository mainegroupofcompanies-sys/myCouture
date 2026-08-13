import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Sidebar() {
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
    <nav className="sidebar">
      <div className="sidebar-logo">myCouture</div>

      <div className="sidebar-links">
        <Link to="/" className={isActive('/') ? 'active' : ''}>Dashboard</Link>
        {isAdmin && <Link to="/clients" className={isActive('/clients') ? 'active' : ''}>Clients</Link>}
        {isAdmin && <Link to="/measurements" className={isActive('/measurements') ? 'active' : ''}>Measurements</Link>}
        {isAdmin && <Link to="/workers" className={isActive('/workers') ? 'active' : ''}>Workers</Link>}
        <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>Orders</Link>
        {isAdmin && <Link to="/appointments" className={isActive('/appointments') ? 'active' : ''}>Appointments</Link>}
        {isAdmin && <Link to="/invoices" className={isActive('/invoices') ? 'active' : ''}>Invoices</Link>}
        <Link to="/settings" className={isActive('/settings') ? 'active' : ''}>Settings</Link>
      </div>

      <div className="sidebar-footer">
        {user ? (
          <>
            <div className={`sidebar-user ${isActive('/settings') ? 'active' : ''}`}>{user.displayName || 'User'}</div>
            <button className="sidebar-logout" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className={isActive('/login') ? 'active' : ''}>Log In</Link>
            <Link to="/register" className={isActive('/register') ? 'active' : ''}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Sidebar
