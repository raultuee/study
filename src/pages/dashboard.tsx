import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Plus, ArrowLeft, User, Settings, LogOut } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { CardDescription } from "@/components/ui/card";
import { Trophy, Check, PlusIcon, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tipos
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
};

type UserProfileData = {
  name: string;
  avatarUrl: string;
  bio: string;
  plans: string[];
  forums: { name: string; url: string }[];
  portfolioUrl: string;
};

// Dados mockados
const achievementsData: Achievement[] = [
  { id: 1, title: "Primeiros Passos", description: "Crie sua primeira tarefa.", unlocked: true },
  { id: 2, title: "Organizador", description: "Crie um compromisso na sua agenda.", unlocked: true },
  { id: 3, title: "Convivência amigável", description: "Lidere um fórum.", unlocked: false },
  { id: 4, title: "Bonito e elegante", description: "Conclua todas as etapas do seu perfil.", unlocked: false },
];

const userData: UserProfileData = {
  name: "Usuário Teste",
  avatarUrl: "https://github.com/raultuee.png",
  bio: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique ipsa earum suscipit itaque enim molestias voluptatum quaerat, aliquid officiis eaque!",
  plans: ["Plano ++", "Prata"],
  forums: [{ name: "Etecanos do Study", url: "#" }],
  portfolioUrl: "www.portifolio.com.br",
};

// Componente de Tarefas
function TarefasContent() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Estudar React com TypeScript", completed: true },
    { id: 2, text: "Finalizar componente de perfil", completed: true },
    { id: 3, text: "Começar a lista de tarefas", completed: false },
    { id: 4, text: "Entregar o projeto", completed: false },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    const newTodo: Todo = { id: Date.now(), text: inputValue, completed: false };
    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      <header>
        <h1 className="text-4xl font-bold mb-4">Minhas Tarefas</h1>
        <form onSubmit={handleAddTodo} className="flex items-center gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="bg-blue-900 border-blue-700/50 text-white placeholder:text-blue-300/70 h-12 text-lg"
          />
          <Button type="submit" size="icon" className="h-12 w-12 flex-shrink-0">
            <Plus className="h-6 w-6" />
          </Button>
        </form>
      </header>
      <main className="space-y-3">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`border-blue-700/50 flex items-center justify-between p-4 transition-all duration-300 ${todo.completed ? 'bg-blue-800/40 opacity-50' : 'bg-blue-900/80'}`}>
                <span className={`flex-grow cursor-pointer text-white ${todo.completed ? 'line-through text-blue-300/80' : ''}`} onClick={() => handleToggleTodo(todo.id)}>
                  {todo.text}
                </span>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => handleToggleTodo(todo.id)} className="hover:bg-green-500/20 text-green-400">
                    <Check className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTodo(todo.id)} className="hover:bg-red-500/20 text-red-400">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Componente de Conquistas
function ConquistasContent() {
  const unlockedCount = achievementsData.filter((ach) => ach.unlocked).length;
  const totalAchievements = achievementsData.length;
  const progressPercentage = (unlockedCount / totalAchievements) * 100;

  return (
    <div className="w-full max-w-4xl space-y-8">
      <header>
        <h1 className="text-4xl font-bold mb-4">Conquistas</h1>
        <div className="flex items-center gap-4">
          <Progress value={progressPercentage} className="h-3 bg-white" />
          <span className="text-lg font-semibold whitespace-nowrap">{Math.round(progressPercentage)}%</span>
        </div>
      </header>
      <main className="space-y-4">
        {achievementsData.map((achievement) => (
          <Card key={achievement.id} className={`border-blue-700/50 transition-all duration-300 ${achievement.unlocked ? 'bg-blue-800/60' : 'bg-blue-900/50 opacity-60'}`}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Trophy className={`h-8 w-8 ${achievement.unlocked ? 'text-yellow-400' : 'text-blue-600'}`} />
                <div>
                  <CardTitle className="text-lg text-white">{achievement.title}</CardTitle>
                  <CardDescription className="text-blue-200/80">{achievement.description}</CardDescription>
                </div>
              </div>
              {!achievement.unlocked && <Lock className="h-6 w-6 text-blue-400" />}
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
}

// Componente de Perfil
function PerfilContent() {
  return (
    <div className="w-full max-w-4xl">
      <div className="relative">
        <div className="h-48 bg-blue-800 rounded-t-xl" />
        <div className="absolute top-28 left-8">
          <Avatar className="h-32 w-32 border-8 border-blue-900">
            <AvatarImage src={userData.avatarUrl} alt={userData.name} />
            <AvatarFallback>UT</AvatarFallback>
          </Avatar>
        </div>
        <div className="bg-blue-900 p-8 pt-20 rounded-b-xl text-white">
          <div className="flex justify-end -mt-8 mb-4 space-x-2">
            <Badge className="bg-gray-900 text-white border-gray-700 hover:bg-gray-800">{userData.plans[0]}</Badge>
            <Badge variant="secondary" className="bg-gray-300 text-gray-800 hover:bg-gray-200">{userData.plans[1]}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{userData.name}</h1>
          <p className="text-blue-200/90 mt-2 text-base">{userData.bio}</p>
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Fóruns</h2>
            <div className="mt-2">
              <Badge className="bg-cyan-500 text-white text-md py-1 px-4 hover:bg-cyan-600 cursor-pointer">
                {userData.forums[0].name}
                <Check className="h-4 w-4 ml-2" />
              </Badge>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Portifólio</h2>
            <a href={`https://${userData.portfolioUrl}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 mt-2 block hover:underline">
              {userData.portfolioUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Fórum
function ForumContent() {
  return (
    <div className="flex items-center justify-center w-full">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2">
              <Avatar>
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback className="bg-white">CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="" alt="@maxleiter" />
                <AvatarFallback className="bg-white">LR</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="" alt="@evilrabbit" />
                <AvatarFallback className="bg-white">ER</AvatarFallback>
              </Avatar>
            </div>
          </EmptyMedia>
          <EmptyTitle className="text-white">Nenhuma turma encontrada.</EmptyTitle>
          <EmptyDescription className="text-white">Entre, ou convide colaboradores para seu fórum.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex">
          <Button className="bg-blue-700 text-white hover:bg-blue-800">
            <PlusIcon />
            Convidar
          </Button>
          <div className="flex items-center justify-center gap-3">
            <input
              required
              type="text"
              placeholder="Já possui um convite? Use aqui."
              className="w-full bg-transparent text-white text-sm py-3 px-2 border-b-2 border-white/40 focus:border-white focus:outline-none transition placeholder:text-white/50"
            />
            <Button className="bg-white">
              <Check color="blue"/>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

// Componente Principal do Dashboard
export function Dashboard() {
  const [currentView, setCurrentView] = useState<string>('home');

  const getGreeting = () => {
    const now = new Date();
    const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false }));
    if (hour >= 5 && hour < 12) return "Bom dia";
    else if (hour >= 12 && hour < 18) return "Boa tarde";
    else return "Boa noite";
  };

  const renderContent = () => {
    switch (currentView) {
      case 'tarefas':
        return <TarefasContent />;
      case 'conquistas':
        return <ConquistasContent />;
      case 'perfil':
        return <PerfilContent />;
      case 'forum':
        return <ForumContent />;
      default:
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                {getGreeting()}, Usuário Teste.
              </h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-auto">
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

              <Card onClick={() => setCurrentView('tarefas')} className="col-span-2 md:col-span-1 h-32 md:h-36 flex flex-col justify-center p-3 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                  <CardTitle className="text-white text-sm md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                    Tarefas
                  </CardTitle>
                  <p className="text-white/90 text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                    Aliste suas tarefas pendentes.
                  </p>
                </CardHeader>
              </Card>

              <Card onClick={() => setCurrentView('conquistas')} className="col-span-1 h-32 md:h-36 flex flex-col justify-center p-2 md:p-3 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                  <CardTitle className="text-white text-sm md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                    Conquistas
                  </CardTitle>
                  <p className="text-white/90 text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                    Seu progresso na plataforma
                  </p>
                </CardHeader>
              </Card>

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

              <Card onClick={() => setCurrentView('perfil')} className="col-span-1 h-32 md:h-36 flex flex-col justify-center p-2 md:p-3 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                  <CardTitle className="text-white text-xs md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                    Perfil de usuário
                  </CardTitle>
                  <p className="text-white/90 text-[10px] md:text-sm opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                    Visualize e edite seu perfil
                  </p>
                </CardHeader>
              </Card>

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

              <Card onClick={() => setCurrentView('forum')} className="col-span-2 md:col-span-2 lg:col-span-1 h-32 md:h-36 flex flex-col justify-center p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                  <CardTitle className="text-white text-sm md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                    Fórum da Turma
                  </CardTitle>
                  <p className="text-white/90 text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                    Converse com colegas
                  </p>
                </CardHeader>
              </Card>

              <Card className="col-span-2 md:col-span-2 lg:col-span-1 h-32 md:h-36 flex flex-col justify-center items-center p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                <Plus/>
              </Card>
              <a href="/planos" className='col-span-2 md:col-span-3 lg:col-span-4 h-6 md:h-6'>
                  <Card className=" flex flex-col justify-center items-center p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                    <p className='text-xs'>Adquira nossos planos e obtenha acesso a todos os recursos</p>
                  </Card>
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/5 backdrop-blur-sm border-b border-white/10 px-4 md:px-8 py-4">
        <div className=" mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentView !== 'home' && (
              <Button
                onClick={() => setCurrentView('home')}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-lg md:text-xl font-semibold text-white">
              Dashboard
            </h2>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                  <AvatarFallback>UT</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userData.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">usuario@email.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCurrentView('perfil')}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 text-white">
        {renderContent()}
      </div>
    </div>
  );
}