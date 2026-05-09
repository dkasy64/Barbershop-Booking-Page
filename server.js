import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'
import dotenv from 'dotenv'
 
dotenv.config()
 
const app = express()
app.use(cors())
app.use(express.json())
 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'barbershop',
})
 
const ensureSchema = () => {
  const createScheduleTable = `
    CREATE TABLE IF NOT EXISTS schedule (
      id INT AUTO_INCREMENT PRIMARY KEY,
      schedule_date DATE NOT NULL,
      schedule_time TIME NOT NULL,
      UNIQUE KEY schedule_unique (schedule_date, schedule_time)
    )
  `
 
  const createBookingsTable = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_name VARCHAR(255) NOT NULL,
      student_email VARCHAR(255) NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      status ENUM('pending','confirmed','denied') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
 
  db.query(createScheduleTable, (err) => {
    if (err) console.error('Failed to create schedule table:', err)
  })
 
  db.query(createBookingsTable, (err) => {
    if (err) console.error('Failed to create bookings table:', err)
  })
}
 
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err)
  } else {
    console.log('Connected to MySQL')
    ensureSchema()
  }
})
 
app.get('/', (req, res) => {
  res.send('Barbershop API is running')
})
 
app.get('/schedule', (req, res) => {
  const query = `SELECT id, schedule_date, schedule_time FROM schedule WHERE schedule_date >= CURDATE() ORDER BY schedule_date, schedule_time`
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' })
    res.json({ schedule: results })
  })
})
 
app.post('/schedule', (req, res) => {
  const { schedule_date, schedule_times } = req.body
  if (!schedule_date || !Array.isArray(schedule_times) || schedule_times.length === 0) {
    return res.status(400).json({ error: 'Date and at least one time are required' })
  }
 
  const values = schedule_times.map((time) => [schedule_date, time])
  const insertQuery = 'INSERT IGNORE INTO schedule (schedule_date, schedule_time) VALUES ?'
 
  db.query(insertQuery, [values], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to create schedule slots' })
    return res.status(200).json({ message: 'Schedule slots created', created: result.affectedRows })
  })
})
 
app.delete('/schedule/:id', (req, res) => {
  const { id } = req.params
  const deleteQuery = 'DELETE FROM schedule WHERE id = ?'
  db.query(deleteQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete schedule slot' })
    return res.status(200).json({ message: 'Schedule slot deleted' })
  })
})
 
app.get('/bookings', (req, res) => {
  const { email, id } = req.query
  let query = 'SELECT * FROM bookings'
  const params = []
 
  if (id) {
    query += ' WHERE id = ?'
    params.push(id)
  } else if (email) {
    query += ' WHERE student_email = ?'
    params.push(email)
  }
 
  query += ' ORDER BY appointment_date, appointment_time'
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' })
    res.json({ bookings: results })
  })
})
 
app.patch('/bookings/:id', (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const validStatuses = ['pending', 'confirmed', 'denied']
 
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
 
  const updateQuery = 'UPDATE bookings SET status = ? WHERE id = ?'
  db.query(updateQuery, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update booking status' })
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.json({ message: 'Booking status updated' })
  })
})
 
app.post('/book', (req, res) => {
  const { student_name, student_email, appointment_date, appointment_time } = req.body
 
  if (!student_name || !student_email || !appointment_date || !appointment_time) {
    return res.status(400).json({ message: 'All fields are required' })
  }
 
  // Normalize date to YYYY-MM-DD to avoid timezone/format mismatch with MySQL DATE columns
  const normalizedDate = new Date(appointment_date).toISOString().split('T')[0]
 
  console.log('--- /book debug ---')
  console.log('Raw appointment_date from client:', appointment_date)
  console.log('Normalized date:', normalizedDate)
  console.log('appointment_time:', appointment_time)
 
  const scheduleQuery = `SELECT * FROM schedule WHERE schedule_date = ? AND schedule_time = ?`
  console.log('Running scheduleQuery with:', normalizedDate, appointment_time)
  db.query(scheduleQuery, [normalizedDate, appointment_time], (err, scheduleResults) => {
    if (err) return res.status(500).json({ error: 'Database error' })
    console.log('Schedule query results:', scheduleResults)
    if (scheduleResults.length === 0) {
      return res.status(400).json({ message: 'Selected time slot is not available in the current schedule' })
    }
 
    const checkQuery = `
      SELECT * FROM bookings
      WHERE appointment_date = ?
      AND appointment_time = ?
      AND status IN ('pending','confirmed')
    `
 
    db.query(checkQuery, [normalizedDate, appointment_time], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' })
      if (results.length > 0) {
        return res.status(400).json({ message: 'Time slot already booked' })
      }
 
      const insertQuery = `
        INSERT INTO bookings
        (student_name, student_email, appointment_date, appointment_time, status)
        VALUES (?, ?, ?, ?, 'pending')
      `
 
      db.query(insertQuery, [student_name, student_email, normalizedDate, appointment_time], (err, result) => {
        if (err) {
          console.error('Insert error:', err)
          return res.status(500).json({ error: 'Failed to book appointment', detail: err.message })
        }
 
        console.log(`New booking created: id=${result.insertId}, name=${student_name}, email=${student_email}, date=${normalizedDate}, time=${appointment_time}`)
        return res.status(200).json({ message: 'Booking pending', bookingId: result.insertId })
      })
    })
  })
})
 
app.post('/login', (req, res) => {
  const { password } = req.body
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true })
  } else {
    res.status(401).json({ error: 'Invalid password' })
  }
})
 
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})