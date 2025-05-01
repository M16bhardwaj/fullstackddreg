import React, { createContext, useContext, useEffect, useState } from 'react';

type UserState = {
  userId: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  token?: string;
};

type UserContextType = {
  user: UserState;
  setUser: (user: Partial<UserState>) => void;
  loading: boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = 'user';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<UserState>({
    userId: '',
    name: '',
    email: '',
    isAuthenticated: false,
    token: undefined,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserState(parsed);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const setUser = (updatedFields: Partial<UserState>) => {
    setUserState((prev) => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      return newUser;
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserState({
      userId: '',
      name: '',
      email: '',
      isAuthenticated: false,
      token: undefined,
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
