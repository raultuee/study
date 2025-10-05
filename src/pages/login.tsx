import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export function Login() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        function resizeCanvas() {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        let animationFrameId: number;
        const stars = Array.from({ length: 120 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.15,
            dy: (Math.random() - 0.5) * 0.15,
        }));

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        function animate() {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const star of stars) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
                ctx.fillStyle = "#60A5FA";
                ctx.shadowColor = "#60A5FA";
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.closePath();

                star.x += star.dx;
                star.y += star.dy;

                if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
                if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleLogin = () => {
        console.log('Login:', { email, password });
    };

    return (
        <div className="w-full h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ display: "block", zIndex: 0 }}
            />
            
            <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
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

                    {/* Right Side - Login Form */}
                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-md space-y-8">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="w-full bg-transparent text-white text-lg py-3 px-2 border-b-2 border-white/40 focus:border-white focus:outline-none transition placeholder:text-white/50"
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Senha"
                                    className="w-full bg-transparent text-white text-lg py-3 px-2 border-b-2 border-white/40 focus:border-white focus:outline-none transition placeholder:text-white/50"
                                />
                            </div>

                            <Button 
                                onClick={handleLogin}
                                className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-6 rounded-lg font-semibold border border-white/30 transition-all"
                            >
                                Entrar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};