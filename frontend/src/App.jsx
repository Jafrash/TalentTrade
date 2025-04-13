
import './App.css'
import Footer from './components/Footer.jsx'
import Header from "@/components/Navbar.jsx"
import NavbarDemo from '@/components/Navbar.jsx';
import AboutUs from '@/pages/AboutUs.jsx';
import { ToastContainer } from "react-toastify";
import { UserProvider } from '@/components/Navbar.jsx';
import { Route, Routes } from 'react-router-dom';
function App() {
  

  return (
    <UserProvider>
       <NavbarDemo/>
       <ToastContainer position="top-right"/>
       <Routes>
         <Route path="/about_us" element={<AboutUs />} />
       </Routes>
        <Footer/>
    </UserProvider>
      
    
      
    
     
    
  )
}

export default App
