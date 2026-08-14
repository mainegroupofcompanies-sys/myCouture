import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/clients', label: 'Clients' },
    { to: '/measurements', label: 'Measurements' },
    { to: '/workers', label: 'Workers' },
    { to: '/orders', label: 'Orders' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/invoices', label: 'Invoices' },
    { to: '/settings', label: user?.displayName || 'Settings', isUserLink: true },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-logo">myCouture</div>
      <div className="navbar-links">
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className={item.isUserLink ? 'navbar-user' : ''}>
            {item.label}
          </Link>
        ))}
        <button type="button" className="btn-secondary" onClick={logout} style={{ marginLeft: '12px' }}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar