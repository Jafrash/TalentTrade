
import './App.css'
import Footer from './components/Footer.jsx'
import Header from "@/components/Navbar.jsx"
import Discover from '@/pages/Discover/Discover.jsx';
import NavbarDemo from '@/components/Navbar.jsx';
import AboutUs from '@/pages/AboutUs.jsx';
import Login from './pages/Login.jsx';
import { ToastContainer } from "react-toastify";
import { UserProvider } from '@/components/Navbar.jsx';
import { Route, Routes } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage.jsx';
import Register from './pages/Register/Register.jsx';
import NotFound from './pages/NotFound.jsx';
function App() {
  

  return (
    <UserProvider>
       <NavbarDemo/>
       <ToastContainer position="top-right"/>
       <Routes>
         <Route path="/about_us" element={<AboutUs />} />
         <Route path="/discover" element={<Discover />} />
         <Route path="/" element={<LandingPage />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="*" element={<NotFound />} />
       </Routes>
        <Footer/>
    </UserProvider>
      
    
      
    
     
    
  )
}

export default App
