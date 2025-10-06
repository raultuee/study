import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Plus } from 'lucide-react';

export function Dashboard() {
    const getGreeting = () => {
        // Obtém a hora atual no fuso horário de São Paulo
        const now = new Date();
        const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false }));

        if (hour >= 5 && hour < 12) {
            return "Bom dia";
        } else if (hour >= 12 && hour < 18) {
            return "Boa tarde";
        } else {
            return "Boa noite";
        }
    };


    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                        {getGreeting()}, Usuário Teste.
                    </h1>
                </div>

                {/* Grid de Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-auto">
                    
                    {/* Card 1 - Grande */}
                    <Card className="col-span-2 md:col-span-2 lg:col-span-2 row-span-2 flex flex-col w-[550px] justify-center p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden min-h-[200px]">
                        <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-2">
                            <CardTitle className="text-white text-lg md:text-xl lg:text-2xl mb-1 transform group-hover:-translate-y-4 transition-transform duration-500">
                                Continuar Estudando
                            </CardTitle>
                            <p className="text-white/90 text-xs md:text-sm opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                                Retome seus estudos de onde parou. Você está no módulo de Sustentabilidade Ambiental.
                            </p>
                        </CardHeader>
                    </Card>

                    {/* Card 2 - Médio */}
                    <a href="/dashboard/tarefas">
                        <Card className="col-span-2 md:col-span-1 h-32 md:h-36 flex flex-col justify-center p-3 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                            <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                                <CardTitle className="text-white text-sm md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                                    Tarefas
                                </CardTitle>
                                <p className="text-white/90 text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                                    Aliste suas tarefas pendentes.
                                </p>
                            </CardHeader>
                        </Card>
                    </a>

                    {/* Card 3 - Pequeno */}
                    <a href="/dashboard/conquistas">
                        <Card className="col-span-1 h-32 md:h-36 flex flex-col justify-center p-2 md:p-3 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                            <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                                <CardTitle className="text-white text-sm md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                                    Conquistas
                                </CardTitle>
                                <p className="text-white/90 text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                                    Seu progresso na plataforma
                                </p>
                            </CardHeader>
                        </Card>
                    </a>

                    {/* Card 4 - Retangular horizontal */}
                    <Card className="col-span-2 md:col-span-3 lg:col-span-2 h-32 md:h-36 flex flex-col justify-center p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                        <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                            <CardTitle className="text-white text-sm md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                                <Lock/>
                            </CardTitle>
                            <p className="text-white/90 text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs md:max-w-md leading-relaxed">
                                Quarta-feira, 15:00 - Economia Circular
                            </p>
                        </CardHeader>
                    </Card>

                    {/* Card 5 - Médio */}
                    <a href="/dashboard/perfil">
                        <Card className="col-span-1 h-32 md:h-36 flex flex-col justify-center p-2 md:p-3 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                            <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                                <CardTitle className="text-white text-xs md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                                    Perfil de usuário
                                </CardTitle>
                                <p className="text-white/90 text-[10px] md:text-sm opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                                    Visualize e edite seu perfil
                                </p>
                            </CardHeader>
                        </Card>
                    </a>

                    {/* Card 6 - Pequeno */}
                    <Card className="col-span-1 h-32 md:h-36 flex flex-col justify-center p-2 md:p-3 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                        <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                            <CardTitle className="text-white text-xs md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                                <Lock/>
                            </CardTitle>
                            <p className="text-white/90 text-[10px] md:text-sm opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                                Quizzes
                            </p>
                        </CardHeader>
                    </Card>

                    {/* Card 8 - Médio */}
                    <a href="/dashboard/forum-turma">
                        <Card className="col-span-2 md:col-span-2 lg:col-span-1 h-32 md:h-36 flex flex-col justify-center p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                            <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                                <CardTitle className="text-white text-sm md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                                    Fórum da Turma
                                </CardTitle>
                                <p className="text-white/90 text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                                    Converse com colegas
                                </p>
                            </CardHeader>
                        </Card>
                    </a>

                    {/* Card 8 - Médio */}
                    <Card className="col-span-2 md:col-span-2 lg:col-span-1 h-32 md:h-36 flex flex-col justify-center items-center p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                        <Plus/>
                    </Card>

                </div>
            </div>
        </div>
    );
}