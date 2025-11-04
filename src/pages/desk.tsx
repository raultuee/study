import { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  MessageSquare, 
  FileText, 
  Calculator, 
  Clock, 
  BookOpen, 
  Minimize2, 
  Maximize2, 
  X,
  Send,
  Save,
  Trash2,
  Plus,
  ArrowLeft,
  Move,
  ChevronsDown, 
  ChevronsUp,   
} from 'lucide-react';
import { 
  motion, 
  AnimatePresence, 
  useDragControls, 
  PanInfo 
} from 'framer-motion';

// --- TIPOS ---

type Tool = {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
};

type OpenTool = {
  id: string;
  tool: Tool;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number }; 
  zIndex: number;
};

type Note = {
  id: number;
  title: string;
  content: string;
  timestamp: Date;
};

type ChatMessage = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type ToolWindowProps = {
  openTool: OpenTool;
  containerRef: React.RefObject<HTMLDivElement>;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onDragEnd: (id: string, info: PanInfo) => void;
  onResizeStart: (e: React.MouseEvent | React.TouchEvent, id: string) => void;
  renderToolContent: (tool: Tool) => ReactNode;
};

// --- CONSTANTES ---

const tools: Tool[] = [
  { id: 'search', name: 'Pesquisa Rápida', icon: Search, color: 'bg-blue-500' },
  { id: 'chat', name: 'Chat com IA', icon: MessageSquare, color: 'bg-purple-500' },
  { id: 'notes', name: 'Anotações', icon: FileText, color: 'bg-green-500' },
  { id: 'calculator', name: 'Calculadora', icon: Calculator, color: 'bg-orange-500' },
  { id: 'timer', name: 'Cronômetro', icon: Clock, color: 'bg-red-500' },
  { id: 'reading', name: 'Modo Leitura', icon: BookOpen, color: 'bg-cyan-500' },
];

const INITIAL_Z_INDEX = 10;
const INITIAL_WIDTH = 400;
const INITIAL_HEIGHT = 450;

// --- COMPONENTE DA JANELA (ToolWindow) ---

function ToolWindow({
  openTool,
  containerRef,
  onClose,
  onMinimize,
  onFocus,
  onDragEnd,
  onResizeStart,
  renderToolContent
}: ToolWindowProps) {
  
  const controls = useDragControls();
  const Icon = openTool.tool.icon;

  const startDrag = (event: React.PointerEvent) => {
    controls.start(event);
  };

  return (
    <motion.div
      key={openTool.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: openTool.isMinimized ? 0.8 : 1,
        x: openTool.position.x,
        y: openTool.isMinimized 
        ? ((containerRef.current?.clientHeight || 0) / 2) - 30 
        : openTool.position.y,
        width: openTool.isMinimized ? '200px' : openTool.size.width + 'px',
        height: openTool.isMinimized ? 'auto' : openTool.size.height + 'px',
        zIndex: openTool.zIndex,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      drag
      dragListener={false}
      dragControls={controls}
      dragConstraints={containerRef}
      onDragEnd={(_, info) => onDragEnd(openTool.id, info)}
      onMouseDown={() => onFocus(openTool.id)}
      onTouchStart={() => onFocus(openTool.id)}
      className="absolute shadow-2xl rounded-lg overflow-hidden flex flex-col"
      style={{
        // Correção de precisão: Posição (left/top) removida para usar 'x' e 'y'
        width: openTool.isMinimized ? '200px' : openTool.size.width + 'px',
        height: openTool.isMinimized ? 'auto' : openTool.size.height + 'px',
        pointerEvents: 'auto',
      }}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden flex-1 flex flex-col">
        {/* Window Header */}
        <div 
          className={`${openTool.tool.color} p-3 flex items-center justify-between cursor-grab`}
          onPointerDown={startDrag}
          style={{ touchAction: 'none' }}
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <Icon className="h-5 w-5 text-white" />
            <h3 className="text-white font-semibold">{openTool.tool.name}</h3>
          </div>
          <div className="flex items-center gap-1 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMinimize(openTool.id)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              {openTool.isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onClose(openTool.id)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Window Content */}
        {!openTool.isMinimized && (
          <CardContent className="p-4 bg-blue-900/50 flex-1 overflow-y-auto">
            {renderToolContent(openTool.tool)}
          </CardContent>
        )}
      </Card>
      
      {/* Handle de Redimensionamento */}
      {!openTool.isMinimized && (
        <div
          onMouseDown={(e) => onResizeStart(e, openTool.id)}
          onTouchStart={(e) => onResizeStart(e, openTool.id)}
          className="absolute bottom-0 right-0 p-1 cursor-nwse-resize bg-white/20 rounded-tl-lg"
          style={{ zIndex: openTool.zIndex + 1, pointerEvents: 'auto' }}
        >
          <Move className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}


// --- COMPONENTE PRINCIPAL (DESK) ---

export function Desk() {
  const [openTools, setOpenTools] = useState<OpenTool[]>([]);
  const [zIndexCounter, setZIndexCounter] = useState(INITIAL_Z_INDEX + 1);
  const [isToolbarMinimized, setIsToolbarMinimized] = useState(false); // <-- NOVO ESTADO

  // Estados das ferramentas
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '' });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrevValue, setCalcPrevValue] = useState<number | null>(null);
  const [calcOperation, setCalcOperation] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const openTool = (tool: Tool) => {
    const existingTool = openTools.find(t => t.tool.id === tool.id);
    
    if (existingTool) {
      focusTool(existingTool.id);
      // Se estiver minimizada, restaura
      if (existingTool.isMinimized) {
        toggleMinimize(existingTool.id);
      }
      return;
    }
    
    const newTool: OpenTool = {
      id: `${tool.id}-${Date.now()}`,
      tool,
      isMinimized: false,
      position: { x: 50 + openTools.length * 30, y: 50 + openTools.length * 30 },
      size: { width: INITIAL_WIDTH, height: INITIAL_HEIGHT },
      zIndex: zIndexCounter,
    };
    
    setZIndexCounter(prev => prev + 1);
    setOpenTools([...openTools, newTool]);
  };

  const closeTool = (id: string) => {
    setOpenTools(openTools.filter(t => t.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setOpenTools(openTools.map(t => 
      t.id === id ? { ...t, isMinimized: !t.isMinimized } : t
    ));
    focusTool(id);
  };

  const focusTool = (id: string) => {
    setOpenTools(prevTools => {
      const toolToFocus = prevTools.find(t => t.id === id);
      if (toolToFocus && toolToFocus.zIndex < zIndexCounter - 1) { 
        setZIndexCounter(prev => prev + 1);
        return prevTools.map(t => 
          t.id === id ? { ...t, zIndex: zIndexCounter } : t
        );
      }
      return prevTools;
    });
  };

  const handleDragEnd = (id: string, info: PanInfo) => {
    setOpenTools(prevTools => prevTools.map(t => 
      t.id === id ? { ...t, position: { x: info.point.x, y: info.point.y } } : t
    ));
  };

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();

    const tool = openTools.find(t => t.id === id);
    if (!tool) return;

    const startX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const startY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
    const startWidth = tool.size.width;
    const startHeight = tool.size.height;

    focusTool(id);

    const doDrag = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'clientX' in moveEvent ? moveEvent.clientX : (moveEvent as TouchEvent).touches[0].clientX;
      const clientY = 'clientY' in moveEvent ? moveEvent.clientY : (moveEvent as TouchEvent).touches[0].clientY;
      
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      setOpenTools(prevTools => prevTools.map(t => 
        t.id === id ? { 
          ...t, 
          size: { 
            width: Math.max(250, startWidth + deltaX),
            height: Math.max(150, startHeight + deltaY)
          } 
        } : t
      ));
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', doDrag);
      document.removeEventListener('touchend', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', doDrag);
    document.addEventListener('touchend', stopDrag);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTools]);


  // --- Funções das Ferramentas (Sem alterações) ---

  const handleSaveNote = () => {
    if (currentNote.title.trim() === '' || currentNote.content.trim() === '') return;
    const newNote: Note = {
      id: Date.now(),
      title: currentNote.title,
      content: currentNote.content,
      timestamp: new Date()
    };
    setNotes([newNote, ...notes]);
    setCurrentNote({ title: '', content: '' });
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;
    const userMessage: ChatMessage = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        text: 'Olá! Sou sua assistente de estudos. Como posso ajudá-lo hoje?',
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  const handleCalcButton = (value: string) => {
    if (value === 'C') {
      setCalcDisplay('0');
      setCalcPrevValue(null);
      setCalcOperation(null);
    } else if (['+', '-', '×', '÷'].includes(value)) {
      setCalcPrevValue(parseFloat(calcDisplay));
      setCalcOperation(value);
      setCalcDisplay('0');
    } else if (value === '=') {
      if (calcPrevValue !== null && calcOperation) {
        const current = parseFloat(calcDisplay);
        let result = 0;
        switch (calcOperation) {
          case '+': result = calcPrevValue + current; break;
          case '-': result = calcPrevValue - current; break;
          case '×': result = calcPrevValue * current; break;
          case '÷': result = calcPrevValue / current; break;
        }
        setCalcDisplay(result.toString());
        setCalcPrevValue(null);
        setCalcOperation(null);
      }
    } else {
      setCalcDisplay(calcDisplay === '0' ? value : calcDisplay + value);
    }
  };

  useEffect(() => {
    let interval: number | undefined;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000) as unknown as number;
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const startTimer = () => setTimerRunning(true);
  const stopTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // --- Renderização do Conteúdo da Ferramenta (Sem alterações) ---

  const renderToolContent = (tool: Tool) => {
    switch (tool.id) {
      case 'search':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua pesquisa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-blue-900/50 border-blue-700/50 text-white"
              />
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-blue-200 text-sm">Pressione Enter ou clique no botão para pesquisar no Google</p>
          </div>
        );
      
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[300px]">
              {chatMessages.length === 0 ? (
                <p className="text-purple-300 text-center py-8">Inicie uma conversa com a IA!</p>
              ) : (
                chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-900/50 text-purple-100'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-purple-900/50 border-purple-700/50 text-white"
              />
              <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 'notes':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Título da anotação..."
                value={currentNote.title}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                className="bg-green-900/50 border-green-700/50 text-white"
              />
              <Textarea
                placeholder="Escreva suas anotações aqui..."
                value={currentNote.content}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e: { target: { value: any; }; }) => setCurrentNote({ ...currentNote, content: e.target.value })}
                className="bg-green-900/50 border-green-700/50 text-white min-h-[100px]"
              />
              <Button onClick={handleSaveNote} className="w-full bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Salvar Anotação
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              <h4 className="text-green-200 font-semibold text-sm">Anotações Salvas</h4>
              {notes.length === 0 ? (
                <p className="text-green-300 text-sm text-center py-4">Nenhuma anotação ainda</p>
              ) : (
                notes.map(note => (
                  <Card key={note.id} className="bg-green-900/30 border-green-700/50 p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="text-white font-semibold text-sm">{note.title}</h5>
                        <p className="text-green-200 text-xs mt-1 line-clamp-2">{note.content}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-400 hover:text-red-300 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      
      case 'calculator':
        { const calcButtons = [
          ['7', '8', '9', '÷'],
          ['4', '5', '6', '×'],
          ['1', '2', '3', '-'],
          ['0', 'C', '=', '+']
        ];
        
        return (
          <div className="space-y-4">
            <div className="bg-orange-900/50 p-4 rounded-lg">
              <p className="text-white text-right text-2xl font-mono">{calcDisplay}</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {calcButtons.flat().map((btn, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleCalcButton(btn)}
                  className="bg-orange-800/50 hover:bg-orange-700 text-white h-12"
                >
                  {btn}
                </Button>
              ))}
            </div>
          </div>
        ); }
      
      case 'timer':
        return (
          <div className="space-y-6 text-center">
            <div className="bg-red-900/50 p-8 rounded-lg">
              <p className="text-white text-5xl font-mono font-bold">{formatTime(timerSeconds)}</p>
            </div>
            <div className="flex gap-2 justify-center">
              {!timerRunning ? (
                <Button onClick={startTimer} className="bg-green-600 hover:bg-green-700">
                  Iniciar
                </Button>
              ) : (
                <Button onClick={stopTimer} className="bg-yellow-600 hover:bg-yellow-700">
                  Pausar
                </Button>
              )}
              <Button onClick={resetTimer} className="bg-red-600 hover:bg-red-700">
                Resetar
              </Button>
            </div>
          </div>
        );
      
      case 'reading':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Cole ou digite o texto que deseja ler em modo focado..."
              className="bg-cyan-900/50 border-cyan-700/50 text-white min-h-[300px] text-base leading-relaxed"
            />
            <p className="text-cyan-200 text-sm text-center">
              Use este espaço para leitura focada sem distrações
            </p>
          </div>
        );
      
      default:
        return <p className="text-white">Ferramenta em desenvolvimento</p>;
    }
  };

  // --- Renderização Principal (Desk) ---

  return (
    <div ref={containerRef} className="min-h-screen p-4 relative overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Mesa de Estudos</h1>
            <p className="text-blue-200">Organize seus estudos com ferramentas práticas</p>
          </div>
        </div>

        {/* Tools Bar (Normal) */}
        <AnimatePresence>
          {!isToolbarMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white font-semibold">Ferramentas Disponíveis</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsToolbarMinimized(true)}
                    className="text-white hover:bg-white/20"
                    title="Minimizar barra"
                  >
                    <ChevronsDown className="h-5 w-5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={tool.id}
                        onClick={() => openTool(tool)}
                        className={`${tool.color} hover:${tool.color} h-auto py-4 flex flex-col items-center gap-2 text-white`}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-xs text-center">{tool.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Open Tools Windows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <AnimatePresence>
          {openTools.map((openTool) => (
            <ToolWindow
              key={openTool.id}
              openTool={openTool}
              containerRef={containerRef}
              onClose={closeTool}
              onMinimize={toggleMinimize}
              onFocus={focusTool}
              onDragEnd={handleDragEnd}
              onResizeStart={handleResizeStart}
              renderToolContent={renderToolContent}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {openTools.length === 0 && !isToolbarMinimized && (
        <div className="text-center py-20 relative z-0">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto">
            <Plus className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Nenhuma ferramenta aberta
            </h3>
            <p className="text-blue-200">
              Clique em uma das ferramentas acima para começar seus estudos
            </p>
          </div>
        </div>
      )}

      {/* Minimized Tools Bar (Inferior Central) */}
      <AnimatePresence>
        {isToolbarMinimized && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
          >
            <Card className="bg-white/20 backdrop-blur-md border-white/30 p-2">
              <div className="flex items-center gap-1">
                {/* Maximize Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsToolbarMinimized(false)}
                  className="text-white hover:bg-white/20"
                  title="Maximizar barra"
                >
                  <ChevronsUp className="h-5 w-5" />
                </Button>

                {/* Divider */}
                <div className="w-px h-6 bg-white/30 mx-1" /> 

                {/* Tool Icons */}
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Button
                      key={tool.id}
                      onClick={() => openTool(tool)}
                      size="icon"
                      className={`${tool.color} hover:opacity-80 text-white`}
                      title={tool.name}
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}