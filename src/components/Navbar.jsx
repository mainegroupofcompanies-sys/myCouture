import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-logo">myCouture</div>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/clients">Clients</Link>
        <Link to="/measurements">Measurements</Link>
        <Link to="/workers">Workers</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/invoices">Invoices</Link>
        <Link to="/settings" className="navbar-user">
          {user?.displayName || 'Settings'}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar