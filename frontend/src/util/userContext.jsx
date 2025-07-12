import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isInitialMount, setIsInitialMount] = useState(true);

  const logout = async () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('accessTokenRegistration');
      
      // Clear user state
      setUser(null);
      
      // Redirect to login
      navigate('/login');
      
      // Optionally make a logout API call if needed
      try {
        await api.get('/auth/logout', { withCredentials: true });
      } catch (error) {
        console.error('Logout API failed:', error);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if API call fails
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('accessTokenRegistration');
      setUser(null);
      navigate('/login');
    }
  };

  useEffect(() => {
    // First check if we have an access token
    const token = localStorage.getItem('token');
    if (token) {
      // If we have a token, set user from localStorage
      const userInfoString = localStorage.getItem("userInfo");
      if (userInfoString) {
        try {
          const userInfo = JSON.parse(userInfoString);
          setUser(userInfo);
        } catch (error) {
          console.error("Error parsing userInfo:", error);
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
          // Don't redirect immediately, let the component handle it
        }
      }
    } else {
      // If no token, clear any stale user data
      localStorage.removeItem('userInfo');
      setUser(null);
    }

    // Handle URL changes
    const handleUrlChange = () => {
      console.log("URL has changed:", window.location.href);
      // Check if we need to redirect based on current path and login state
      const currentPath = window.location.pathname;
      const protectedRoutes = ['/profile', '/chat', '/discover'];
      
      // Check if current path matches any protected route pattern
      const isProtectedRoute = protectedRoutes.some(route => {
        // Check for exact match or profile with username
        return currentPath === route || currentPath.startsWith(route + '/');
      });
      
      if (!user && isProtectedRoute) {
        // Only redirect if we're not in the login flow
        if (!currentPath.includes('/login')) {
          navigate("/login");
        }
      }
    };

    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [user, navigate]);

  // Skip token refresh on initial mount
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
    }
  }, [isInitialMount]);

  // Add useEffect to handle token refresh
  useEffect(() => {
    // Skip token refresh on initial mount
    if (isInitialMount) {
      return;
    }

    // Only attempt token refresh if we have both user and token
    if (user && localStorage.getItem('token')) {
      console.log('UserContext: Checking token status for user:', user.email || 'unknown user');
      
      // Attempt to refresh token
      api.get('/auth/refresh-token', {
        withCredentials: true
      })
      .then(response => {
        console.log('UserContext: Token refresh successful');
        if (response.data.success) {
          localStorage.setItem('token', response.data.data.token);
          setUser(prevUser => ({
            ...prevUser,
            token: response.data.data.token
          }));
        }
      })
      .catch(error => {
        console.error('UserContext: Token refresh failed:', error.response?.data || error.message);
        
        // Only redirect to login if we get a specific error indicating invalid token
        if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
          console.log('UserContext: Invalid token detected, clearing user data');
          // Clear user data and redirect to login
          setUser(null);
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
    } else {
      console.log('UserContext: No user or token in context');
    }
  }, [user, navigate, isInitialMount]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

// Export a function to update user info in localStorage
export const updateUserLocalStorage = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export { UserContextProvider, useUser };
