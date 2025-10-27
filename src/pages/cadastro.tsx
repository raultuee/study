// ARQUIVO MODIFICADO: cadastro.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';    
import { toast } from 'sonner';                  

export function Cadastro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!minLength) return "A senha deve ter pelo menos 8 caracteres.";
    if (!hasLetter || !hasNumber) return "A senha deve conter letras e números.";
    return "";
  };
  
  // FUNÇÃO MODIFICADA
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setConfirmPasswordError('');

    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem.");
      return;
    }
    
    // Lógica de conexão com o backend
    const success = await register(email, password);

    if (success) {
      toast.success("Cadastro realizado com sucesso!", {
        description: "Você já pode fazer o login com suas credenciais.",
      });
      navigate('/login'); // Redireciona para o login
    } else {
      toast.error("Falha no cadastro.", {
        description: "Este e-mail já pode estar em uso. Tente novamente.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4">
      {/* O resto do seu JSX permanece o mesmo... */}
      {/* ... */}
      <div className="flex items-center w-full justify-center">
          {/* Adicionei o onSubmit ao form */}
          <form onSubmit={handleSignup} className="w-full max-w-md space-y-8">
            {/* Email Input */}
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
            {/* Password Input */}
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
            {passwordError && (
              <p className="text-red-400 text-sm">{passwordError}</p>
            )}
            {/* Confirm Password Input */}
            <div className="relative">
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar Senha"
                className="w-full bg-transparent text-white text-lg py-3 px-2 pr-10 border-b-2 border-white/40 focus:border-white focus:outline-none transition placeholder:text-white/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-red-400 text-sm">{confirmPasswordError}</p>
            )}
            {/* Buttons */}
            <div>
                {/* MODIFICADO para ser do tipo submit */}
                <Button
                  type="submit"
                  className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-6 rounded-lg font-semibold border border-white/30 transition-all mb-5"
                >
                  Cadastrar
                </Button>
                <a href="/login">
                    <Button
                      className="w-full text-white rounded-lg font-semibold transition-all"
                      variant="link"
                      type="button"
                    >
                      Já tem uma conta? Entrar
                    </Button>
                </a>
            </div>
          </form>
        </div>
      </div>
  );
}