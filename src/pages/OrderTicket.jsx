import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'

function OrderTicket() {
  const { id } = useParams()
  const { orders, clients } = useData()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="page-content">
        <p>Order not found.</p>
        <Link to="/orders" className="table-link">Back to Orders</Link>
      </div>
    )
  }

  const client = clients.find((c) => c.name === order.clientName)

  return (
    <div className="page-content receipt-page">
      <div className="no-print">
        <Link to="/orders" className="back-link">&larr; Back to Orders</Link>
        <button className="btn-primary print-btn" onClick={() => window.print()}>
          Print Ticket
        </button>
      </div>

      <div className="receipt">
        <div className="receipt-header">
          <h1>myCouture</h1>
          <p>Work Ticket</p>
        </div>

        <div className="receipt-meta">
          <div>
            <span className="stat-label">Order</span>
            <p>#{order.id.toString().slice(-4)}</p>
          </div>
          <div>
            <span className="stat-label">Status</span>
            <p>{order.status}</p>
          </div>
          <div>
            <span className="stat-label">Due</span>
            <p>{order.dueDate}</p>
          </div>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-row">
          <span>Client</span>
          <span>{order.clientName}</span>
        </div>
        <div className="receipt-row">
          <span>Garment</span>
          <span>{order.garment}</span>
        </div>

        {order.image && (
          <img src={order.image} alt="Reference" className="ticket-image" />
        )}

        {(order.fabricImage || order.fabricType || order.fabricColor) && (
          <>
            <div className="receipt-divider" />
            <p className="stat-label" style={{ marginBottom: '12px' }}>Fabric</p>
            {order.fabricImage && (
              <img src={order.fabricImage} alt="Fabric" className="ticket-image" />
            )}
            <div className="receipt-row">
              <span>Type</span>
              <span>{order.fabricType || '—'}</span>
            </div>
            <div className="receipt-row">
              <span>Color</span>
              <span>{order.fabricColor || '—'}</span>
            </div>
          </>
        )}

        {(order.fabricImage || order.fabricType || order.fabricColor) && (
          <>
            <div className="receipt-divider" />
            <p className="stat-label" style={{ marginBottom: '12px' }}>Fabric</p>
            {order.fabricImage && (
              <img src={order.fabricImage} alt="Fabric" className="ticket-image" />
            )}
            <div className="receipt-row">
              <span>Type</span>
              <span>{order.fabricType || '—'}</span>
            </div>
            <div className="receipt-row">
              <span>Color</span>
              <span>{order.fabricColor || '—'}</span>
            </div>
          </>
        )}

        {(order.fabricImage || order.fabricType || order.fabricColor) && (
          <>
            <div className="receipt-divider" />
            <p className="stat-label" style={{ marginBottom: '12px' }}>Fabric</p>
            {order.fabricImage && (
              <img src={order.fabricImage} alt="Fabric" className="ticket-image" />
            )}
            <div className="receipt-row">
              <span>Type</span>
              <span>{order.fabricType || '—'}</span>
            </div>
            <div className="receipt-row">
              <span>Color</span>
              <span>{order.fabricColor || '—'}</span>
            </div>
          </>
        )}

        {client && (
          <>
            <div className="receipt-divider" />
            <p className="stat-label" style={{ marginBottom: '12px' }}>Measurements</p>
            <div className="detail-measurements" style={{ marginBottom: 0 }}>
              {Object.entries(client.measurements).map(([key, value]) => (
                <div key={key}>
                  <span className="stat-label">{key}</span>
                  <p>{value}"</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderTicket