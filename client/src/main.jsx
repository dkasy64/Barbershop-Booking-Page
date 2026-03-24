import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import App from './pages/test.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<App/>}></Route>
          <Route path="Home" element={<test/>}></Route>
          <Route path="About" element={<Listing/>}></Route>
          <Route path="Book" element={<Cards/>}></Route>
          <Route path="Prices" element={<API />}></Route>
          <Route path="Contact" element={<API />}></Route>
          <Route path="Test" element={<test />}></Route>
        </Route> 
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)