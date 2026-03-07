import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { loginUser, refreshSession, logoutUser, AuthUser } from '../services/api';

// Re-export AuthUser so components that imported User from here can switch to AuthUser
export type { AuthUser };

// --- Schema version guard constants ---
const SCHEMA_VERSION = 2;
const SCHEMA_KEY = 'heyskipper_schema_version';
const USER_KEY = 'heyskipper_user';

// --- Context type ---
interface AuthContextType {
  user: AuthUser | null;
  sessionLoading: boolean;  // true while on-mount refresh is in-flight
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (firstName: string, email: string, password: string) => Promise<boolean>;
  getAccessToken: () => string | null;  // for API calls needing Bearer token
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist ONLY identity fields to localStorage (AUTH-06 compliance)
  const persistUser = (u: AuthUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: u.id,
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
    }));
  };

  const clearPersistedUser = () => {
    localStorage.removeItem(USER_KEY);
  };

  const scheduleTokenRefresh = useCallback((token: string) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      const refreshAt = expiresAt - Date.now() - 60_000; // 60s before expiry
      if (refreshAt > 0) {
        refreshTimerRef.current = setTimeout(async () => {
          try {
            const data = await refreshSession();
            accessTokenRef.current = data.accessToken;
            setUser(data.user);
            persistUser(data.user);
            scheduleTokenRefresh(data.accessToken);
          } catch {
            // Silent refresh failed — token expired, user effectively logged out
            accessTokenRef.current = null;
            setUser(null);
            clearPersistedUser();
          }
        }, refreshAt);
      }
    } catch {
      // Malformed token — skip scheduling
    }
  }, []);

  // Mount effect: schema guard first, then session restore
  useEffect(() => {
    // Schema version guard: evict old PII-polluted localStorage data from pre-Phase-2
    const storedVersion = parseInt(localStorage.getItem(SCHEMA_KEY) || '0', 10);
    if (storedVersion < SCHEMA_VERSION) {
      localStorage.removeItem(USER_KEY);
      localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
    }

    // Attempt silent session restore via httpOnly refresh cookie
    refreshSession()
      .then(data => {
        accessTokenRef.current = data.accessToken;
        setUser(data.user);
        persistUser(data.user);
        scheduleTokenRefresh(data.accessToken);
      })
      .catch(() => {
        // No cookie or expired — start logged out, perfectly normal
      })
      .finally(() => setSessionLoading(false));
  }, [scheduleTokenRefresh]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const data = await loginUser(email, password); // throws on 401
    accessTokenRef.current = data.accessToken;
    setUser(data.user);
    persistUser(data.user);
    scheduleTokenRefresh(data.accessToken);
    return true;
  };

  const logout = async (): Promise<void> => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    accessTokenRef.current = null;
    setUser(null);
    clearPersistedUser();
    try {
      await logoutUser(); // Clear server-side cookie — best effort
    } catch {
      // Cookie clear failed — user is still effectively logged out client-side
    }
  };

  const register = async (firstName: string, email: string, password: string): Promise<boolean> => {
    // Implemented in Plan 02-03 — stub returns false to prevent accidental use
    // Replace in Plan 02-03 with real registerUser() call
    console.warn('register() not yet implemented — see Plan 02-03');
    return false;
  };

  const getAccessToken = (): string | null => accessTokenRef.current;

  return (
    <AuthContext.Provider value={{ user, sessionLoading, login, logout, register, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
