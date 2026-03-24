import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "barbershop"
});

db.connect((err) => {
  if (err) {
    console.error(" Database connection failed:", err);
  } else {
    console.log(" Connected to MySQL");
  }
});

app.get("/", (req, res) => {
  res.send("Barbershop API is running");
});

app.post("/book", (req, res) => {
  const { student_name, student_email, appointment_date, appointment_time } = req.body;

  if (!student_name || !student_email || !appointment_date || !appointment_time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const checkQuery = `
    SELECT * FROM bookings
    WHERE appointment_date = ?
    AND appointment_time = ?
  `;

  db.query(checkQuery, [appointment_date, appointment_time], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ message: "Time slot already booked" }); //make sure no double booking
       //make sliding window to check for nearby time slots if the requested one is taken, e.g., check 30 minutes before and after the requested time.
    }

    // Insert booking
    const insertQuery = `
      INSERT INTO bookings
      (student_name, student_email, appointment_date, appointment_time)
      VALUES (?, ?, ?, ?)
    `;

    db.query( //insert into db
      insertQuery,
      [student_name, student_email, appointment_date, appointment_time],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to book appointment" });
        }

        return res.status(200).json({ message: "Booking successful!" });
      }
    );
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});