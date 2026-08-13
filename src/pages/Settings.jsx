import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Settings() {
  const { user, updateDisplayName, logout } = useAuth()
  const [name, setName] = useState(user?.displayName || '')
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    await updateDisplayName(name)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="modal" style={{ maxWidth: '440px', margin: 0 }}>
        <h2>Your Profile</h2>
        {saved && <p className="empty-note" style={{ color: '#4A6B47', marginBottom: '12px' }}>Saved!</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Display Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={user?.email || ''} disabled />
          </label>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <button className="btn-delete" style={{ marginTop: '24px' }} onClick={logout}>
        Log Out
      </button>
    </div>
  )
}

export default Settings