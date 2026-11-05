import { createContext, useContext, useMemo, useState } from 'react';
import { api } from './api.js';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const value = useMemo(
    () => ({
      user,
      async login(email, password) {
        const payload = await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        sessionStorage.setItem('access_token', payload.token);
        sessionStorage.setItem('user', JSON.stringify(payload.user));
        setUser(payload.user);
        return payload.user;
      },
      logout() {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('user');
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

