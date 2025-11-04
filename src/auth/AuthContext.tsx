// src/auth/AuthContext.tsx
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axiosConfig';

// Tipos do usuário (ajuste se sua API retornar campos diferentes)
export type AppUser = {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  // adicione outros campos que sua API devolver
};

interface AuthContextType {
  token: string | null;
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sincroniza token com axios e localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Ao montar, se existir token tenta buscar /me
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          await refreshUser();
        } catch (err) {
          console.error('Erro ao inicializar usuário com token:', err);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Busca os dados do usuário (GET /me)
  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.get('/me');
      // espera-se que res.data contenha { name, email, avatarUrl? }
      setUser(res.data);
    } catch (err) {
      console.error('refreshUser error', err);
      setUser(null);
      // se 401, limpar token
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any)?.response?.status === 401) {
        setToken(null);
      }
    }
  };

  // login: chama /auth/login, salva token e busca /me
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const receivedToken = response.data.token;
      if (!receivedToken) return false;
      setToken(receivedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      try {
        const me = await api.get('/me');
        setUser(me.data);
      } catch (err) {
        console.error('Erro ao buscar /me após login', err);
        setUser(null);
      }
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await api.post('/auth/register', { name, email, password });
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = { token, user, loading, login, register, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
