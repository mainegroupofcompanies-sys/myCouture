import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'

function ClientDetail() {
  const { id } = useParams()
  const { clients, orders, appointments, invoices } = useData()

  const client = clients.find((c) => c.id.toString() === id)

  if (!client) {
    return (
      <div className="page-content">
        <p>Client not found.</p>
        <Link to="/clients" className="table-link">Back to Clients</Link>
      </div>
    )
  }

  const clientOrders = orders.filter((o) => o.clientName === client.name)
  const clientAppointments = appointments.filter((a) => a.clientName === client.name)
  const clientInvoices = invoices.filter((i) => i.clientName === client.name)
  const totalOwed = clientInvoices.reduce((sum, inv) => sum + (inv.amount - inv.depositPaid), 0)

  return (
    <div className="page-content">
      <div className="no-print">
        <Link to="/clients" className="back-link">&larr; Back to Clients</Link>
      </div>

      <div className="page-header">
        <h1>{client.name}</h1>
        <button className="btn-primary no-print" onClick={() => window.print()}>
          Print Profile
        </button>
      </div>

      <div className="detail-measurements">
        <div>
          <span className="stat-label">Phone</span>
          <p>{client.phone}</p>
        </div>
        <div>
          <span className="stat-label">Gender</span>
          <p>{client.gender}</p>
        </div>
        <div>
          <span className="stat-label">Outstanding Balance</span>
          <p className={totalOwed > 0 ? 'balance-owed' : 'balance-clear'}>₵{totalOwed}</p>
        </div>
        {Object.entries(client.measurements).map(([key, value]) => (
          <div key={key}>
            <span className="stat-label">{key}</span>
            <p>{value}"</p>
          </div>
        ))}
      </div>

      <div className="dashboard-section no-print">
        <h2>Orders</h2>
        {clientOrders.length === 0 ? (
          <p className="empty-note">No orders yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Garment</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {clientOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.toString().slice(-4)}</td>
                  <td>{order.garment}</td>
                  <td>
                    {order.image ? (
                      <img src={order.image} alt="Reference" className="order-thumb" />
                    ) : (
                      <span className="empty-note">—</span>
                    )}
                  </td>
                  <td>₵{order.amount}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Appointments</h2>
        {clientAppointments.length === 0 ? (
          <p className="empty-note">No appointments yet.</p>
        ) : (
          <div className="appointment-list">
            {clientAppointments.map((appt) => (
              <div key={appt.id} className="appointment-card">
                <div className="appointment-date">
                  <span className="appointment-day">
                    {new Date(appt.date).toLocaleDateString('en-US', { day: 'numeric' })}
                  </span>
                  <span className="appointment-month">
                    {new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>
                <div className="appointment-details">
                  <h3>{appt.type}</h3>
                </div>
                <div className="appointment-time">{appt.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Invoices</h2>
        {clientInvoices.length === 0 ? (
          <p className="empty-note">No invoices yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Garment</th>
                <th>Total</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {clientInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.garment}</td>
                  <td>₵{invoice.amount}</td>
                  <td>₵{invoice.amount - invoice.depositPaid}</td>
                  <td>
                    <span className={`status-badge status-${invoice.status.toLowerCase()}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>{invoice.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ClientDetail