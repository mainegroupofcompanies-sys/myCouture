import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCxe8_i4NLiqIg7GVESSybxEWI0CNqFTrs",
  authDomain: "mycouture-54f0f.firebaseapp.com",
  projectId: "mycouture-54f0f",
  storageBucket: "mycouture-54f0f.firebasestorage.app",
  messagingSenderId: "474539756211",
  appId: "1:474539756211:web:66e5e9453bdd435a553ec6",
  measurementId: "G-3BD7415SQF"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Secondary app instance, used only for creating worker accounts
// without logging the admin out of their own session
const secondaryApp = initializeApp(firebaseConfig, 'Secondary')
export const secondaryAuth = getAuth(secondaryApp)