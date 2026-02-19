import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<App/>}></Route>
          <Route path="Book" element={<Counting/>}></Route>
          <Route path="About" element={<Listing/>}></Route>
          <Route path="Cards" element={<Cards/>}></Route>
          <Route path="Prices" element={<API />}></Route>
          <Route path="Contact" element={<API />}></Route>
        </Route> 
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)