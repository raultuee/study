import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Plus, User, Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Check, PlusIcon, Trash2 } from "lucide-react";
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
import { useAuth } from '@/auth/AuthContext';

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

type Quiz = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'fácil' | 'médio' | 'difícil';
};

type QuizSession = {
  grade: number;
  year: string;
  subject: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
};

// Dados dos quizzes por ano e matéria
// ...existing code...
const quizzesData: Record<string, Record<string, Quiz[]>> = {
  '1º ano': {
    'Matemática': [
      { id: 1, question: 'Qual é o valor de x na equação 2x + 6 = 18?', options: ['4', '6', '8', '10'], correctAnswer: 1, difficulty: 'fácil' },
      { id: 2, question: 'Em um gráfico cartesiano, qual quadrante contém pontos com x positivo e y negativo?', options: ['1º Quadrante', '2º Quadrante', '3º Quadrante', '4º Quadrante'], correctAnswer: 3, difficulty: 'fácil' },
      { id: 3, question: 'Qual é a raiz quadrada de 196?', options: ['12', '13', '14', '15'], correctAnswer: 2, difficulty: 'fácil' },
      { id: 4, question: 'Qual é o valor numérico da expressão 3(a + 2) para a = 4?', options: ['12', '15', '18', '20'], correctAnswer: 2, difficulty: 'fácil' },
      { id: 5, question: 'Qual é a soma dos ângulos internos de um pentágono?', options: ['360°', '540°', '720°', '900°'], correctAnswer: 1, difficulty: 'médio' },
      { id: 6, question: 'ENEM: Uma pessoa compra um produto com 10% de desconto e paga R$ 180. Qual era o preço original?', options: ['R$ 190', 'R$ 200', 'R$ 210', 'R$ 220'], correctAnswer: 1, difficulty: 'médio' },
      { id: 7, question: 'Um triângulo tem lados 7 cm, 8 cm e 15 cm. Ele é:', options: ['Equilátero', 'Isósceles', 'Escaleno', 'Não forma triângulo'], correctAnswer: 3, difficulty: 'médio' },
      { id: 8, question: 'Qual é o MMC de 12 e 20?', options: ['40', '60', '80', '100'], correctAnswer: 1, difficulty: 'médio' },
      { id: 9, question: 'ENEM: Um número é múltiplo de 9 se:', options: ['Terminar em 9', 'A soma dos algarismos for múltipla de 9', 'For divisor de 81', 'Tiver algarismos iguais'], correctAnswer: 1, difficulty: 'médio' },
      { id: 10, question: 'Qual é o valor de π arredondado para duas casas decimais?', options: ['3,12', '3,14', '3,15', '3,16'], correctAnswer: 1, difficulty: 'fácil' },
    ],
    'Português': [
      { id: 1, question: 'Qual é o sujeito da oração: "O gato subiu no telhado"?', options: ['O gato', 'no telhado', 'subiu', 'telhado'], correctAnswer: 0, difficulty: 'fácil' },
      { id: 2, question: 'Complete: "Ele _____ no parque ontem"', options: ['vai', 'foi', 'vai ir', 'irá'], correctAnswer: 1, difficulty: 'médio' },
    ],
    'Geografia': [
      { id: 1, question: 'Qual é a capital do Brasil?', options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'], correctAnswer: 2, difficulty: 'fácil' },
      { id: 2, question: 'Quantos continentes existem?', options: ['5', '6', '7', '8'], correctAnswer: 2, difficulty: 'fácil' },
    ],
    'História': [
      { id: 1, question: 'Em que ano o Brasil foi descoberto?', options: ['1492', '1500', '1530', '1550'], correctAnswer: 1, difficulty: 'fácil' },
      { id: 2, question: 'Quem foi o primeiro presidente do Brasil?', options: ['Pedro I', 'Deodoro da Fonseca', 'Getúlio Vargas', 'JK'], correctAnswer: 1, difficulty: 'médio' },
    ],
    'Biologia': [
      { id: 1, question: 'Quantas células tem o corpo humano aproximadamente?', options: ['37 bilhões', '37 trilhões', '37 milhões', '37 mil'], correctAnswer: 1, difficulty: 'médio' },
      { id: 2, question: 'Qual é a unidade básica da vida?', options: ['Molécula', 'Átomo', 'Célula', 'Tecido'], correctAnswer: 2, difficulty: 'fácil' },
    ],
  },
  '2º ano': {
    'Matemática': [
      { id: 11, question: 'A função f(x) = 2x – 6 corta o eixo x em:', options: ['x = 2', 'x = 3', 'x = 6', 'x = –3'], correctAnswer: 1, difficulty: 'médio' },
      { id: 12, question: 'Qual é o valor de log10(1000)?', options: ['1', '2', '3', '4'], correctAnswer: 2, difficulty: 'médio' },
      { id: 13, question: 'Uma progressão aritmética tem primeiro termo 4 e razão 3. Qual é o 10º termo?', options: ['28', '30', '31', '34'], correctAnswer: 2, difficulty: 'médio' },
      { id: 14, question: 'A função quadrática f(x) = x² - 4x + 4 possui:', options: ['2 raízes reais', '1 raiz real', 'Nenhuma raiz real', 'Raízes negativas'], correctAnswer: 1, difficulty: 'médio' },
      { id: 15, question: 'ENEM: Um capital de R$ 500 rende juros simples de 4% ao mês por 5 meses. O juro total é:', options: ['R$ 80', 'R$ 90', 'R$ 100', 'R$ 120'], correctAnswer: 2, difficulty: 'médio' },
      { id: 16, question: 'A circunferência de raio 7 cm tem valor aproximado de:', options: ['22 cm', '30 cm', '44 cm', '55 cm'], correctAnswer: 2, difficulty: 'médio' },
      { id: 17, question: 'Determine o determinante da matriz [[2,1],[3,4]].', options: ['5', '7', '8', '-2'], correctAnswer: 0, difficulty: 'médio' },
      { id: 18, question: 'Qual é a derivada de f(x) = x²?', options: ['x', '2x', 'x²', '2'], correctAnswer: 1, difficulty: 'médio' },
      { id: 19, question: 'O valor de sen(30°) é:', options: ['1', '0,5', '√3/2', '0'], correctAnswer: 1, difficulty: 'fácil' },
      { id: 20, question: 'ENEM: Uma cidade cresce 8% ao ano. Se possui 50 mil habitantes, quantos terá após 1 ano?', options: ['52.000', '54.000', '56.000', '58.000'], correctAnswer: 1, difficulty: 'médio' },
    ],
    'Português': [
      { id: 1, question: 'Qual é a figura de linguagem em: "Tenho milhões de coisas para fazer"?', options: ['Hipérbole', 'Metáfora', 'Metonímia', 'Personificação'], correctAnswer: 0, difficulty: 'médio' },
    ],
    'Geografia': [
      { id: 1, question: 'Qual é o maior oceano do mundo?', options: ['Atlântico', 'Índico', 'Pacífico', 'Ártico'], correctAnswer: 2, difficulty: 'fácil' },
    ],
    'História': [
      { id: 1, question: 'Em que ano terminou a Segunda Guerra Mundial?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, difficulty: 'médio' },
    ],
    'Biologia': [
      { id: 1, question: 'Qual é o papel das mitocôndrias?', options: ['Fotossíntese', 'Síntese proteica', 'Produção de energia', 'Armazenamento de água'], correctAnswer: 2, difficulty: 'médio' },
    ],
  },
  '3º ano': {
    'Matemática': [
      { id: 21, question: 'ENEM: A função exponencial f(x) = 2ⁿ representa crescimento. Qual afirmação é correta?', options: ['A função sempre decresce', 'A função cresce constantemente', 'A função cresce até x=0 e depois decresce', 'A função não é contínua'], correctAnswer: 1, difficulty: 'difícil' },
      { id: 22, question: 'A derivada de f(x) = 3x³ é:', options: ['6x', '9x²', '3x²', '9x'], correctAnswer: 1, difficulty: 'difícil' },
      { id: 23, question: 'A integral de ∫ x dx é:', options: ['x²', 'x²/2 + C', '2x + C', 'ln(x)'], correctAnswer: 1, difficulty: 'difícil' },
      { id: 24, question: 'O número e representa aproximadamente:', options: ['2,71', '3,14', '1,61', '1,41'], correctAnswer: 0, difficulty: 'difícil' },
      { id: 25, question: 'A área de um setor circular depende de:', options: ['Raio e ângulo', 'Somente do raio', 'Somente do diâmetro', 'Somente da circunferência'], correctAnswer: 0, difficulty: 'difícil' },
      { id: 26, question: 'ENEM: Se a probabilidade de um evento é 0,2, então a chance em % é:', options: ['10%', '20%', '25%', '40%'], correctAnswer: 1, difficulty: 'médio' },
      { id: 27, question: 'ENEM: O gráfico de uma função linear é:', options: ['Uma parábola', 'Uma reta', 'Uma hipérbole', 'Uma função descontínua'], correctAnswer: 1, difficulty: 'difícil' },
      { id: 28, question: 'O limite de lim (x→0) (sen x)/x é:', options: ['0', '1', '∞', 'Não existe'], correctAnswer: 1, difficulty: 'difícil' },
      { id: 29, question: 'Se f(x) = √x, então f(25) é:', options: ['4', '5', '6', '7'], correctAnswer: 1, difficulty: 'fácil' },
      { id: 30, question: 'Qual é a função inversa de f(x) = x + 7?', options: ['x − 7', 'x + 7', '7 − x', '1/x'], correctAnswer: 0, difficulty: 'médio' },
    ],
    'Português': [
      { id: 1, question: 'Identifique o tipo de narrador em: "Eu vi tudo acontecer"', options: ['Narrador em 1ª pessoa', 'Narrador em 2ª pessoa', 'Narrador em 3ª pessoa', 'Onisciente'], correctAnswer: 0, difficulty: 'difícil' },
    ],
    'Geografia': [
      { id: 1, question: 'Qual processo causa a formação de chuva ácida?', options: ['Evaporação', 'Poluição atmosférica', 'Condensação', 'Sublimação'], correctAnswer: 1, difficulty: 'difícil' },
    ],
    'História': [
      { id: 1, question: 'Qual foi o contexto político da Revolução Russa de 1917?', options: ['Capitalismo', 'Absolutismo', 'Anarquismo', 'Comunismo'], correctAnswer: 1, difficulty: 'difícil' },
    ],
    'Biologia': [
      { id: 1, question: 'Qual é o processo de divisão celular que produz gametas?', options: ['Mitose', 'Meiose', 'Citocinese', 'Interfase'], correctAnswer: 1, difficulty: 'difícil' },
    ],
  },
};

// Componente de Tarefas
function TarefasContent() {
  const [todos, setTodos] = useState<Todo[]>([]);
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

// Atualize a função getAchievementsData para aceitar currentView
const getAchievementsData = (currentView: string): Achievement[] => [
  {
    id: 1,
    title: "Primeiro Passo",
    description: "Acesse o dashboard pela primeira vez",
    unlocked: true,
  },
  {
    id: 2,
    title: "Organizador",
    description: "Acesse a seção de Tarefas",
    unlocked: currentView === 'tarefas',
  },
  {
    id: 3,
    title: "Planejador",
    description: "Acesse a seção de Agenda",
    unlocked: currentView === 'agenda',
  },
  {
    id: 4,
    title: "Estudioso",
    description: "Acesse a seção de Conquistas",
    unlocked: currentView === 'conquistas',
  },
  {
    id: 5,
    title: "Social",
    description: "Acesse o Fórum da Turma",
    unlocked: currentView === 'forum',
  },
  {
    id: 6,
    title: "Conhecedor",
    description: "Acesse a seção de Perfil",
    unlocked: currentView === 'perfil',
  }
];

// Componente de Conquistas atualizado
function ConquistasContent({ currentView }: { currentView: string }) {
  const achievementsData = getAchievementsData(currentView);
  const unlockedCount = achievementsData.filter((ach) => ach.unlocked).length;
  const totalAchievements = achievementsData.length;
  const progressPercentage = (unlockedCount / totalAchievements) * 100;

  const icons = [
    { id: 1, icon: "🎓" },
    { id: 2, icon: "📋" },
    { id: 3, icon: "📅" },
    { id: 4, icon: "🏆" },
    { id: 5, icon: "👥" },
    { id: 6, icon: "👤" }
  ];

  return (
    <div className="w-full max-w-4xl space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Conquistas</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Progress value={progressPercentage} className="h-3 bg-white/20 flex-1" />
          <span className="text-lg font-semibold text-white whitespace-nowrap">
            {unlockedCount}/{totalAchievements} ({Math.round(progressPercentage)}%)
          </span>
        </div>
      </header>
      
      <main className="space-y-3">
        <AnimatePresence>
          {achievementsData.map((achievement, index) => {
            const iconObj = icons.find(i => i.id === achievement.id);
            return (
              <motion.div
                key={achievement.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`border transition-all duration-300 group cursor-pointer ${
                    achievement.unlocked 
                      ? 'bg-blue-800/60 border-blue-600/50 hover:bg-blue-700/80 hover:shadow-lg hover:shadow-blue-500/30' 
                      : 'bg-blue-900/40 border-blue-700/30 opacity-60 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`text-4xl transition-transform ${
                        achievement.unlocked 
                          ? 'group-hover:scale-110 group-hover:animate-bounce' 
                          : 'grayscale opacity-50'
                      }`}>
                        {iconObj?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold transition-colors truncate ${
                          achievement.unlocked 
                            ? 'text-white'
                            : 'text-white/60'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm transition-colors truncate ${
                          achievement.unlocked 
                            ? 'text-blue-200' 
                            : 'text-blue-300/50'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {achievement.unlocked ? (
                        <Check className="w-6 h-6 text-green-400 group-hover:scale-125 transition-transform" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AgendaContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
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

// Dados do usuário
const userData: UserProfileData = {
  name: "Usuário Teste",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=João",
  bio: "Estudante etecano que está aproveitando a Study",
  plans: ["Plano ++", "Prata"],
  forums: [{ name: "ETEC Brasil", url: "https://dev-brasil.com" }],
  portfolioUrl: "usuarioteste.dev" ,
};

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

// Componente de Quizzes
// Substitua a função QuizContent existente por esta versão completa:

function QuizContent() {
  const [stage, setStage] = useState<'select-year' | 'select-subject' | 'quiz' | 'result'>('select-year');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState<QuizSession[]>([]);

  const years = ['1º ano', '2º ano', '3º ano'];
  const subjects = ['Matemática', 'Português', 'Geografia', 'História', 'Biologia'];

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setStage('select-subject');
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setScore(0);
    setStage('quiz');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);

    const quizzes = quizzesData[selectedYear][selectedSubject];
    const correctAnswer = quizzes[currentQuestionIndex].correctAnswer;
    
    if (answerIndex === correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < quizzes.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 500);
    } else {
      setTimeout(() => setStage('result'), 500);
    }
  };

  const handleFinishQuiz = () => {
    const quizzes = quizzesData[selectedYear][selectedSubject];
    const newSession: QuizSession = {
      grade: score,
      year: selectedYear,
      subject: selectedSubject,
      score: score,
      totalQuestions: quizzes.length,
      completedAt: new Date().toLocaleDateString('pt-BR'),
    };
    
    setQuizHistory([...quizHistory, newSession]);
    setStage('select-year');
    setSelectedYear('');
    setSelectedSubject('');
  };

  const handleBackToYearSelect = () => {
    setStage('select-year');
    setSelectedYear('');
    setSelectedSubject('');
  };

  const handleBackToSubjectSelect = () => {
    setStage('select-subject');
    setSelectedSubject('');
  };

  // Seleção de Ano
  if (stage === 'select-year') {
    return (
      <div className="w-full max-w-4xl space-y-8">
        <header>
          <h1 className="text-4xl font-bold mb-2 text-white">Quizzes</h1>
          <p className="text-blue-200/80">Teste seus conhecimentos e melhore seu aprendizado</p>
        </header>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Selecione seu ano</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {years.map((year) => (
              <motion.div
                key={year}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  onClick={() => handleYearSelect(year)}
                  className="border-blue-600/50 bg-blue-800/60 hover:bg-blue-700/80 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer transition-all duration-300 p-8"
                >
                  <div className="flex flex-col items-center justify-center h-32 gap-4">
                    <div className="text-5xl">📚</div>
                    <h3 className="text-white font-semibold text-xl text-center">{year}</h3>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {quizHistory.length > 0 && (
          <div className="space-y-4 mt-12">
            <h2 className="text-2xl font-semibold text-white">Histórico de Quizzes</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {quizHistory.map((session, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="p-4 bg-blue-900/40 border-blue-700/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-grow">
                          <h3 className="text-white font-semibold">{session.subject}</h3>
                          <p className="text-blue-200/70 text-sm">{session.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-lg">{session.score}/{session.totalQuestions}</p>
                          <p className="text-blue-200/70 text-xs">{session.completedAt}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Seleção de Matéria
  if (stage === 'select-subject') {
    return (
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Selecione a Matéria</h1>
            <p className="text-blue-200/80">{selectedYear}</p>
          </div>
          <Button
            onClick={handleBackToYearSelect}
            variant="ghost"
            className="text-white hover:bg-blue-800"
          >
            ← Voltar
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <motion.div
              key={subject}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                onClick={() => handleSubjectSelect(subject)}
                className="border-blue-600/50 bg-blue-800/60 hover:bg-blue-700/80 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer transition-all duration-300 p-8"
              >
                <div className="flex flex-col items-center justify-center h-40 gap-4">
                  <div className="text-5xl">
                    {subject === 'Matemática' && '🔢'}
                    {subject === 'Português' && '📖'}
                    {subject === 'Geografia' && '🗺️'}
                    {subject === 'História' && '📜'}
                    {subject === 'Biologia' && '🔬'}
                  </div>
                  <h3 className="text-white font-semibold text-xl text-center">{subject}</h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Quiz
  if (stage === 'quiz') {
    const quizzes = quizzesData[selectedYear][selectedSubject];
    const currentQuiz = quizzes[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizzes.length) * 100;

    return (
      <div className="w-full max-w-2xl space-y-8">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{selectedSubject}</h1>
              <p className="text-blue-200/80">{selectedYear}</p>
            </div>
            <Button
              onClick={handleBackToSubjectSelect}
              variant="ghost"
              className="text-white hover:bg-blue-800"
            >
              Cancelar
            </Button>
          </div>
          <Progress value={progress} className="h-3 bg-white/20" />
          <p className="text-white text-sm">Questão {currentQuestionIndex + 1} de {quizzes.length}</p>
        </header>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <Card className="p-8 bg-blue-900/80 border-blue-700/50">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
              {currentQuiz.question}
            </h2>

            <div className="space-y-3">
              {currentQuiz.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswers[currentQuestionIndex] !== undefined}
                  className={`w-full p-4 text-left rounded-lg font-semibold transition-all duration-300 ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? index === currentQuiz.correctAnswer
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                      : 'bg-blue-800/60 text-white hover:bg-blue-700/80 border border-blue-600/50'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </Card>

          {selectedAnswers[currentQuestionIndex] !== undefined && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg bg-blue-800/40 border border-blue-600/50"
            >
              <p className="text-white text-sm">
                {selectedAnswers[currentQuestionIndex] === currentQuiz.correctAnswer
                  ? '✓ Resposta correta!'
                  : '✗ Resposta incorreta. Tente novamente.'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // Resultado
  if (stage === 'result') {
    const quizzes = quizzesData[selectedYear][selectedSubject];
    const percentage = Math.round((score / quizzes.length) * 100);
    const resultMessage = percentage >= 80 ? 'Excelente!' : percentage >= 60 ? 'Bom trabalho!' : 'Tente novamente!';

    return (
      <div className="w-full max-w-2xl space-y-8 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          <div className="text-7xl mb-4">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
          </div>

          <h1 className="text-4xl font-bold text-white">{resultMessage}</h1>

          <Card className="p-8 bg-blue-900/80 border-blue-700/50 space-y-6">
            <div className="space-y-2">
              <p className="text-blue-200/80">Sua pontuação em</p>
              <h2 className="text-3xl font-bold text-white">{selectedSubject}</h2>
              <p className="text-blue-200/80">{selectedYear}</p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="text-6xl font-bold text-white">{score}</div>
              <div className="text-4xl text-blue-200/80">/</div>
              <div className="text-4xl text-blue-200/80">{quizzes.length}</div>
            </div>

            <div className="space-y-2">
              <Progress value={percentage} className="h-3 bg-white/20" />
              <p className="text-white font-semibold">{percentage}%</p>
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleFinishQuiz}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-6 text-lg"
            >
              Fazer outro Quiz
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
}

// Agora altere o card de Quizzes para chamar setCurrentView corretamente:


// ...existing code...

// Componente Principal do Dashboard
export function Dashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [isEditing, setIsEditing] = useState(false);
  const [dashboardBg, setDashboardBg] = useState("#0f172a");
  const [appointments] = useState<Appointment[]>([
    { id: 1, title: "Economia Circular", date: "2025-10-15", time: "15:00", description: "Aula sobre economia circular e sustentabilidade" },
    { id: 2, title: "Reunião de Projeto", date: "2025-10-12", time: "10:00", description: "Discussão sobre o projeto final" },
    { id: 3, title: "Apresentação TCC", date: "2025-10-20", time: "14:30", description: "Defesa do trabalho de conclusão de curso" },
  ]);
  
  const equipe = "💻 Deseja entrar para a Equipe de Desenvolvimento Study? Acesse: https://discord.gg/3M4xNrnsQv"
  useState(() => {
    // Só executa no client
    if (typeof window !== "undefined") {
      console.log(equipe);
    }
    return null;
  });

  const getInitials = (fullName?: string | null) => {
  if (!fullName) return 'US';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'US';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1][0] ?? '')).toUpperCase();
  };

  const displayName = user?.name ?? 'Usuário Teste';
  const displayEmail = user?.email ?? 'usuario@email.com';
  const displayAvatar = user?.avatarUrl ?? '';

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
        return <ConquistasContent currentView={currentView} />;
      case 'perfil':
        return <PerfilContent />;
      case 'forum':
        return <ForumContent />;
      case 'agenda':
        return <AgendaContent />;
      case 'quizzes':
        return <QuizContent />;
      default:
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                {getGreeting()}, Usuário Teste.
              </h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-auto">
              
                <Card className="col-span-2 md:col-span-2 lg:col-span-2 row-span-2 flex flex-col w-full justify-center p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden min-h-[200px]">
                <a href="/desk" className="block w-full h-full">
                  <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-2">
                    <CardTitle className="text-white text-lg md:text-xl lg:text-2xl mb-1 transform group-hover:-translate-y-4 transition-transform duration-500">
                      Iniciar Estudos
                    </CardTitle>
                    <p className="text-white/90 text-xs md:text-sm opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                      Inicie sua rotina de estudos com várias ferramentas disponíveis.
                    </p>
                  </CardHeader>
                </a>
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

              <Card 
                onClick={() => setCurrentView('quizzes')}
                className="col-span-1 h-32 md:h-36 flex flex-col justify-center p-2 md:p-3 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden hover:border-blue-400/50"
              >
                <CardHeader className="flex flex-col items-center justify-center h-full text-center relative p-1">
                  <CardTitle className="text-white text-xs md:text-base transform group-hover:-translate-y-4 transition-transform duration-500">
                      Quizzes
                  </CardTitle>
                  <p className="text-white/90 text-xs md:text-sm opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                    Reforce e prove seus conhecimentos
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

              <Card
                onClick={() => setIsEditing(true)}
                className="col-span-2 md:col-span-2 lg:col-span-1 h-32 md:h-36 flex flex-col justify-center items-center p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <Plus />
                <span className="text-xs mt-2">Editar Dashboard</span>
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

  // Renderização do modo sandbox
  const renderSandbox = () => (
    <div className="w-full h-full" style={{ background: dashboardBg, borderRadius: 16, padding: 16 }}>
      <div className="flex gap-4 mb-4">
        <label className="text-white">Cor do Dashboard:</label>
        <input
          type="color"
          value={dashboardBg}
          onChange={e => setDashboardBg(e.target.value)}
        />
        <Button onClick={() => setIsEditing(false)} className="ml-auto bg-green-600 text-white">Salvar</Button>
        <Button onClick={() => setIsEditing(false)} variant="ghost" className="text-white">Cancelar</Button>
      </div>
    </div>
  );

  // No renderContent, adicione:
  if (isEditing) return renderSandbox();

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/5 backdrop-blur-sm border-b border-white/10 px-4 md:px-8 py-4">
        <div className=" mx-auto flex items-center justify-between">
          <Button className="flex items-center gap-4 hover:bg-transparent" variant="ghost" onClick={() => setCurrentView('home')}>
            {/* ... */}
            <h2 className="text-lg md:text-xl font-semibold text-white">Dashboard</h2>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  {displayAvatar ? (
                    <AvatarImage src={displayAvatar} alt={displayName} />
                  ) : (
                    // fallback com iniciais
                    <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCurrentView('perfil')}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              {/* ... resto do menu ... */}
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