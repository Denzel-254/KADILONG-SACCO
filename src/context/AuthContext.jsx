import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setUserRole(userData.role);
        setIsAuthenticated(true);
        
        // Verify token with backend
        const response = await api.get('/auth/me');
        setUser(response.data);
        setUserRole(response.data.role);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        // Token invalid
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      
      const userResponse = await api.get('/auth/me');
      const userData = userResponse.data;
      
      setUser(userData);
      setUserRole(userData.role);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  const hasRole = (roles) => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  const isAdmin = () => hasRole(['admin', 'super_admin']);
  const isSuperAdmin = () => userRole === 'super_admin';
  const isMember = () => userRole === 'member';

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isAuthenticated,
        loading,
        login,
        logout,
        hasRole,
        isAdmin,
        isSuperAdmin,
        isMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};