import { createContext, useState, useEffect, useContext } from 'react';
import { fetchUserData, authUser } from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserData(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => console.error('Failed to fetch user data:', error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const user = await authUser(credentials);
      if (user.role === "Coach") {
        user.role = "Тренер";
      } else if (user.role === "Student") {
        user.role = "Ученик";
      }
      setUser(user);
      localStorage.setItem('authToken', user.token);
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);