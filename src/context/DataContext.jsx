/* eslint-disable react/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore'
import { clients as initialClients } from '../data/clients'
import { orders as initialOrders } from '../data/orders'
import { appointments as initialAppointments } from '../data/appointments'
import { invoices as initialInvoices } from '../data/invoices'
import { workers as initialWorkers } from '../data/workers'
const DataContext = createContext()

export function DataProvider({ children }) {
  const [clients, setClients] = useState([])
  const [orders, setOrders] = useState([])
  const [appointments, setAppointments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function seedIfEmpty(collectionName, initialData) {
      const snapshot = await getDocs(collection(db, collectionName))
      if (snapshot.empty) {
        for (const item of initialData) {
          const { id: _id, ...rest } = item
          await addDoc(collection(db, collectionName), rest)
        }
      }
    }

    async function setup() {
      await seedIfEmpty('clients', initialClients)
      await seedIfEmpty('orders', initialOrders)
      await seedIfEmpty('appointments', initialAppointments)
      await seedIfEmpty('invoices', initialInvoices)
      await seedIfEmpty('workers', initialWorkers)
      setLoading(false)
    }

    setup()

    const unsubClients = onSnapshot(collection(db, 'clients'), (snap) => {
      setClients(snap.docs.map((d) => ({ ...d.data(), id: d.id })))
    })
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      setOrders(snap.docs.map((d) => ({ ...d.data(), id: d.id })))
    })
    const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snap) => {
      setAppointments(snap.docs.map((d) => ({ ...d.data(), id: d.id })))
    })
    const unsubInvoices = onSnapshot(collection(db, 'invoices'), (snap) => {
      setInvoices(snap.docs.map((d) => ({ ...d.data(), id: d.id })))
    })
    const unsubWorkers = onSnapshot(collection(db, 'workers'), (snap) => {
      setWorkers(snap.docs.map((d) => ({ ...d.data(), id: d.id })))
    })

    return () => {
      unsubClients()
      unsubOrders()
      unsubAppointments()
      unsubInvoices()
      unsubWorkers()
    }
  }, [])

  async function addClient(client) {
    await addDoc(collection(db, 'clients'), client)
  }

  async function addOrder(order) {
    const timestamp = new Date().toISOString()
    await addDoc(collection(db, 'orders'), {
      ...order,
      wagePaid: false,
      history: [{ status: order.status, date: timestamp }],
    })
  }

  async function addAppointment(appt) {
    await addDoc(collection(db, 'appointments'), appt)
  }

  async function addInvoice(invoice) {
    const deposit = Number(invoice.depositPaid) || 0
    const total = Number(invoice.amount) || 0
    let status = 'Pending'
    if (deposit >= total && total > 0) status = 'Paid'
    else if (deposit > 0) status = 'Partial'

    await addDoc(collection(db, 'invoices'), {
      ...invoice,
      amount: total,
      depositPaid: deposit,
      status,
    })
  }

  async function deleteClient(id) {
    await deleteDoc(doc(db, 'clients', id))
  }
  async function updateClient(id, updatedData) {
    await updateDoc(doc(db, 'clients', id), updatedData)
  }
  async function updateOrder(id, updatedData) {
    await updateDoc(doc(db, 'orders', id), updatedData)
  }

  async function updateAppointment(id, updatedData) {
    await updateDoc(doc(db, 'appointments', id), updatedData)
  }

  async function updateInvoice(id, updatedData) {
    await updateDoc(doc(db, 'invoices', id), updatedData)
  }

  async function updateWorker(id, updatedData) {
    await updateDoc(doc(db, 'workers', id), updatedData)
  }

  async function deleteOrder(id) {
    await deleteDoc(doc(db, 'orders', id))
  }

  async function deleteAppointment(id) {
    await deleteDoc(doc(db, 'appointments', id))
  }

  async function deleteInvoice(id) {
    await deleteDoc(doc(db, 'invoices', id))
  }
  async function addWorker(worker) {
    await addDoc(collection(db, 'workers'), worker)
  }

  async function deleteWorker(id) {
    await deleteDoc(doc(db, 'workers', id))
  }

  async function markWagePaid(orderId) {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return
    await updateDoc(doc(db, 'orders', orderId), { wagePaid: true })
  }

  async function updateOrderStatus(id, newStatus) {
    const order = orders.find((o) => o.id === id)
    if (!order || order.status === 'Ready') return
    const timestamp = new Date().toISOString()
    await updateDoc(doc(db, 'orders', id), {
      status: newStatus,
      history: [...(order.history || []), { status: newStatus, date: timestamp }],
    })
  }

  async function updateInvoiceStatus(id, newStatus) {
    const invoice = invoices.find((i) => i.id === id)
    if (!invoice || invoice.status === 'Paid') return
    await updateDoc(doc(db, 'invoices', id), { status: newStatus })
  }

  async function recordPayment(id, paymentAmount) {
    const invoice = invoices.find((i) => i.id === id)
    if (!invoice || invoice.status === 'Paid') return
    const newDeposit = Math.min(invoice.depositPaid + Number(paymentAmount), invoice.amount)
    const newStatus = newDeposit >= invoice.amount ? 'Paid' : 'Partial'
    await updateDoc(doc(db, 'invoices', id), { depositPaid: newDeposit, status: newStatus })
  }

  return (
    <DataContext.Provider
      value={{
        clients,
        orders,
        appointments,
        invoices,
        workers,
        loading,
        addClient,
        addOrder,
        addAppointment,
        addInvoice,
        addWorker,
        deleteClient,
        updateClient,
        updateOrder,
        updateAppointment,
        updateInvoice,
        updateWorker,
        deleteOrder,
        deleteAppointment,
        deleteInvoice,
        deleteWorker,
        updateOrderStatus,
        updateInvoiceStatus,
        recordPayment,
        markWagePaid,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}