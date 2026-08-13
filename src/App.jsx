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
import OrderTicket from './pages/OrderTicket'
import Login from './pages/Login'
import Settings from './pages/Settings'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clients" element={<ProtectedRoute adminOnly><Clients /></ProtectedRoute>} />
                  <Route path="/clients/:id" element={<ProtectedRoute adminOnly><ClientDetail /></ProtectedRoute>} />
                  <Route path="/measurements" element={<ProtectedRoute adminOnly><Measurements /></ProtectedRoute>} />
                  <Route path="/workers" element={<ProtectedRoute adminOnly><Workers /></ProtectedRoute>} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/appointments" element={<ProtectedRoute adminOnly><Appointments /></ProtectedRoute>} />
                  <Route path="/invoices" element={<ProtectedRoute adminOnly><Invoices /></ProtectedRoute>} />
                  <Route path="/invoices/:id" element={<ProtectedRoute adminOnly><InvoiceReceipt /></ProtectedRoute>} />
                  <Route path="/orders/:id/ticket" element={<OrderTicket />} />
                  <Route path="/settings" element={<Settings />} />
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