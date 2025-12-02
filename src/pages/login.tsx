import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showBetaAlert, setShowBetaAlert] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error('Usuário ou senha incorretos.');
    }
  };

  return (
    <>
      {/* Pop-up de Alerta Beta */}
      <AnimatePresence>
        {showBetaAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-gradient-to-br from-blue-900/80 to-blue-800/80 border border-blue-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl backdrop-blur-md space-y-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-white">Site em Beta</h2>
                </div>
                <button
                  onClick={() => setShowBetaAlert(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-white/90 leading-relaxed">
                Bem-vindo! 🎉 O <span className="font-semibold text-blue-200">Study</span> está em fase <span className="font-bold text-yellow-300">BETA</span> e em constante desenvolvimento.
              </p>

              <div className="space-y-2 bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/80 font-semibold">Durante o beta, você pode:</p>
                <ul className="text-sm text-white/70 space-y-1">
                  <li>✓ Acessar todas as funcionalidades</li>
                  <li>✓ Reportar bugs e sugestões</li>
                  <li>✓ Ajudar a melhorar a plataforma</li>
                </ul>
              </div>

              <p className="text-xs text-white/60">
                Por conta do beta-service, a Study não salvará os dados do usuário, apenas o login. Agradecemos sua compreensão! 🙏
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBetaAlert(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Entendi, vamos lá!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      <div className="flex items-center justify-center w-full min-h-screen p-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tight">Study</h1>
              <div className="w-32 h-1 bg-white/60 mx-auto rounded-full"></div>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md space-y-8">
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

                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
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

                <div>
                  <Button
                    type="submit"
                    className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-6 rounded-lg font-semibold border border-white/30 transition-all mb-5"
                  >
                    Entrar
                  </Button>
                  <a href="/cadastro">
                    <Button className="w-full text-white rounded-lg font-semibold transition-all" variant="link" type="button">
                      Cadastrar-se
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
