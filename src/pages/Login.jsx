import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { auth } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Invalid email or password.')
    }
  }
  async function handleReset() {
    if (!email) {
      setError('Enter your email above first, then click "Forgot password?"')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setResetSent(true)
      setError('')
    } catch (err) {
      setError('Could not send reset email.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">myCouture</h1>
        <h2>Log In</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit" className="btn-primary auth-submit">
            Log In
          </button>
        </form>
        {resetSent ? (
          <p className="auth-switch">Reset link sent — check your email.</p>
        ) : (
          <p className="auth-switch">
            <button
              type="button"
              onClick={handleReset}
              style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}
            >
              Forgot password?
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

export default Login