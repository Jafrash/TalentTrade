
import './App.css'
import Footer from './components/Footer.jsx'
import Header from "@/components/Navbar.jsx"
import Discover from '@/pages/Discover/Discover.jsx';
import NavbarDemo from '@/components/Navbar.jsx';
import AboutUs from '@/pages/AboutUs.jsx';
import Login from './pages/Login.jsx';
import { ToastContainer } from "react-toastify";
import { UserContextProvider } from '@/util/userContext';
import { Route, Routes, useParams } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage.jsx';
import Register from './pages/Register/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import Profile from './pages/Profile/Profile';
import PrivateRoutes from "./util/PrivateRoutes";
import Chats from './pages/chat/Chats';
import ProfileSetup from './pages/ProfileSetup/ProfileSetup.jsx';
import EditProfile from './pages/EditProfile/EditProfile.jsx';
function App() {
  

  return (
    <UserContextProvider>
       <NavbarDemo/>
       <ToastContainer position="top-right"/>
       <Routes>
        
        <Route element={<PrivateRoutes />}>
          <Route path="/chats" element={<Chats />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/messages/:username" element={<Chats />} />
        </Route>
        
         <Route path="/about_us" element={<AboutUs />} />
         <Route path="/discover" element={<Discover />} />
         <Route path="/" element={<LandingPage />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="*" element={<NotFound />} />
         
         <Route path="/profile/:username" element={<Profile/>}/>
         <Route path="/profile-setup" element={<ProfileSetup />} />
       </Routes>
        <Footer/>
    </UserContextProvider>
      
    
      
    
     
    
  )
}

export default App
