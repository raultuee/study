import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react'; // 👁️ ícones
import { useAuth } from '@/auth/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // 🧠 Função que valida a senha
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!minLength) return "A senha deve ter pelo menos 8 caracteres.";
    if (!hasLetter || !hasNumber) return "A senha deve conter letras e números.";
    return "";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    } else {
      setPasswordError('');
    }

    const success = await login(email, password);

    if (success) {
      toast.success("Login realizado com sucesso!");
      navigate('/dashboard');
    } else {
      toast.error("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        
        {/* Lado esquerdo - Branding */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tight">
              Study
            </h1>
            <div className="w-32 h-1 bg-white/60 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <form onSubmit={handleLogin}>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md space-y-8">
              
              {/* Email */}
              <div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-transparent text-white text-lg py-3 px-2 border-b-2 border-white/40 focus:border-white focus:outline-none transition placeholder:text-white/50"
                />
              </div>

              {/* Senha com botão de olho */}
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full bg-transparent text-white text-lg py-3 px-2 pr-10 border-b-2 border-white/40 focus:border-white focus:outline-none transition placeholder:text-white/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Erro de senha */}
              {passwordError && (
                <p className="text-red-400 text-sm">{passwordError}</p>
              )}

              {/* Botões */}
              <Button
                type="submit"
                className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-6 rounded-lg font-semibold border border-white/30 transition-all"
              >
                Entrar
              </Button>

              <Button
                className="w-full text-white rounded-lg font-semibold transition-all"
                variant="link"
                type="button"
              >
                Cadastrar-se
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
