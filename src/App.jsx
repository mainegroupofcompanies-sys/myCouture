import './App.css'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientDetail from './pages/ClientDetail'
import Measurements from './pages/Measurements'
import Workers from './pages/Workers'
import Orders from './pages/Orders'
import Appointments from './pages/Appointments'
import Invoices from './pages/Invoices'
import InvoiceReceipt from './pages/InvoiceReceipt'
import OrderTicket from './pages/OrderTicket'
import Login from './pages/Login'
import Settings from './pages/Settings'

function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/measurements" element={<Measurements />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/:id" element={<InvoiceReceipt />} />
          <Route path="/orders/:id/ticket" element={<OrderTicket />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}

export default App