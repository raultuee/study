import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Adiciona um temporizador para simular o delay
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
      // Finaliza o loading somente após 2 segundos
      setLoading(false);
    }, 2000); // 2000 milissegundos = 2 segundos

    // Boa prática: Limpa o temporizador se o componente for desmontado
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    if (email === "emailteste@gmail.com" && password === "123456AB") {
      const userData = { email };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}