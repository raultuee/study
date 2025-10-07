import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      color="white"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth(); // <-- 1. Obter o estado de loading

  // 2. Se estiver carregando, exiba uma mensagem/spinner
  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center"><Spinner/></div>;
  }

  // 3. Após o loading, se não houver usuário, redirecione
  return user ? children : <Navigate to="/login" />;
};