import { useState } from 'react'
import NavBar from './components/NavBar'
import taperImg from './assets/taper.jpeg'
import beardImg from './assets/beard.jpeg'
import shapeUpImg from './assets/shapeUp.jpeg'
import villageImg from './assets/village.jpg'
import instagramIcon from './assets/instagram.png'
import linkedinIcon from './assets/linkden.png'
import villImg from './assets/vill.jpg'

export default function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(null)

  const convertTo24Hour = (time) => {
    const [timePart, ampm] = time.split(' ')
    let [hour, minute] = timePart.split(':')
    hour = parseInt(hour)
    if (ampm === 'PM' && hour !== 12) hour += 12
    if (ampm === 'AM' && hour === 12) hour = 0
    return `${hour.toString().padStart(2, '0')}:${minute}:00`
  }

  async function handleBooking(event) {
    event.preventDefault()

    const response = await fetch('http://localhost:3001/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: name,
        student_email: email,
        appointment_date: date,
        appointment_time: convertTo24Hour(appointmentTime),
      }),
    })
    const data = await response.json()
    if (response.ok) {
      setMessage('Booking successful!')
      setIsSuccess(true)
    } else {
      setMessage('Booking failed. Please try again.')
      setIsSuccess(false)
    }
    console.log(data)
  }

  const times = []
  for (let hour = 15; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour % 12 || 12}:${minute === 0 ? '00' : minute} ${hour < 12 ? 'AM' : 'PM'}`
      times.push(time)
    }
  }

  const getUpcomingTuesdaysAndThursdays = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 60; i++) {
      const nextDate = new Date(today)
      nextDate.setDate(today.getDate() + i)
      const day = nextDate.getDay()
      if (day === 2 || day === 4) {
        dates.push(nextDate.toISOString().split('T')[0])
      }
    }
    return dates
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
                <select value={date} onChange={(e) => setDate(e.target.value)} required>
                  <option value="">Select a date</option>
                  {getUpcomingTuesdaysAndThursdays().map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label>
                Time
                <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required>
                  <option value="">Select a time</option>
                  {times.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </label>
              <button type="submit" className="button">Confirm Booking</button>
            </form>
            {message && <p style={{ color: isSuccess ? 'green' : 'red', marginTop: '10px' }}>{message}</p>}
          </div>
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
