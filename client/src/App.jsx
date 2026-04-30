import { useEffect, useMemo, useState } from 'react'
import NavBar from './components/NavBar'
import taperImg from './assets/taper.jpeg'
import beardImg from './assets/beard.jpeg'
import shapeUpImg from './assets/shapeUp.jpeg'
import villageImg from './assets/village.jpg'
import instagramIcon from './assets/instagram.png'
import linkedinIcon from './assets/linkden.png'
import villImg from './assets/vill.jpg'
 
const formatTime = (timeString) => {
  const [hourStr, minute] = timeString.split(':')
  const hour = parseInt(hourStr, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${minute} ${ampm}`
}
 
// Normalize any date value (ISO string or plain) to YYYY-MM-DD
const normalizeDate = (dateVal) => {
  if (!dateVal) return ''
  // If it's already YYYY-MM-DD, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) return dateVal
  // Otherwise parse and extract the date portion using UTC to avoid timezone shifts
  const d = new Date(dateVal)
  return d.toISOString().split('T')[0]
}
 
export default function App() {
  const [schedule, setSchedule] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(null)
  const [statusEmail, setStatusEmail] = useState('')
  const [statusId, setStatusId] = useState('')
  const [statusResults, setStatusResults] = useState([])
  const [statusError, setStatusError] = useState('')
 
  useEffect(() => {
    const loadSchedule = async () => {
      const response = await fetch('http://localhost:3001/schedule')
      const data = await response.json()
      if (response.ok) setSchedule(data.schedule)
    }
    loadSchedule()
  }, [])
 
  const availableDates = useMemo(() => {
    // Normalize all dates and deduplicate
    return [...new Set(schedule.map((slot) => normalizeDate(slot.schedule_date)))]
  }, [schedule])
 
  const availableTimes = useMemo(() => {
    return schedule
      .filter((slot) => normalizeDate(slot.schedule_date) === date)
      .map((slot) => slot.schedule_time)
  }, [schedule, date])
 
  const handleBooking = async (event) => {
    event.preventDefault()
    setMessage('')
    setIsSuccess(null)
 
    const response = await fetch('http://localhost:3001/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: name,
        student_email: email,
        appointment_date: date,       // already normalized via state
        appointment_time: appointmentTime,
      }),
    })
    const data = await response.json()
 
    if (response.ok) {
      setMessage(`Booking pending. Your booking ID is ${data.bookingId}.`)
      setIsSuccess(true)
    } else {
      setMessage(data.message || 'Booking failed. Please try again.')
      setIsSuccess(false)
    }
    console.log(data)
  }
 
  const handleStatusSearch = async (event) => {
    event.preventDefault()
    setStatusError('')
    setStatusResults([])
 
    const params = new URLSearchParams()
    if (statusEmail) params.append('email', statusEmail)
    if (statusId) params.append('id', statusId)
 
    const response = await fetch(`http://localhost:3001/bookings?${params.toString()}`)
    const data = await response.json()
 
    if (response.ok) {
      setStatusResults(data.bookings)
      if (data.bookings.length === 0) {
        setStatusError('No booking found with that email or ID.')
      }
    } else {
      setStatusError(data.error || 'Unable to fetch booking status.')
    }
  }
 
  return (
    <>
      <NavBar />
      <main>
        <section id="home" className="section hero-section">
          <div className="hero-copy">
            <h1>Barbershop Booking</h1>
            <p>Your haircut, shave, and style appointment all in one place.</p>
            <a className="button" href="#booking">Book Appointment</a>
          </div>
          <div className="hero-box" id="booking">
            <h2>Book Your Appointment</h2>
            <form onSubmit={handleBooking} className="booking-form">
              <label>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label>
                Date
                <select value={date} onChange={(e) => {
                  setDate(e.target.value)
                  setAppointmentTime('')
                }} required>
                  <option value="">Select a date</option>
                  {availableDates.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label>
                Time
                <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required>
                  <option value="">Select a time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>{formatTime(time)}</option>
                  ))}
                </select>
              </label>
              <button type="submit" className="button">Confirm Booking</button>
            </form>
            {message && <p style={{ color: isSuccess ? 'green' : 'red', marginTop: '10px' }}>{message}</p>}
          </div>
        </section>
 
        <section id="status" className="section section-alt">
          <h2>Check Booking Status</h2>
          <p>Enter your booking email or booking ID to view pending, confirmed, or denied status.</p>
          <form onSubmit={handleStatusSearch} className="booking-form">
            <label>
              Email
              <input type="email" value={statusEmail} onChange={(e) => setStatusEmail(e.target.value)} />
            </label>
            <label>
              Booking ID
              <input value={statusId} onChange={(e) => setStatusId(e.target.value)} />
            </label>
            <button type="submit" className="button">Check Status</button>
          </form>
          {statusError && <p style={{ color: 'red', marginTop: '10px' }}>{statusError}</p>}
          {statusResults.length > 0 && (
            <div className="cards">
              {statusResults.map((booking) => (
                <div key={booking.id} className="card">
                  <p><strong>ID:</strong> {booking.id}</p>
                  <p><strong>Name:</strong> {booking.student_name}</p>
                  <p><strong>Email:</strong> {booking.student_email}</p>
                  <p><strong>Date:</strong> {booking.appointment_date}</p>
                  <p><strong>Time:</strong> {formatTime(booking.appointment_time)}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                </div>
              ))}
            </div>
          )}
        </section>
 
        <section id="about" className="section">
          <h2>About Me</h2>
          <p>I am a Quinnipiac Finance student willing to offer my Barber Services to all.</p>
          <p>Everything is handled in one easy place, so your booking and appointment are always smooth.</p>
          <img src={villImg} alt="Location" className="about-image" />
        </section>
        <p className="center-text">All apointments are handled at Village 580.</p>
 
        <section id="prices" className="section section-alt">
          <h2>Prices</h2>
          <div className="cards">
            <div className="card">
              <h3>Taper Fade</h3>
              <p>$25 - Includes cut and style.</p>
              <img src={taperImg} alt="Taper Fade" className="price-image" />
            </div>
            <div className="card">
              <h3>Beard Trim</h3>
              <p>$15 - Precision shaping and clean edges.</p>
              <img src={beardImg} alt="Beard Trim" className="price-image" />
            </div>
            <div className="card">
              <h3>Shape up</h3>
              <p>$20 - Precise line definition.</p>
              <img src={shapeUpImg} alt="Shape Up" className="price-image" />
            </div>
          </div>
        </section>
 
        <section id="contact" className="section">
          <h2>Contact</h2>
          <p>Reach me at (571) 660-8147 or dawitkasy64@gmail.com.</p>
          <p className="social-row">
            <img src={instagramIcon} alt="Instagram" className="social-icon" />
            <a href="https://www.youtube.com/results?search_query=+circiuts+klr" target="_blank" rel="noreferrer">@mikiyas_cutz</a>
            <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
            <a href="https://www.linkedin.com/in/mikiyas-wolde/" target="_blank" rel="noreferrer">Mikiyas Wolde</a>
          </p>
        </section>
      </main>
    </>
  )
}
 