/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearSession, getStoredUser, getToken, saveSession, DEMO_TOKEN, UNAUTHORIZED_EVENT } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(getToken()));
  const [sessionExpired, setSessionExpired] = useState(false);

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

  // Token kedaluwarsa/dicabut di tengah sesi -> arahkan ke halaman login.
  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null);
      setUser(null);
      setSessionExpired(true);
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await api.login(credentials);
    saveSession({ token: result.token, user: result.user });
    setSessionExpired(false);
    setToken(result.token);
    setUser(result.user);
    return result;
  }, []);

  const loginAsDemo = useCallback(() => {
    const demoUser = {
      _id: 'demo_user',
      name: 'Pengguna Demo',
      email: 'demo@fitsmart.app',
      isDemo: true,
    };
    saveSession({ token: DEMO_TOKEN, user: demoUser });
    setSessionExpired(false);
    setToken(DEMO_TOKEN);
    setUser(demoUser);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSessionExpired(false);
    setToken(null);
    setUser(null);
  }, []);

  const isDemo = Boolean(user?.isDemo);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    isBootstrapping,
    isDemo,
    sessionExpired,
    login,
    loginAsDemo,
    logout,
    setUser,
  }), [token, user, isBootstrapping, isDemo, sessionExpired, login, loginAsDemo, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return context;
}
