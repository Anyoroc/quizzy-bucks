import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// 15 minutes of inactivity before auto logout
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  let inactivityTimer: NodeJS.Timeout;

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    if (user) {
      inactivityTimer = setTimeout(signOut, INACTIVITY_TIMEOUT);
    }
  };

  const createUserProfile = async (user: User) => {
    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name || user.email?.split('@')[0],
      referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    });

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      toast({
        title: "Error",
        description: "Failed to create user profile",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Set up activity listeners
    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        createUserProfile(session.user);
        resetInactivityTimer();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await createUserProfile(session.user);
        resetInactivityTimer();
      } else {
        setUser(null);
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
      }
      setLoading(false);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null); // Clear user state
      
      // Show toast notification
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};