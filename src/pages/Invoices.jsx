import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'

function Invoices() {
  const { invoices, addInvoice, recordPayment, clients } = useData()
  const [showForm, setShowForm] = useState(false)
  const [paymentTarget, setPaymentTarget] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [formData, setFormData] = useState({
    clientName: '', garment: '', amount: '', depositPaid: '', date: '',
  })

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    addInvoice({
      clientName: formData.clientName,
      garment: formData.garment,
      amount: Number(formData.amount),
      depositPaid: Number(formData.depositPaid) || 0,
      date: formData.date,
    })
    setFormData({ clientName: '', garment: '', amount: '', depositPaid: '', date: '' })
    setShowForm(false)
  }

  function handleRecordPayment(e) {
    e.preventDefault()
    recordPayment(paymentTarget.id, Number(paymentAmount))
    setPaymentTarget(null)
    setPaymentAmount('')
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Invoices</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + New Invoice
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Client</th>
            <th>Garment</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => {
            const balance = invoice.amount - invoice.depositPaid
            return (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.clientName}</td>
                <td>{invoice.garment}</td>
                <td>₵{invoice.amount}</td>
                <td>₵{invoice.depositPaid}</td>
                <td>₵{balance}</td>
                <td>
                  <span className={`status-badge status-${invoice.status.toLowerCase()}`}>
                    {invoice.status === 'Paid' ? 'Paid 🔒' : invoice.status}
                  </span>
                </td>
                <td>{invoice.date}</td>
                <td>
                  {invoice.status !== 'Paid' && (
                    <button className="btn-secondary" onClick={() => setPaymentTarget(invoice)}>
                      Record Payment
                    </button>
                  )}
                </td>
                <td>
                  <Link to={`/invoices/${invoice.id}`} className="btn-secondary receipt-link">
                    Receipt
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>New Invoice</h2>
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
              <div className="form-row">
                <label>
                  Total Amount (₵)
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                </label>
                <label>
                  Deposit Paid (₵)
                  <input type="number" name="depositPaid" value={formData.depositPaid} onChange={handleChange} placeholder="0" />
                </label>
              </div>
              <label>
                Date
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {paymentTarget && (
        <div className="modal-overlay" onClick={() => setPaymentTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Record Payment — {paymentTarget.clientName}</h2>
            <p className="empty-note" style={{ marginBottom: '12px' }}>
              Balance remaining: ₵{paymentTarget.amount - paymentTarget.depositPaid}
            </p>
            <form onSubmit={handleRecordPayment}>
              <label>
                Payment Amount (₵)
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={paymentTarget.amount - paymentTarget.depositPaid}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setPaymentTarget(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Invoices