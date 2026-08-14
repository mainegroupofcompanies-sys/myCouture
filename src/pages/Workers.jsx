import { useState } from 'react'
import { useData } from '../context/DataContext'
import { secondaryAuth, auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

function Workers() {
  const { workers, addWorker, deleteWorker, updateWorker, orders } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (editingId) {
      updateWorker(editingId, { name, role, phone })
      closeForm()
      return
    }

    setSaving(true)
    try {
      const result = await createUserWithEmailAndPassword(secondaryAuth, email, password)
      await updateProfile(result.user, { displayName: name })
      await setDoc(doc(db, 'users', result.user.uid), { name, role: 'worker' })
      await signOut(secondaryAuth)
      await addWorker({ name, role, phone, email })
      closeForm()
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('That email is already registered.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else {
        setError('Could not create login. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  function startEdit(worker) {
    setEditingId(worker.id)
    setName(worker.name)
    setRole(worker.role)
    setPhone(worker.phone)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setName('')
    setRole('')
    setPhone('')
    setEmail('')
    setPassword('')
    setError('')
  }

  async function handleResetPassword(worker) {
    if (!worker.email) {
      alert('No email on file for this worker.')
      return
    }
    try {
      await sendPasswordResetEmail(auth, worker.email)
      alert(`Password reset email sent to ${worker.email}`)
    } catch (err) {
      alert('Could not send reset email.')
    }
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
            <th>Email</th>
            <th>Wages Owed</th>
            <th></th>
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
                <td>{worker.email || <span className="empty-note">—</span>}</td>
                <td>
                  <span className={owed > 0 ? 'balance-owed' : 'balance-clear'}>₵{owed}</span>
                </td>
                <td>
                  <button className="btn-secondary" onClick={() => startEdit(worker)} style={{ marginRight: '8px' }}>
                    Edit
                  </button>
                  {worker.email && (
                    <button className="btn-secondary" onClick={() => handleResetPassword(worker)}>
                      Reset Password
                    </button>
                  )}
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
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Worker' : 'Add Worker'}</h2>
            {error && <p className="auth-error">{error}</p>}
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

              {!editingId && (
                <>
                  <label>
                    Login Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </label>
                  <label>
                    Temporary Password
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </label>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Creating...' : editingId ? 'Update Worker' : 'Save Worker'}
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