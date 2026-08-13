/* eslint-disable react/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        setRole(userDoc.exists() ? userDoc.data().role : 'worker')
      } else {
        setRole(null)
      }
      setAuthLoading(false)
    })
    return unsubscribe
  }, [])

  async function register(email, password, name) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    setUser({ ...result.user, displayName: name })
  }

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    await signOut(auth)
  }

  async function updateDisplayName(name) {
    await updateProfile(auth.currentUser, { displayName: name })
    setUser({ ...auth.currentUser, displayName: name })
  }

  return (
    <AuthContext.Provider value={{ user, role, authLoading, register, login, logout, updateDisplayName }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}