import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'

const MALE_FIELDS = [
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'sleeve', label: 'Sleeve Length' },
  { key: 'inseam', label: 'Inseam' },
  { key: 'neck', label: 'Neck' },
  { key: 'arm', label: 'Arm Hole' },
  { key: 'thigh', label: 'Thigh' },
  { key: 'ankle', label: 'Ankle' },
  { key: 'shirt', label: 'Shirt Lenght' },
  { key: 'knee', label: 'Knee' },
  { key: 'seat', label: 'Seat' },
]

const FEMALE_FIELDS = [
  { key: 'bust', label: 'Bust' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'shoulderToUnderBust', label: 'Shoulder To Under Bust' },
  { key: 'sleeve', label: 'Sleeve Length' },
  { key: 'UnderBust', label: 'Under Bust' },
  { key: 'neck', label: 'Neck' },
  { key: 'accrossBack', label: 'Accross Back' },
  { key: 'armHole', label: 'Arm Hole' },
  { key: 'aroundArm', label: 'Around Arm' },
  { key: 'shoulderToNipple', label: 'Shoulder To Nipple' },
  { key: 'dressLength', label: 'Dress Length' },
  { key: 'wraist', label: 'Wraist' },
  { key: 'vNeckCut', label: 'V Neck Cut' },
  { key: 'shoulderToWaist', label: 'Shoulder To Waist' },
  { key: 'waistToAboveKnee', label: 'Waist To Above Knee' },
  { key: 'topLength', label: 'Top Length' },
  { key: 'slitLength', label: 'Slit Length' },
  { key: 'knee', label: 'Knee' },
  { key: 'thigh', label: 'Thigh' },
  { key: 'trouserLength', label: 'Trouser Length' },
  { key: 'shirtLength', label: 'Shirt Length' },
]

function Clients() {
  const { clients, addClient, deleteClient, updateClient, invoices } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [gender, setGender] = useState('Female')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [measurements, setMeasurements] = useState({})
  const [search, setSearch] = useState('')

  const fields = gender === 'Male' ? MALE_FIELDS : FEMALE_FIELDS

  function handleGenderChange(e) {
    setGender(e.target.value)
    setMeasurements({})
  }

  function handleMeasurementChange(e) {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      updateClient(editingId, { name, phone, gender, measurements })
    } else {
      addClient({ name, phone, gender, measurements })
    }
    setName('')
    setPhone('')
    setMeasurements({})
    setGender('Female')
    setEditingId(null)
    setShowForm(false)
  }

  function startEdit(client) {
    setEditingId(client.id)
    setName(client.name)
    setPhone(client.phone)
    setGender(client.gender)
    setMeasurements(client.measurements)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setName('')
    setPhone('')
    setMeasurements({})
    setGender('Female')
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Clients</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Client
        </button>
      </div>
      <input
        type="text"
        className="search-bar"
        placeholder="Search clients by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Balance Owed</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clients
            .filter(
              (client) =>
                client.name.toLowerCase().includes(search.toLowerCase()) ||
                client.phone.includes(search)
            )
            .map((client) => (
            <tr key={client.id}>
              <td>
                <Link to={`/clients/${client.id}`} className="table-link">
                  {client.name}
                </Link>
              </td>
              <td>{client.phone}</td>
              <td>{client.gender}</td>
              <td>
                {(() => {
                  const owed = invoices
                    .filter((inv) => inv.clientName === client.name)
                    .reduce((sum, inv) => sum + (inv.amount - inv.depositPaid), 0)
                  return <span className={owed > 0 ? 'balance-owed' : 'balance-clear'}>₵{owed}</span>
                })()}
              </td>
              <td>
                <button className="btn-secondary" onClick={() => startEdit(client)} style={{ marginRight: '8px' }}>
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => {
                    if (confirm(`Delete ${client.name}?`)) deleteClient(client.id)
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Client' : 'Add Client'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                Phone
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label>
                Gender
                <select value={gender} onChange={handleGenderChange}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </label>

              <div className="measurements-grid">
                {fields.map((field) => (
                  <label key={field.key}>
                    {field.label}
                    <input
                      type="number"
                      name={field.key}
                      value={measurements[field.key] || ''}
                      onChange={handleMeasurementChange}
                    />
                  </label>
                ))}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update Client' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients