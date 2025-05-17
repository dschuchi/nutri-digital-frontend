import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/user';

const AuthContext = createContext();

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const decoded = decodeJWT(token);
    if (!decoded || Date.now() / 1000 > decoded.exp) {
      localStorage.removeItem('token');
      setUser(null);
    } else {
      setUser(decoded.name);
    }

    setLoading(false);
  };

  const loginContext = async (username, password) => {
    try {
      const { token } = await apiLogin(username, password);
      localStorage.setItem('token', token);
      fetchUser();
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logoutContext = () => {
    apiLogout();
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login: loginContext, logout: logoutContext, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
