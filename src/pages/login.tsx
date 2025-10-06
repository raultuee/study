import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email == "emailteste@gmail.com") {
            toast.loading("Usuário verificado! Redirecionando estudante...");

            setTimeout(() => {
                toast.dismiss();
                navigate('/dashboard'); 
            }, 2500);
        } else {
            toast.error("Usuário não encontrado, obtenha o acesso.")
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen p-4">
            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
                
                {/* Left Side - Branding */}
                <div className="flex flex-col items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tight">
                            Study
                        </h1>
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
                            <div>
                                <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                className="w-full bg-transparent text-white text-lg py-3 px-2 border-b-2 border-white/40 focus:border-white focus:outline-none transition placeholder:text-white/50"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-6 rounded-lg font-semibold border border-white/30 transition-all"
                            >
                                Entrar
                            </Button>

                            <Button
                                className="w-full text-white rounded-lg font-semibold transition-all"
                                variant="link"
                            >
                                Cadastrar-se
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};