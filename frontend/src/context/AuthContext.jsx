/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearSession, getStoredUser, getToken, saveSession } from '../lib/api';

const DEMO_TOKEN = 'demo_mode_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(getToken()));

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      // Skip backend verification for demo sessions
      if (token === DEMO_TOKEN) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const result = await api.me();
        if (!isMounted) return;
        setUser(result.user);
        saveSession({ token, user: result.user });
      } catch {
        if (!isMounted) return;
        clearSession();
        setToken(null);
        setUser(null);
      } finally {
        if (isMounted) setIsBootstrapping(false);
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (credentials) => {
    const result = await api.login(credentials);
    saveSession({ token: result.token, user: result.user });
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const loginAsDemo = () => {
    const demoUser = {
      _id: 'demo_user',
      name: 'Pengguna Demo',
      email: 'demo@fitsmart.app',
      isDemo: true,
    };
    saveSession({ token: DEMO_TOKEN, user: demoUser });
    setToken(DEMO_TOKEN);
    setUser(demoUser);
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  const isDemo = Boolean(user?.isDemo);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    isBootstrapping,
    isDemo,
    login,
    loginAsDemo,
    logout,
    setUser,
  }), [token, user, isBootstrapping, isDemo]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return context;
}
