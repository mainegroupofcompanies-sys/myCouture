import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'

function Measurements() {
  const { clients } = useData()

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Measurements</h1>
      </div>

      {clients.map((client) => (
        <div key={client.id} className="dashboard-section">
          <h2>
            <Link to={`/clients/${client.id}`} className="table-link">
              {client.name}
            </Link>{' '}
            <span className={`status-badge status-${client.gender === 'Male' ? 'ready' : 'fitting'}`}>
              {client.gender}
            </span>
          </h2>
          <div className="detail-measurements">
            {Object.entries(client.measurements).map(([key, value]) => (
              <div key={key}>
                <span className="stat-label">{key}</span>
                <p>{value}"</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Measurements