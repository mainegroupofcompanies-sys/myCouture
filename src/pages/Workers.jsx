import { useState } from 'react'
import { useData } from '../context/DataContext'

function Workers() {
  const { workers, addWorker, deleteWorker, orders } = useData()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [phone, setPhone] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    addWorker({ name, role, phone })
    setName('')
    setRole('')
    setPhone('')
    setShowForm(false)
  }

  function wagesOwed(workerName) {
    return orders
      .filter((o) => o.assignedWorker === workerName && o.wage && !o.wagePaid)
      .reduce((sum, o) => sum + Number(o.wage), 0)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Workers</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Worker
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Wages Owed</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => {
            const owed = wagesOwed(worker.name)
            return (
              <tr key={worker.id}>
                <td>{worker.name}</td>
                <td>{worker.role}</td>
                <td>{worker.phone}</td>
                <td>
                  <span className={owed > 0 ? 'balance-owed' : 'balance-clear'}>₵{owed}</span>
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => {
                      if (confirm(`Delete ${worker.name}?`)) deleteWorker(worker.id)
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Worker</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                Role
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Master Tailor, Seamstress"
                  required
                />
              </label>
              <label>
                Phone
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Workers