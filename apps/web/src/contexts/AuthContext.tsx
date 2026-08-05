import React, { createContext, useContext, useMemo } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string; // no longer used
}

interface AuthContextType {
  user: User | null;
  login: () => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser } = useUser();
  const { signOut, openSignIn } = useClerk();

  const [localAvatar, setLocalAvatar] = React.useState<string | null>(() => {
    return localStorage.getItem('local_avatar_override') || null;
  });

  const user = useMemo<User | null>(() => {
    if (!clerkUser) return null;
    return {
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.username || 'User',
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      avatar: localAvatar || clerkUser.imageUrl,
    };
  }, [clerkUser, localAvatar]);

  const login = () => {
    const wailsLogin = (window as any).go?.main?.App?.StartExternalLogin;
    if (wailsLogin) {
      const clerkDomain = "https://golden-mole-61.accounts.dev";
      const callbackUrl = encodeURIComponent("http://localhost:34567/callback");
      const signInUrl = `${clerkDomain}/sign-in?redirect_url=${callbackUrl}`;

      wailsLogin(signInUrl)
        .then((query: string) => {
          console.log("Sesi autentikasi dari browser eksternal berhasil diterima:", query);
          if (query) {
            localStorage.setItem('devwannaspace_clerk_query', query);
            const saveSession = (window as any).go?.main?.App?.SaveSession;
            if (saveSession) {
              saveSession(query).catch((e: any) => console.error("Gagal menyimpan sesi ke disk:", e));
            }
          }
          if ((window as any).runtime?.WindowShow) {
            (window as any).runtime.WindowShow();
            (window as any).runtime.WindowUnminimise();
          }
          window.location.href = `/?${query}`;
        })
        .catch((err: any) => {
          console.error("Gagal melakukan login eksternal via loopback:", err);
        });
      return true;
    }

    openSignIn();
    return true;
  };

  const logout = () => {
    localStorage.removeItem('devwannaspace_clerk_query');
    const clearSession = (window as any).go?.main?.App?.ClearSession;
    if (clearSession) {
      clearSession().catch((e: any) => console.error("Gagal menghapus sesi dari disk:", e));
    }
    signOut();
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!clerkUser) return;
    
    try {
      if (updates.name) {
        const parts = updates.name.split(' ');
        const firstName = parts[0];
        const lastName = parts.slice(1).join(' ');
        
        await clerkUser.update({
          firstName,
          lastName,
        });
      }

      if (updates.avatar !== undefined) {
        if (updates.avatar) {
          try {
            // Try to fetch and set image natively in Clerk
            const res = await fetch(updates.avatar);
            const blob = await res.blob();
            await clerkUser.setProfileImage({ file: blob });
            setLocalAvatar(null);
            localStorage.removeItem('local_avatar_override');
          } catch (err) {
            // If CORS fails or upload fails, fallback to local override
            console.warn('Could not set Clerk profile image, falling back to local override', err);
            setLocalAvatar(updates.avatar);
            localStorage.setItem('local_avatar_override', updates.avatar);
          }
        } else {
          // If avatar is empty, remove override
          setLocalAvatar(null);
          localStorage.removeItem('local_avatar_override');
        }
      }
    } catch (error) {
      console.error('Failed to update user profile in Clerk:', error);
    }
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
