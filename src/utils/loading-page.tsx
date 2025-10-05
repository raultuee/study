import { useEffect, useRef } from "react";

export function LoadingPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
                ctx.fillStyle = "#fff";
                ctx.shadowColor = "#fff";
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.closePath();

                star.x += star.dx;
                star.y += star.dy;

                // Rebote nas bordas
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

    return (
        <div className="w-full h-screen relative overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ display: "block", zIndex: 0 }}
            />
            <div className="relative z-10 flex items-center justify-center w-full h-full">
                {/* Coloque aqui o conteúdo da sua tela de loading */}
            </div>
        </div>
    );
}