import React, { createContext, useEffect, useState } from 'react';
import apiClient from '../../../api/apiClient';
import { ensureCsrfToken } from '../../../api/apiClient';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const login = () => {
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/google`;
  };

  const loadCurrentUser = async () => {
    try {
      const response = await apiClient.get("/api/users/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    }  };

    const logout = async () => {
        try {
            await apiClient.post("/api/auth/logout");
            setUser(null);
            window.location.href = "/login";  
        } catch (error) {
            console.error('Failed to logout', error);
        }    };


  useEffect(() => {
    async function initializeAuth() {
      try {
        await ensureCsrfToken();
        await loadCurrentUser();
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    initializeAuth();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    reloadUser: loadCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

