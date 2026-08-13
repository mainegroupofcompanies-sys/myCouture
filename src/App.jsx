import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Login from './pages/Login'
import Register from './pages/Register'
import Settings from './pages/Settings'
import OrderTicket from './pages/OrderTicket'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:id" element={<ClientDetail />} />
                <Route path="/measurements" element={<Measurements />} />
                <Route path="/workers" element={<Workers />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/invoices/:id" element={<InvoiceReceipt />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/orders/:id/ticket" element={<OrderTicket />} />
              </Routes>
            </>
          </ProtectedRoute>
        }
      />
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