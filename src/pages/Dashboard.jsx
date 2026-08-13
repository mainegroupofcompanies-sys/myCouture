import { useData } from '../context/DataContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function Dashboard() {
  const { clients, orders, appointments, invoices } = useData()
  const pendingOrders = orders.filter((o) => o.status !== 'Ready')
  const pendingInvoices = invoices.filter((i) => i.status !== 'Paid')
  const totalPending = pendingInvoices.reduce((sum, i) => sum + (i.amount - i.depositPaid), 0)
  const paidInvoices = invoices.filter((i) => i.status === 'Paid')
  const revenueByMonth = {}
  paidInvoices.forEach((invoice) => {
    const month = new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    revenueByMonth[month] = (revenueByMonth[month] || 0) + invoice.amount
  })
  const chartData = Object.entries(revenueByMonth).map(([month, total]) => ({ month, total }))
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaysAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.date)
    apptDate.setHours(0, 0, 0, 0)
    return apptDate.getTime() === today.getTime()
  })

  const overdueOrders = pendingOrders.filter((order) => {
    const due = new Date(order.dueDate)
    due.setHours(0, 0, 0, 0)
    return due < today
  })

  const dueSoonOrders = pendingOrders.filter((order) => {
    const due = new Date(order.dueDate)
    due.setHours(0, 0, 0, 0)
    const diffDays = (due - today) / (1000 * 60 * 60 * 24)
    return diffDays >= 0 && diffDays <= 3
  })

  const hasAlerts = todaysAppointments.length > 0 || overdueOrders.length > 0 || dueSoonOrders.length > 0

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      {hasAlerts && (
        <div className="alert-banner">
          {overdueOrders.length > 0 && (
            <div className="alert-item alert-overdue">
              <strong>{overdueOrders.length}</strong> order{overdueOrders.length > 1 ? 's' : ''} overdue:{' '}
              {overdueOrders.map((o) => `${o.clientName} (${o.garment})`).join(', ')}
            </div>
          )}
          {dueSoonOrders.length > 0 && (
            <div className="alert-item alert-due-soon">
              <strong>{dueSoonOrders.length}</strong> order{dueSoonOrders.length > 1 ? 's' : ''} due within 3 days:{' '}
              {dueSoonOrders.map((o) => `${o.clientName} (${o.garment})`).join(', ')}
            </div>
          )}
          {todaysAppointments.length > 0 && (
            <div className="alert-item alert-today">
              <strong>{todaysAppointments.length}</strong> appointment{todaysAppointments.length > 1 ? 's' : ''} today:{' '}
              {todaysAppointments.map((a) => `${a.clientName} (${a.time})`).join(', ')}
            </div>
          )}
        </div>
      )}

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-number">{clients.length}</span>
          <span className="stat-label">Clients</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{pendingOrders.length}</span>
          <span className="stat-label">Orders In Progress</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{appointments.length}</span>
          <span className="stat-label">Upcoming Appointments</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">₵{totalPending}</span>
          <span className="stat-label">Pending Payments</span>
        </div>
        <div className="dashboard-section">
        <h2>Revenue</h2>
        {chartData.length === 0 ? (
          <p className="empty-note">No paid invoices yet.</p>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#8A7F6D' }}
                  axisLine={{ stroke: '#E4DFD5' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#8A7F6D' }}
                  axisLine={{ stroke: '#E4DFD5' }}
                  tickLine={false}
                  tickFormatter={(value) => `₵${value}`}
                />
                <Tooltip
                  formatter={(value) => [`₵${value}`, 'Revenue']}
                  contentStyle={{ background: '#FFFEFC', border: '1px solid #E4DFD5', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}
                />
                <Bar dataKey="total" fill="#B8935F" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      </div>

      <div className="dashboard-section">
        <h2>Upcoming Appointments</h2>
        <div className="appointment-list">
          {appointments.slice(0, 3).map((appt) => (
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
                <h3>{appt.clientName}</h3>
                <p>{appt.type}</p>
              </div>
              <div className="appointment-time">{appt.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Orders In Progress</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Client</th>
              <th>Garment</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id.toString().slice(-4)}</td>
                <td>{order.clientName}</td>
                <td>{order.garment}</td>
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
      </div>
    </div>
  )
}

export default Dashboard