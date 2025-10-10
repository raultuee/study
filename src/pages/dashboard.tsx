import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Plus, ArrowLeft, User, Settings, LogOut, Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
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

type Appointment = {
  id: number;
  title: string;
  date: string;
  time: string;
  description?: string;
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

function AgendaContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, title: "Economia Circular", date: "2025-10-15", time: "15:00", description: "Aula sobre economia circular e sustentabilidade" },
    { id: 2, title: "Reunião de Projeto", date: "2025-10-12", time: "10:00", description: "Discussão sobre o projeto final" },
    { id: 3, title: "Apresentação TCC", date: "2025-10-20", time: "14:30", description: "Defesa do trabalho de conclusão de curso" },
    { id: 4, title: "Prova de Matemática", date: "2025-10-18", time: "08:00", description: "Avaliação final do semestre" },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9, 1)); // Outubro 2025
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
  });

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() === "" || formData.date === "" || formData.time === "") return;
    
    const newAppointment: Appointment = {
      id: Date.now(),
      ...formData,
    };
    
    setAppointments([...appointments, newAppointment]);
    setFormData({ title: "", date: "", time: "", description: "" });
    setShowForm(false);
  };

  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getSortedAppointments = () => {
    return [...appointments].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const isToday = (dateStr: string) => {
    const today = new Date();
    const checkDate = new Date(dateStr + "T00:00:00");
    return checkDate.toDateString() === today.toDateString();
  };

  const isUpcoming = (dateStr: string, timeStr: string) => {
    const appointmentDate = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    return appointmentDate >= now;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setFormData({ ...formData, date: dateStr });
  };

  const filteredAppointments = selectedDate 
    ? appointments.filter(apt => apt.date === selectedDate)
    : getSortedAppointments();

  return (
    <div className="w-full max-w-7xl space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Agenda Pessoal</h1>
          <p className="text-blue-200/80">Organize seus compromissos e eventos</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-700 hover:bg-blue-800 text-white"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Compromisso
        </Button>
      </header>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="border-blue-700/50 bg-blue-900/80 p-6">
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-white mb-2 text-sm font-medium">Título</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Reunião, Aula, Compromisso..."
                  className="bg-blue-800 border-blue-700/50 text-white placeholder:text-blue-300/70"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-blue-800 border-blue-700/50 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 text-sm font-medium">Horário</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="bg-blue-800 border-blue-700/50 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2 text-sm font-medium">Descrição (opcional)</label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Adicione detalhes sobre o compromisso..."
                  className="bg-blue-800 border-blue-700/50 text-white placeholder:text-blue-300/70"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="ghost"
                  className="text-white hover:bg-blue-800"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  Salvar
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-1">
          <Card className="border-blue-700/50 bg-blue-900/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={previousMonth}
                className="text-white hover:bg-blue-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-white font-semibold text-lg capitalize">{monthName}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextMonth}
                className="text-white hover:bg-blue-800"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-blue-200/70 text-xs font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasAppointments = getAppointmentsForDate(dateStr).length > 0;
                const isSelected = selectedDate === dateStr;
                const todayDate = isToday(dateStr);

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative
                      ${isSelected ? 'bg-blue-600 text-white' : todayDate ? 'bg-blue-700/50 text-white' : 'text-blue-100 hover:bg-blue-800/50'}
                    `}
                  >
                    {day}
                    {hasAppointments && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDate(null)}
                  className="w-full text-white hover:bg-blue-800 text-sm"
                >
                  Mostrar todos os compromissos
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Lista de Compromissos */}
        <div className="lg:col-span-2">
          <Card className="border-blue-700/50 bg-blue-900/60 p-6">
            <h2 className="text-white font-semibold text-xl mb-4">
              {selectedDate ? `Compromissos de ${formatDate(selectedDate)}` : 'Próximos Compromissos'}
            </h2>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-blue-400/50" />
                  <p className="text-blue-300/80 text-lg">
                    {selectedDate ? 'Nenhum compromisso nesta data.' : 'Nenhum compromisso agendado.'}
                  </p>
                  <p className="text-blue-400/60 text-sm mt-2">
                    Adicione um novo compromisso para começar.
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredAppointments.map((appointment) => {
                    const upcoming = isUpcoming(appointment.date, appointment.time);
                    return (
                      <motion.div
                        key={appointment.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className={`p-4 transition-all duration-300 ${upcoming ? 'bg-blue-800/60 border-blue-600' : 'bg-blue-900/40 opacity-60'}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-grow space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-white font-semibold text-base">{appointment.title}</h3>
                                {upcoming && (
                                  <Badge className="bg-green-600 hover:bg-green-800 text-white text-xs">Próximo</Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-blue-200/80 text-sm">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span className="capitalize">{formatDate(appointment.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                              
                              {appointment.description && (
                                <p className="text-blue-200/70 text-sm mt-2">{appointment.description}</p>
                              )}
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="hover:bg-red-500/20 text-red-400 flex-shrink-0 ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </Card>
        </div>
      </div>
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
  const [appointments] = useState<Appointment[]>([
    { id: 1, title: "Economia Circular", date: "2025-10-15", time: "15:00", description: "Aula sobre economia circular e sustentabilidade" },
    { id: 2, title: "Reunião de Projeto", date: "2025-10-12", time: "10:00", description: "Discussão sobre o projeto final" },
    { id: 3, title: "Apresentação TCC", date: "2025-10-20", time: "14:30", description: "Defesa do trabalho de conclusão de curso" },
  ]);

  const getGreeting = () => {
    const now = new Date();
    const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false }));
    if (hour >= 5 && hour < 12) return "Bom dia";
    else if (hour >= 12 && hour < 18) return "Boa tarde";
    else return "Boa noite";
  };

  const getNextAppointment = () => {
    const now = new Date();
    const upcoming = appointments
      .filter(apt => {
        const aptDate = new Date(`${apt.date}T${apt.time}`);
        return aptDate >= now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
    return upcoming[0];
  };

  const nextAppointment = getNextAppointment();

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
      case 'agenda':
        return <AgendaContent />;
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

              <Card onClick={() => setCurrentView('agenda')} className="col-span-2 md:col-span-3 lg:col-span-2 h-32 md:h-36 flex flex-col justify-center p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                  <CardTitle className="text-white text-sm md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                    Agenda pessoal
                  </CardTitle>
                  <p className="text-white/90 text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs md:max-w-md leading-relaxed">
                    {nextAppointment ? `${nextAppointment.title} - ${nextAppointment.time}` : 'Nenhum compromisso próximo'}
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