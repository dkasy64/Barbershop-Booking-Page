import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import MainLayout from './components/MainLayout'
import Test from './pages/test'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<App />} />
          <Route path="Home" element={<Test />} />
          <Route path="About" element={<Test />} />
          <Route path="Booking" element={<Test />} />
          <Route path="Prices" element={<Test />} />
          <Route path="Contact" element={<Test />} />
          <Route path="Test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)