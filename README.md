# 💈 Barbershop Booking Page

A fullstack web application designed to streamline the process of booking barbershop appointments — built primarily for **Quinnipiac University students**.

---

## 📖 About

This project removes the hassle of scheduling a barbershop visit by giving students a clean, intuitive online booking interface. Instead of calling or walking in, users can browse services and book an appointment directly from their browser.



## 🌐 Live Demo

> 🚧 **Coming soon!** The live site will be available at:
> [`https://your-live-site-url.com`](https://your-live-site-url.com)

---

## 🚀 Features

- 📅 Online appointment booking system
- 💇 Service selection with pricing
- 📱 Fully responsive design for mobile and desktop
- 🎨 Modern UI with smooth styling
- 📍 Business information and contact section
- ⚡ Fast page loads with Vite's Hot Module Replacement (HMR)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (via Vite) |
| Styling | CSS |
| Backend | Node.js / Express (`server.js`) |
| Build Tool | Vite |
| Linting | ESLint |

---

## 📁 Project Structure

```
Barbershop-Booking-Page/
├── client/
│   └── src/          # React components and frontend logic
├── node_modules/     # Dependencies
├── index.html        # App entry point
├── server.js         # Express backend server
├── vite.config.js    # Vite configuration
├── eslint.config.js  # ESLint rules
├── package.json      # Project metadata and scripts
└── .env              # Environment variables (not committed)
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/dkasy64/Barbershop-Booking-Page.git

# 2. Navigate into the project directory
cd Barbershop-Booking-Page

# 3. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add any required variables:

```env
# Example
PORT=3000
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

### Running the App

```bash
# Start the frontend (Vite dev server)
npm run dev

# Start the backend server
node server.js
```

Then open your browser and go to `http://localhost:5173` (or whichever port Vite uses).

---

## 📸 Preview

> _Add screenshots or a demo GIF here._

```
![Homepage Preview](./screenshots/homepage.png)
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. Add a license file if you'd like to specify usage terms.

---

## 👤 Author

**dkasy64** — [GitHub Profile](https://github.com/dkasy64)