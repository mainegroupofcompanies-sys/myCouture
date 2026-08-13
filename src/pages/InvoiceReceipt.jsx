import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'

function InvoiceReceipt() {
  const { id } = useParams()
  const { invoices } = useData()
  const { user } = useAuth()
  const invoice = invoices.find((inv) => inv.id === id)

  if (!invoice) {
    return (
      <div className="page-content">
        <p>Invoice not found.</p>
        <Link to="/invoices" className="table-link">Back to Invoices</Link>
      </div>
    )
  }

  return (
    <div className="page-content receipt-page">
      <div className="no-print">
        <Link to="/invoices" className="back-link">&larr; Back to Invoices</Link>
        <button className="btn-primary print-btn" onClick={() => window.print()}>
          Print Receipt
        </button>
      </div>

      <div className="receipt">
        <div className="receipt-header">
          <h1>myCouture</h1>
          <p>Tailoring &amp; Alterations</p>
        </div>

        <div className="receipt-meta">
          <div>
            <span className="stat-label">Invoice</span>
            <p>{invoice.id}</p>
          </div>
          <div>
            <span className="stat-label">Date</span>
            <p>{invoice.date}</p>
          </div>
          <div>
            <span className="stat-label">Status</span>
            <p>{invoice.status}</p>
          </div>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-row">
          <span>Client</span>
          <span>{invoice.clientName}</span>
        </div>
        <div className="receipt-row">
          <span>Garment</span>
          <span>{invoice.garment}</span>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-row">
          <span>Total</span>
          <span>₵{invoice.amount}</span>
        </div>
        <div className="receipt-row">
          <span>Paid</span>
          <span>₵{invoice.depositPaid}</span>
        </div>
        <div className="receipt-row receipt-total">
          <span>Balance Due</span>
          <span>₵{invoice.amount - invoice.depositPaid}</span>
        </div>

        <p className="receipt-prepared-by">Prepared by {user?.displayName || 'myCouture Staff'}</p>
        <p className="receipt-footer">Thank you for choosing myCouture.</p>
      </div>
    </div>
  )
}

export default InvoiceReceipt