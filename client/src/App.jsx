import { useState } from 'react'

export default function App() {
    const [name, setName] = useState('')

    async function handleBooking() {
        const response = await fetch('http://localhost:3001/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            student_name: name,
            student_email: 'testing2@test.com',
            appointment_date: '2026-02-01',
            appointment_time: '10:50'
        })
        })
        const data = await response.json()
        console.log(data)
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Barbershop</h1>
            <p>Quality cuts for Quinnipiac students</p>

            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button onClick={handleBooking}>
                Book an Appointment
            </button>
        </div>
    )
}