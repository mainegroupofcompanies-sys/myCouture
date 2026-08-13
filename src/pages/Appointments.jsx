import { useState } from 'react'
import { useData } from '../context/DataContext'

function Appointments() {
   const { appointments, addAppointment, deleteAppointment, clients } = useData()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '', type: '', date: '', time: '',
  })

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    addAppointment(formData)
    setFormData({ clientName: '', type: '', date: '', time: '' })
    setShowForm(false)
  }
  function sendReminder(appt) {
    const client = clients.find((c) => c.name === appt.clientName)
    if (!client || !client.phone) {
      alert('No phone number found for this client.')
      return
    }
    const cleanPhone = client.phone.replace(/[^0-9]/g, '')
    const message = `Hi ${appt.clientName}, this is a reminder for your ${appt.type} appointment at myCouture on ${new Date(
      appt.date
    ).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${appt.time}. See you then!`
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Appointments</h1>
        <div className="no-print" style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => window.print()}>
            Print Schedule
          </button>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Book Appointment
          </button>
        </div>
      </div>

      <div className="appointment-list">
        {appointments.map((appt) => (
          <div key={appt.id} className="appointment-card">
            <div className="appointment-date">
              <span className="appointment-day">
                {new Date(appt.date).toLocaleDateString('en-US', { day: 'numeric' })}
              </span>
              <span className="appointment-month">
                {new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </div>
            <div className="appointment-details">
              <h3>{appt.clientName}</h3>
              <p>{appt.type}</p>
            </div>
            <div className="appointment-time">{appt.time}</div>
            <button className="btn-secondary no-print" onClick={() => sendReminder(appt)}>
              Remind
            </button>
            <button
              className="btn-delete no-print"
              onClick={() => {
                if (confirm('Delete this appointment?')) deleteAppointment(appt.id)
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Book Appointment</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Client Name
                <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required />
              </label>
              <label>
                Type
                <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="e.g. Fitting, Consultation" required />
              </label>
              <div className="form-row">
                <label>
                  Date
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </label>
                <label>
                  Time
                  <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="e.g. 10:00 AM" required />
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments