import { Progress } from "@/components/ui/progress";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Trophy, Lock } from "lucide-react";

// 1. Definição do tipo para cada conquista
type Achievement = {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
};

// 2. Dados de exemplo (mock data) - No seu app, isso viria de uma API
const achievementsData: Achievement[] = [
  {
    id: 1,
    title: "Primeiros Passos",
    description: "Crie sua primeira tarefa.",
    unlocked: true,
  },
  {
    id: 2,
    title: "Organizador",
    description: "Crie um compromisso na sua agenda.",
    unlocked: true,
  },
  {
    id: 3,
    title: "Convivência amigável",
    description: "Lidere um fórum.",
    unlocked: false,
  },
  {
    id: 4,
    title: "Bonito e elegante",
    description: "Conclua todas as etapas do seu perfil.",
    unlocked: false,
  },
];

export function Conquistas() {
  // 3. Cálculo do progresso
  const unlockedCount = achievementsData.filter((ach) => ach.unlocked).length;
  const totalAchievements = achievementsData.length;
  const progressPercentage = (unlockedCount / totalAchievements) * 100;

  return (
    <div className="w-full min-h-screen text-white p-4 sm:p-8 flex justify-center items-center">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Cabeçalho */}
        <header>
          <h1 className="text-4xl font-bold mb-4">Conquistas</h1>
          <div className="flex items-center gap-4">
            <Progress value={progressPercentage} className="h-3 bg-white" />
            <span className="text-lg font-semibold whitespace-nowrap">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </header>

        {/* Lista de Conquistas */}
        <main className="space-y-4">
          {achievementsData.map((achievement) => (
            <Card
              key={achievement.id}
              className={`
                border-blue-700/50 transition-all duration-300
                ${achievement.unlocked
                  ? 'bg-blue-800/60'
                  : 'bg-blue-900/50 opacity-60'
                }
              `}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Trophy
                    className={`
                      h-8 w-8 
                      ${achievement.unlocked ? 'text-yellow-400' : 'text-blue-600'}
                    `}
                  />
                  <div>
                    <CardTitle className="text-lg text-white">
                      {achievement.title}
                    </CardTitle>
                    <CardDescription className="text-blue-200/80">
                      {achievement.description}
                    </CardDescription>
                  </div>
                </div>
                {!achievement.unlocked && (
                  <Lock className="h-6 w-6 text-blue-400" />
                )}
              </div>
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
} 