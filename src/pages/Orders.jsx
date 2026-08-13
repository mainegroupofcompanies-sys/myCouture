import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useData } from '../context/DataContext'

function Orders() {
  const [historyTarget, setHistoryTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const { orders, addOrder, deleteOrder, updateOrderStatus, clients, addInvoice, invoices, workers, markWagePaid } = useData()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '', garment: '', amount: '', status: 'Measuring', dueDate: '', image: '',
    fabricImage: '', fabricType: '', fabricColor: '', assignedWorker: '', wage: '',
  })

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }
  function handleFabricImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, fabricImage: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    addOrder({ ...formData, amount: Number(formData.amount), wage: Number(formData.wage) || 0 })
    setFormData({
      clientName: '', garment: '', amount: '', status: 'Measuring', dueDate: '', image: '',
      fabricImage: '', fabricType: '', fabricColor: '', assignedWorker: '', wage: '',
    })
    setShowForm(false)
  }

  function createInvoiceFromOrder(order) {
    const alreadyInvoiced = invoices.some(
      (inv) => inv.clientName === order.clientName && inv.garment === order.garment && inv.amount === order.amount
    )
    if (alreadyInvoiced) {
      alert('An invoice for this order already exists.')
      return
    }
    addInvoice({
      clientName: order.clientName,
      garment: order.garment,
      amount: order.amount,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    })
    alert(`Invoice created for ${order.clientName} — ₵${order.amount}`)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + New Order
        </button>
      </div>
      <div className="filter-row">
        <input
          type="text"
          className="search-bar"
          placeholder="Search by client or garment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="All">All Statuses</option>
          <option value="Measuring">Measuring</option>
          <option value="Cutting">Cutting</option>
          <option value="Fitting">Fitting</option>
          <option value="Ready">Ready</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Client</th>
            <th>Garment</th>
            <th>Reference</th>
            <th>Fabric</th>
            <th>Amount</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Due Date</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders
            .filter(
              (order) =>
                (statusFilter === 'All' || order.status === statusFilter) &&
                (order.clientName.toLowerCase().includes(search.toLowerCase()) ||
                  order.garment.toLowerCase().includes(search.toLowerCase()))
            )
            .map((order) => (
              <tr key={order.id}>
                <td>
                  <button className="table-link-btn" onClick={() => setHistoryTarget(order)}>
                    #{order.id.toString().slice(-4)}
                  </button>
                </td>
                <td>{order.clientName}</td>
                <td>{order.garment}</td>
                <td>
                {order.image ? (
                  <img src={order.image} alt="Reference" className="order-thumb" />
                ) : (
                  <span className="empty-note">—</span>
                )}
              </td>
              <td>
                {order.fabricImage ? (
                  <img src={order.fabricImage} alt="Fabric" className="order-thumb" title={`${order.fabricType || ''} ${order.fabricColor || ''}`} />
                ) : (
                  <span className="empty-note">—</span>
                )}
              </td>
              <td>₵{order.amount}</td>
              <td>
                {order.assignedWorker ? (
                  <div>
                    <div>{order.assignedWorker}</div>
                    {order.wage > 0 && (
                      <div className="empty-note">
                        ₵{order.wage} wage {order.wagePaid ? '(paid)' : '(unpaid)'}
                        {!order.wagePaid && (
                          <button
                            className="table-link-btn"
                            style={{ marginLeft: '8px' }}
                            onClick={() => markWagePaid(order.id)}
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="empty-note">—</span>
                )}
              </td>
              <td>
                {order.status === 'Ready' ? (
                    <span className="status-badge status-ready">Ready 🔒</span>
                  ) : (
                    <select
                      className={`status-select status-${order.status.toLowerCase()}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="Measuring">Measuring</option>
                      <option value="Cutting">Cutting</option>
                      <option value="Fitting">Fitting</option>
                      <option value="Ready">Ready</option>
                    </select>
                  )}
                </td>
                <td>{order.dueDate}</td>
                <td>
                  <Link to={`/orders/${order.id}/ticket`} className="btn-secondary receipt-link">
                    Ticket
                  </Link>
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => {
                      if (confirm('Delete this order?')) deleteOrder(order.id)
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {historyTarget && (
        <div className="modal-overlay" onClick={() => setHistoryTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Order History — {historyTarget.clientName}</h2>
            <p className="empty-note" style={{ marginBottom: '16px' }}>
              {historyTarget.garment}
            </p>
            <div className="timeline">
              {(historyTarget.history || []).map((entry, i) => (
                <div key={i} className="timeline-entry">
                  <div className="timeline-dot" />
                  <div>
                    <span className={`status-badge status-${entry.status.toLowerCase()}`}>
                      {entry.status}
                    </span>
                    <p className="timeline-date">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setHistoryTarget(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>New Order</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Client
                <select name="clientName" value={formData.clientName} onChange={handleChange} required>
                  <option value="">Select a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Garment
                <input type="text" name="garment" value={formData.garment} onChange={handleChange} required />
              </label>
              <label>
                Amount (₵)
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
              </label>
              <label>
                Amount (₵)
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
              </label>
              <div className="form-row">
                <label>
                  Assigned To
                  <select name="assignedWorker" value={formData.assignedWorker} onChange={handleChange}>
                    <option value="">Unassigned</option>
                    {workers.map((worker) => (
                      <option key={worker.id} value={worker.name}>
                        {worker.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Worker Wage (₵)
                  <input type="number" name="wage" value={formData.wage} onChange={handleChange} placeholder="0" />
                </label>
              </div>
              <label>
                Reference Picture
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
              {formData.image && (
                <img src={formData.image} alt="Preview" className="image-preview" />
              )}
              <label>
                Fabric Photo
                <input type="file" accept="image/*" capture="environment" onChange={handleFabricImageChange} />
              </label>
              {formData.fabricImage && (
                <img src={formData.fabricImage} alt="Fabric Preview" className="image-preview" />
              )}
              <div className="form-row">
                <label>
                  Fabric Type
                  <input
                    type="text"
                    name="fabricType"
                    value={formData.fabricType}
                    onChange={handleChange}
                    placeholder="e.g. Kente, Lace, Cotton"
                  />
                </label>
                <label>
                  Fabric Color
                  <input
                    type="text"
                    name="fabricColor"
                    value={formData.fabricColor}
                    onChange={handleChange}
                    placeholder="e.g. Royal Blue"
                  />
                </label>
              </div>
              <label>
                Status
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Measuring">Measuring</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Fitting">Fitting</option>
                  <option value="Ready">Ready</option>
                </select>
              </label>
              <label>
                Due Date
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders