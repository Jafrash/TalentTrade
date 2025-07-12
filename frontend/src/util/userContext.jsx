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
      localStorage.removeItem('accessToken');
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accessTokenRegistration');
      setUser(null);
      navigate('/login');
    }
  };

  useEffect(() => {
    // Only rely on localStorage for user info
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        setUser(userInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
      }
    } else {
      setUser(null);
    }

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = () => {
      const updatedUserInfo = localStorage.getItem("userInfo");
      if (updatedUserInfo) {
        try {
          setUser(JSON.parse(updatedUserInfo));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

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
    <UserContext.Provider value={{ user, setUser, logout }}>
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
