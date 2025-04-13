

import React, { useState, useEffect } from "react";

// Import shadcn components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Icons
import { Menu, ChevronDown, LogOut, User, Home, Compass, MessageSquare } from "lucide-react";

// User Context (simplified version)
const UserContext = React.createContext();
export const useUser = () => React.useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const UserProfileDropdown = ({ user, onLogout, onNavigate }) => {
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    // Perform logout logic
    localStorage.removeItem("userInfo");
    
    try {
      // Instead of axios, use native fetch API
      const response = await fetch("/auth/logout");
      if (response.ok) {
        onLogout();
        // Use callback for navigation instead of react-router
        window.location.href = "http://localhost:5173/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 flex items-center gap-2 hover:bg-transparent">
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage src={user?.picture} alt="User Avatar" />
            <AvatarFallback className="bg-emerald-100 text-emerald-700">
              {getInitials(user?.name || user?.username)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-gray-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => onNavigate(`/profile/${user.username}`)}
          className="cursor-pointer py-2 flex items-center"
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer py-2 flex items-center text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavbarLink = ({ href, children, color = "text-gray-800", className = "", onClick }) => (
  <Button 
    variant="ghost" 
    onClick={onClick || (() => window.location.href = href)}
    className={`font-medium hover:bg-emerald-50 ${color} ${className}`}
  >
    {children}
  </Button>
);

const Header = ({ onNavigate }) => {
  const [navUser, setNavUser] = useState(null);
  const [discover, setDiscover] = useState(false);

 
  const handleUserLogout = () => {
    setNavUser(null);
  };

 
  const navigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  useEffect(() => {
 
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        setNavUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user info");
      }
    }
  }, []);

  useEffect(() => {
   
    const currentPath = window.location.pathname;
    setDiscover(currentPath.includes("discover"));
  }, []);

  return (
    <nav className="bg-gradient-to-r from-emerald-400 to-teal-500 py-3 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
       
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="p-0 hover:bg-transparent"
        >
          <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
            TALENT TRADE
          </h1>
        </Button>

       
        <div className="hidden md:flex items-center gap-1">
          <NavbarLink href="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </NavbarLink>
          
          {navUser !== null ? (
            <>
              <NavbarLink href="/discover">
                <Compass className="mr-2 h-4 w-4" />
                Discover
              </NavbarLink>
              <NavbarLink href="/chats">
                <MessageSquare className="mr-2 h-4 w-4" />
                Your Chats
              </NavbarLink>
              <UserProfileDropdown 
                user={navUser} 
                onLogout={handleUserLogout} 
                onNavigate={navigate} 
              />
            </>
          ) : (
            <>
              <NavbarLink href="/about_us">About Us</NavbarLink>
              <NavbarLink href="/#why-talent-trade">Why Talent Trade</NavbarLink>
              <Button
                onClick={() => navigate("/login")}
                className="bg-white text-emerald-600 hover:bg-gray-100 ml-2 font-medium"
              >
                Login/Register
              </Button>
            </>
          )}
        </div>

       
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-800">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-72">
              <SheetHeader>
                <SheetTitle className="text-xl font-medium text-emerald-600">
                  TALENT TRADE
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <NavbarLink href="/" className="justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </NavbarLink>
                
                {navUser !== null ? (
                  <>
                    <NavbarLink href="/discover" className="justify-start">
                      <Compass className="mr-2 h-4 w-4" />
                      Discover
                    </NavbarLink>
                    <NavbarLink href="/chats" className="justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Your Chats
                    </NavbarLink>
                    
                    {discover && (
                      <>
                        <Separator className="my-2" />
                        <h3 className="px-3 text-sm font-medium text-gray-500">Discover Sections</h3>
                        
                        <NavbarLink 
                          href="#for-you" 
                          className="justify-start pl-4 text-rose-500 font-semibold"
                        >
                          For You
                        </NavbarLink>
                        <NavbarLink 
                          href="#popular" 
                          className="justify-start pl-4 text-emerald-600 font-semibold"
                        >
                          Popular
                        </NavbarLink>
                        <NavbarLink 
                          href="#web-development" 
                          className="justify-start pl-6 text-teal-800"
                        >
                          Web Development
                        </NavbarLink>
                        <NavbarLink 
                          href="#machine-learning" 
                          className="justify-start pl-6 text-teal-800"
                        >
                          Machine Learning
                        </NavbarLink>
                        <NavbarLink 
                          href="#others" 
                          className="justify-start pl-6 text-teal-800"
                        >
                          Others
                        </NavbarLink>
                      </>
                    )}
                    
                    <Separator className="my-2" />
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-10 w-10 border-2 border-emerald-100">
                        <AvatarImage src={navUser?.picture} alt="User Avatar" />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {navUser?.name?.charAt(0) || navUser?.username?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-800">{navUser?.name || navUser?.username}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate(`/profile/${navUser?.username}`)}
                      className="justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        localStorage.removeItem("userInfo");
                        setNavUser(null);
                      }}
                      className="mt-2"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <NavbarLink href="/about_us" className="justify-start">About Us</NavbarLink>
                    <NavbarLink href="/#why-talent-trade" className="justify-start">Why Talent Trade</NavbarLink>
                    <Button
                      onClick={() => navigate("/login")}
                      className="mt-4 bg-emerald-500 hover:bg-emerald-600"
                    >
                      Login/Register
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};


const NavbarDemo = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const handleNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
    setCurrentPath(path);
    // Note: In a real app with client-side routing, you'd use your router here
    // This demo just logs the navigation
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={handleNavigate} />
      <div className="container mx-auto p-8 text-center flex-grow">
        <h2 className="text-2xl font-bold mb-4">Welcome to Talent Trade</h2>
        <p className="text-gray-600 mb-6">Connect with others and exchange skills</p>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          Get Started
        </Button>
        
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Current Location: {currentPath || '/'}</h3>
          <p className="text-gray-500">This shows the simulated current path in our demo</p>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Talent Trade. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};



export default  Header 


/*
import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useUser } from "../util/userContext.jsx";
import { Dropdown } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfileDropdown = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Perform logout logic
    localStorage.removeItem("userInfo");
    setUser(null);
    try {
      const response = await axios.get("/auth/logout");
      window.location.href = "http://localhost:5173/login";
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        console.error(error.response.data.message);
      }
    }
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      href=""
      ref={ref}
      onClick={(e) => {
        onClick(e);
      }}
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          overflow: "hidden",
          marginRight: "10px",
        }}
      >
        <img
          src={user?.picture} // Replace with your image URL
          alt="User Avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {children}
      &#x25bc;
    </div>
  ));

  const CustomMenu = React.forwardRef(({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) => !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  });

  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />

      <Dropdown.Menu as={CustomMenu}>
        <Dropdown.Item
          onClick={() => {
            console.log(user.username);
            navigate(`/profile/${user.username}`);
          }}
        >
          Profile
        </Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const Header = () => {
  const [navUser, setNavUser] = useState(null);
  const { user } = useUser();
  const [discover, setDiscover] = useState(false);

  useEffect(() => {
    setNavUser(JSON.parse(localStorage.getItem("userInfo")));
    // console.log("navUser", navUser);
  }, [user]);

  useEffect(() => {
    const handleUrlChange = () => {
      // Your logic to run when there is a change in the URL
      console.log("URL has changed:", window.location.href);
    };
    window.addEventListener("popstate", handleUrlChange);

    const temp = window.location.href.split("/");
    const url = temp.pop();
    if (url.startsWith("discover")) {
      setDiscover(true);
    } else {
      setDiscover(false);
    }
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [window.location.href]);

  return (
    <>
      <Navbar key="md" expand="md" className="bg-body-primary" style={{ backgroundColor: "#3BB4A1", zIndex: 998 }}>
        <Container fluid>
          <Navbar.Brand href="/" style={{ fontFamily: "Josefin Sans, sans-serif", color: "#2d2d2d", fontWeight: 500 }}>
            SKILL SWAP
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title
                id={`offcanvasNavbarLabel-expand-md`}
                style={{ fontFamily: "Josefin Sans, sans-serif", color: "#028477" }}
              >
                SKILL SWAP
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={Link} to="/" style={{ fontFamily: "Montserrat, sans-serif", color: "#2d2d2d" }}>
                  Home
                </Nav.Link>
                {navUser !== null ? (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/discover"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#2d2d2d" }}
                    >
                      Discover
                    </Nav.Link>
                    <Nav.Link as={Link} to="/chats" style={{ fontFamily: "Montserrat, sans-serif", color: "#2d2d2d" }}>
                      Your Chats
                    </Nav.Link>
                    
                    {discover && (
                      <>
                        <Nav.Link
                          href="#for-you"
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            color: "#f56664",
                            fontSize: "1.2rem",
                            marginTop: "2rem",
                          }}
                          className="d-md-none"
                        >
                          For You
                        </Nav.Link>
                        <Nav.Link
                          href="#popular"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#3bb4a1", fontSize: "1.2rem" }}
                          className="d-md-none"
                        >
                          Popular
                        </Nav.Link>
                        <Nav.Link
                          href="#web-development"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#013e38", marginLeft: "1.5rem" }}
                          className="d-md-none"
                        >
                          Web Development
                        </Nav.Link>
                        <Nav.Link
                          href="#machine-learning"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#013e38", marginLeft: "1.5rem" }}
                          className="d-md-none"
                        >
                          Machine Learning
                        </Nav.Link>
                        <Nav.Link
                          href="#others"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#013e38", marginLeft: "1.5rem" }}
                          className="d-md-none"
                        >
                          Others
                        </Nav.Link>
                      </>
                    )}
                    <Nav.Link as={Dropdown} style={{ fontFamily: "Montserrat, sans-serif", color: "#2d2d2d" }}>
                      <UserProfileDropdown />
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/about_us"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#2d2d2d" }}
                    >
                      About Us
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/#why-skill-swap"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#2d2d2d" }}
                    >
                      Why SkillSwap
                    </Nav.Link>
                    <Nav.Link as={Link} to="/login" style={{ fontFamily: "Montserrat, sans-serif", color: "#2d2d2d" }}>
                      Login/Register
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;



*/



/*
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/util/userContext.jsx";
import axios from "axios";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu.jsx"; // ✅ .jsx added
import { Menu } from "lucide-react";

const UserProfileDropdown = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    try {
      await axios.get("/auth/logout");
      navigate("/login"); // ✅ replaced href with react-router navigation
    } catch (error) {
      console.error(error?.response?.data?.message || error);
    }
  };
  console.log("Navbar rendering...")
  return (
    
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src={user?.picture || "/default-avatar.png"} // ✅ fallback image
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm">▼</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate(`/profile/${user?.username}`)}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  const [navUser, setNavUser] = useState(null);
  const { user } = useUser();
  const [discover, setDiscover] = useState(false);

  useEffect(() => {
    setNavUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [user]);

  useEffect(() => {
    const handleUrlChange = () => {
      const temp = window.location.href.split("/");
      const url = temp.pop();
      setDiscover(url.startsWith("discover"));
    };

    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  return (
    <header className="w-full bg-teal-500 py-2 px-4 sticky top-0 z-[998]">
      <div className="flex items-center justify-between">
        <Link to="/" className="font-josefin font-medium text-lg text-gray-800">
          TALENT TRADE
        </Link>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="text-white" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-teal-800 font-josefin">
                  TALENT TRADE
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <Link to="/" className="text-gray-800 font-montserrat">Home</Link>
                {navUser ? (
                  <>
                    <Link to="/discover" className="text-gray-800 font-montserrat">
                      Discover
                    </Link>
                    <Link to="/chats" className="text-gray-800 font-montserrat">
                      Your Chats
                    </Link>
                    {discover && (
                      <>
                        <a href="#for-you" className="text-red-400 text-lg mt-4 md:hidden">
                          For You
                        </a>
                        <a href="#popular" className="text-teal-400 text-lg md:hidden">
                          Popular
                        </a>
                        <a href="#web-development" className="text-teal-900 ml-6 md:hidden">
                          Web Development
                        </a>
                        <a href="#machine-learning" className="text-teal-900 ml-6 md:hidden">
                          Machine Learning
                        </a>
                        <a href="#others" className="text-teal-900 ml-6 md:hidden">
                          Others
                        </a>
                      </>
                    )}
                    <UserProfileDropdown />
                  </>
                ) : (
                  <>
                    <Link to="/about_us" className="text-gray-800 font-montserrat">
                      About Us
                    </Link>
                    <Link to="/#why-talent-trade" className="text-gray-800 font-montserrat">
                      Why TalentTrade
                    </Link>
                    <Link to="/login" className="text-gray-800 font-montserrat">
                      Login/Register
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-800 font-montserrat">Home</Link>
          {navUser ? (
            <>
              <Link to="/discover" className="text-gray-800 font-montserrat">
                Discover
              </Link>
              <Link to="/chats" className="text-gray-800 font-montserrat">
                Your Chats
              </Link>
              <UserProfileDropdown />
            </>
          ) : (
            <>
              <Link to="/about_us" className="text-gray-800 font-montserrat">
                About Us
              </Link>
              <Link to="/#why-talent-trade" className="text-gray-800 font-montserrat">
                Why Talent Trade
              </Link>
              <Link to="/login" className="text-gray-800 font-montserrat">
                Login/Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

*/