import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "../util/userContext";
import api from "../utils/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, LogOut, User, Home, Compass, MessageSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

const UserProfileDropdown = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useUser();
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    await logout();
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
          onClick={() => navigate(`/profile/${user.username}`)}
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

const Header = () => {
  const [discover, setDiscover] = useState(false);
  const { user } = useUser();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const handleChatClick = () => {
    if (user) {
      navigate('/chats');
    } else {
      window.location.href = '/login';
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    // The logout function is now handled by useUser context
    setShowLogoutDialog(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    setDiscover(currentPath.includes("discover"));
  }, []);

  return (
    <>
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-500">Are you sure you want to logout? You will be redirected to the login page.</p>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleLogoutCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogoutConfirm}>
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <nav className="bg-gradient-to-r from-emerald-400 to-teal-500 py-3 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigateTo("/")}
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

            {user ? (
              <>
                <NavbarLink href="/profile/me">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </NavbarLink>
                <div className="flex items-center gap-2">
                  <NavbarLink href="/discover" color="text-emerald-600">
                    <Compass className="mr-2 h-4 w-4" />
                    Discover
                  </NavbarLink>
                  <NavbarLink 
                    href="/chats" 
                    onClick={handleChatClick}
                    color="text-emerald-600"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </NavbarLink>
                  <UserProfileDropdown user={user} />
                </div>
              </>
            ) : (
              <>
                <NavbarLink href="/about_us">About Us</NavbarLink>
                <NavbarLink href="/" onClick={() => navigateTo("/#why-talent-trade")}>Why Talent Trade</NavbarLink>
                <Button
                  onClick={() => navigateTo("/login")}
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
                  {user ? (
                    <>
                      <NavbarLink href="/profile/me" className="justify-start">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </NavbarLink>
                      <NavbarLink href="/discover" className="justify-start">
                        <Compass className="mr-2 h-4 w-4" />
                        Discover
                      </NavbarLink>
                      <NavbarLink href="/chats" className="justify-start">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </NavbarLink>
                      <Separator className="my-2" />
                      <UserProfileDropdown user={user} />
                    </>
                  ) : (
                    <>
                      <NavbarLink href="/about_us" className="text-gray-800 font-montserrat">
                        About Us
                      </NavbarLink>
                      <NavbarLink href="/" onClick={() => navigateTo("/#why-talent-trade")} className="text-gray-800 font-montserrat">
                        Why Talent Trade
                      </NavbarLink>
                      <Button
                        onClick={() => navigateTo("/login")}
                        className="bg-white text-emerald-600 hover:bg-gray-100 w-full font-medium"
                      >
                        Login/Register
                      </Button>
                    </>
                  )}
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
                    href="#mobile-apps"
                    className="justify-start pl-6 text-teal-800"
                  >
                    Mobile Apps
                  </NavbarLink>
                  <NavbarLink
                    href="#design"
                    className="justify-start pl-6 text-teal-800"
                  >
                    Design
                  </NavbarLink>
                  <NavbarLink
                    href="#data-science"
                    className="justify-start pl-6 text-teal-800"
                  >
                    Data Science
                  </NavbarLink>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;