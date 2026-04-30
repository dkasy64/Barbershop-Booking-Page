import { useEffect, useMemo, useState } from 'react'

const adminTimes = []
for (let hour = 9; hour <= 17; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const hourStr = hour.toString().padStart(2, '0')
    const minuteStr = minute.toString().padStart(2, '0')
    adminTimes.push(`${hourStr}:${minuteStr}:00`)
  }
}

const formatTime = (time) => {
  const [hour, minute] = time.split(':')
  const hourNum = parseInt(hour, 10)
  const ampm = hourNum >= 12 ? 'PM' : 'AM'
  const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12
  return `${displayHour}:${minute} ${ampm}`
}

const formatDate = (date) => new Date(date).toLocaleDateString(undefined, {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const formatBookingDate = (date) => new Date(date).toLocaleDateString()

export default function Admin() {
  const [scheduleDate, setScheduleDate] = useState('')
  const [selectedTimes, setSelectedTimes] = useState([])
  const [schedule, setSchedule] = useState([])
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const minDate = useMemo(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  }, [])

  const maxDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0]
  }, [])

  const fetchSchedule = async () => {
    const res = await fetch('http://localhost:3001/schedule')
    const data = await res.json()
    if (res.ok) {
      setSchedule(data.schedule)
    }
  }

  const fetchBookings = async () => {
    const res = await fetch('http://localhost:3001/bookings')
    const data = await res.json()
    if (res.ok) {
      setBookings(data.bookings)
    }
  }

  useEffect(() => {
    fetchSchedule()
    fetchBookings()
  }, [])

  const handleTimeToggle = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((item) => item !== time) : [...prev, time],
    )
  }

  const handleCreateSchedule = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!scheduleDate || selectedTimes.length === 0) {
      setError('Pick a date and at least one time slot.')
      return
    }

    const res = await fetch('http://localhost:3001/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule_date: scheduleDate, schedule_times: selectedTimes }),
    })
    const data = await res.json()

    if (res.ok) {
      setMessage(data.message || 'Schedule slots created successfully.')
      setSelectedTimes([])
      fetchSchedule()
    } else {
      setError(data.error || 'Failed to create schedule slots.')
    }
  }

  const handleDeleteSchedule = async (id) => {
    const res = await fetch(`http://localhost:3001/schedule/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setMessage('Schedule slot removed.')
      fetchSchedule()
    }
  }

  const handleUpdateBooking = async (id, status) => {
    const res = await fetch(`http://localhost:3001/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setMessage(`Booking ${status}.`)
      fetchBookings()
    }
  }

  return (
    <main className="section">
      <h1>Barber Admin Dashboard</h1>
      <section className="section">
        <h2>Create Upcoming Schedule</h2>
        <form onSubmit={handleCreateSchedule} className="booking-form">
          <label>
            Date
            <input
              type="date"
              value={scheduleDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              required
            />
          </label>
          <div className="time-grid">
            {adminTimes.map((time) => (
              <label key={time} className="time-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTimes.includes(time)}
                  onChange={() => handleTimeToggle(time)}
                />
                {formatTime(time)}
              </label>
            ))}
          </div>
          <button type="submit" className="button">Save Schedule</button>
        </form>
        {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      </section>

      <section className="section section-alt">
        <h2>Upcoming Schedule Slots</h2>
        {schedule.length === 0 ? (
          <p>No schedule slots yet.</p>
        ) : (
          <div className="cards">
            {schedule.map((slot) => (
              <div key={slot.id} className="card">
                <p><strong>{formatDate(slot.schedule_date)}</strong></p>
                <p>{formatTime(slot.schedule_time)}</p>
                <button className="button" type="button" onClick={() => handleDeleteSchedule(slot.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="card">
                <p><strong>ID:</strong> {booking.id}</p>
                <p><strong>Name:</strong> {booking.student_name}</p>
                <p><strong>Email:</strong> {booking.student_email}</p>
                <p><strong>Date:</strong> {formatBookingDate(booking.appointment_date)}</p>
                <p><strong>Time:</strong> {formatTime(booking.appointment_time)}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <div className="button-row">
                  <button
                    className="button"
                    type="button"
                    disabled={booking.status === 'confirmed'}
                    onClick={() => handleUpdateBooking(booking.id, 'confirmed')}
                  >
                    Confirm
                  </button>
                  <button
                    className="button"
                    type="button"
                    disabled={booking.status === 'denied'}
                    onClick={() => handleUpdateBooking(booking.id, 'denied')}
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
