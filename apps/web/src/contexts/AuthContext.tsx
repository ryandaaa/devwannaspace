import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, password?: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('agy_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (name: string, password?: string) => {
    const registeredStr = localStorage.getItem('agy_registered_users');
    let registeredUsers: User[] = registeredStr ? JSON.parse(registeredStr) : [];
    
    let existingUser = registeredUsers.find(u => u.name.toLowerCase() === name.toLowerCase());

    if (existingUser) {
      if (existingUser.password && existingUser.password !== password) {
        return false;
      }
      setUser(existingUser);
      localStorage.setItem('agy_user', JSON.stringify(existingUser));
      return true;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@devwannaspace.com`,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}`,
      password,
    };

    registeredUsers.push(newUser);
    localStorage.setItem('agy_registered_users', JSON.stringify(registeredUsers));

    setUser(newUser);
    localStorage.setItem('agy_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agy_user');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('agy_user', JSON.stringify(updated));
      
      const registeredStr = localStorage.getItem('agy_registered_users');
      if (registeredStr) {
        let registeredUsers: User[] = JSON.parse(registeredStr);
        registeredUsers = registeredUsers.map(u => u.id === updated.id ? updated : u);
        localStorage.setItem('agy_registered_users', JSON.stringify(registeredUsers));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
