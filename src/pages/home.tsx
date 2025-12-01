import { useEffect, useRef, useState } from 'react';
import { Calendar, MessageSquare, Brain, Users, CheckCircle, ArrowRight, Menu, X, Trophy, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AnimatedNumberProps {
  targetValue: number;
  duration?: number;
  startOnVisible: boolean;
  suffix?: string;
  prefix?: string;
  precision?: number;
  className?: string;
}

const easeOutQuad = (t: number): number => t * (2 - t);

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  targetValue,
  duration = 1500,
  startOnVisible,
  suffix = '',
  prefix = '',
  precision = 0,
  className = ''
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startOnVisible) return;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      
      const newValue = easedProgress * targetValue;
      setCurrentValue(newValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      startTimeRef.current = null;
    };
  }, [startOnVisible, targetValue, duration]);

  return (
    <span className={className}>
      {prefix}{currentValue.toFixed(precision)}{suffix}
    </span>
  );
};

export function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [, setScrollY] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-reveal]');
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const features = [
    {
      icon: Calendar,
      title: "Agenda Inteligente",
      description: "Organize suas provas, trabalhos e entregas em um só lugar. Receba lembretes e nunca mais perca um prazo importante.",
      color: "bg-blue-500"
    },
    {
      icon: MessageSquare,
      title: "IA ao Seu Lado",
      description: "Chat instantâneo com inteligência artificial para tirar dúvidas, explicar conceitos e ajudar nos estudos 24/7.",
      color: "bg-blue-600"
    },
    {
      icon: Brain,
      title: "Quizzes Personalizados",
      description: "Teste seus conhecimentos com quizzes adaptativos que reforçam o aprendizado e identificam pontos de melhoria.",
      color: "bg-blue-700"
    },
    {
      icon: Users,
      title: "Comunidade Estudantil",
      description: "Conecte-se com outros estudantes, troque experiências, tire dúvidas e forme grupos de estudo.",
      color: "bg-blue-800"
    }
  ];

  const benefits = [
    "Aumente sua produtividade em até 70%",
    "Melhore suas notas com estudo direcionado",
    "Nunca mais esqueça uma entrega",
    "Aprenda no seu próprio ritmo",
    "Conecte-se com milhares de estudantes",
    "Acesso ilimitado à IA educacional"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.3); }
          50% { box-shadow: 0 0 40px rgba(37, 99, 235, 0.6); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .card-shine::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        .card-shine:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"
          style={{
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
            transform: `translate(-50%, -50%)`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl"
          style={{
            right: `${mousePosition.x / 30}px`,
            bottom: `${mousePosition.y / 30}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Study
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#recursos" className="text-gray-700 hover:text-blue-600 transition-all hover:scale-110">Recursos</a>
              <a href="#beneficios" className="text-gray-700 hover:text-blue-600 transition-all hover:scale-110">Benefícios</a>
              <a href="#depoimentos" className="text-gray-700 hover:text-blue-600 transition-all hover:scale-110">Depoimentos</a>
            </div>

            <div className="hidden md:flex space-x-4">
              <a href="/login">
                <Button variant="ghost" className="text-blue-600 hover:scale-105 transition-transform">
                  Entrar
                </Button>
              </a>
              <a href="/cadastro">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Começar Grátis
                </Button>
              </a>
            </div>

            <button 
              className="md:hidden transform hover:scale-110 transition-transform" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-blue-100 animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <a href="#recursos" className="block text-gray-700 hover:text-blue-600 hover:pl-2 transition-all">Recursos</a>
              <a href="#beneficios" className="block text-gray-700 hover:text-blue-600 hover:pl-2 transition-all">Benefícios</a>
              <a href="#depoimentos" className="block text-gray-700 hover:text-blue-600 hover:pl-2 transition-all">Depoimentos</a>
              <a href="/login"><Button variant="ghost" className="w-full text-blue-600">Entrar</Button></a>
              <a href=""><Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800">Começar Grátis</Button></a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        id="hero" 
        data-reveal
        className={`relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-blue-700 font-semibold text-sm flex items-center gap-2">
                🎓 Sua jornada acadêmica começa aqui
              </span>
            </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            <span className="inline-block animate-slide-in-left">Organize.</span>{' '}
            <span className="inline-block animate-slide-in-left" style={{ animationDelay: '0.1s' }}>Estude.</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              Conquiste.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A plataforma completa que transforma a rotina de estudos em resultados extraordinários. 
            Agenda inteligente, IA, quizzes e comunidade em um só lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="/cadastro">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 group">
              Começar Gratuitamente
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            </a>
            <Button variant="outline" className="text-lg px-8 py-6 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all">
              Ver Demonstração
            </Button>
          </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4 relative">
                  <div className="flex items-center space-x-4 animate-slide-in-left">
                    <div className="w-12 h-12 bg-white/20 rounded-lg animate-pulse"></div>
                    <div className="flex-1 h-4 bg-white/20 rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-32 bg-white/10 rounded-lg hover:bg-white/20 transition-all cursor-pointer hover-lift"></div>
                    <div className="h-32 bg-white/10 rounded-lg hover:bg-white/20 transition-all cursor-pointer hover-lift" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-32 bg-white/10 rounded-lg hover:bg-white/20 transition-all cursor-pointer hover-lift" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="recursos" 
        data-reveal
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-white transition-all duration-1000 delay-200 ${
          visibleSections.has('recursos') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para ter sucesso
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas poderosas e intuitivas desenvolvidas especialmente para estudantes como você
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isVisible = visibleSections.has('recursos');
              return (
                <Card 
                  key={index}
                  className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden group hover-lift card-shine relative"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${index * 0.1}s`
                  }}
                >
                  <CardContent className="p-8 relative z-10">
                    <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        id="beneficios" 
        data-reveal
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-600 to-blue-800 relative overflow-hidden transition-all duration-1000 delay-300 ${
          visibleSections.has('beneficios') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Por que escolher a Study?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Junte-se a milhares de estudantes que já transformaram sua rotina de estudos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 hover-lift cursor-pointer group"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <CheckCircle className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1 group-hover:scale-125 group-hover:text-white transition-all" />
                <span className="text-white text-lg group-hover:translate-x-1 transition-transform">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a href="/cadastro">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 group">
                Comece Sua Transformação Hoje
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="resultados"
        data-reveal
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-800 to-white transition-all duration-1000 delay-300 ${
          visibleSections.has('resultados') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10' 
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              Resultados de estudantes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <AnimatedNumber 
                  targetValue={10} 
                  duration={1500}
                  startOnVisible={visibleSections.has('resultados')}
                  suffix="h"
                  className="text-6xl md:text-7xl font-bold text-blue-900 relative z-10"
                />
              </div>
              <p className="text-xl text-blue-900 mt-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                economizadas por semana
              </p>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <AnimatedNumber 
                  targetValue={40} 
                  duration={1500}
                  startOnVisible={visibleSections.has('resultados')}
                  suffix="%"
                  className="text-6xl md:text-7xl font-bold text-blue-900 relative z-10"
                />
              </div>
              <p className="text-xl text-blue-900 mt-2 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                de aumento nas notas
              </p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <AnimatedNumber
                  targetValue={3} 
                  duration={1500}
                  startOnVisible={visibleSections.has('resultados')}
                  suffix="x"
                  className="text-6xl md:text-7xl font-bold text-blue-900 relative z-10"
                />
              </div>
              <p className="text-xl text-blue-900 mt-2 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                mais rápido para organizar sua rotina
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="depoimentos" 
        data-reveal
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-white transition-all duration-1000 delay-400 ${
          visibleSections.has('depoimentos') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              O que nossos estudantes dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Histórias reais de transformação e sucesso acadêmico
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Joaquim Rafael",
                role: "Estudante de Mecatrônica",
                text: "Minha organização melhorou 100%! Nunca mais perdi um prazo e minhas notas subiram muito."
              },
              {
                name: "Eduardo Rodrigues",
                role: "Estudante",
                text: "Os quizzes são perfeitos para fixar conteúdo. Indispensável para quem estuda muito."
              },
              {
                name: "Isaac Martins",
                role: "Estudante de Medicina",
                text: "A IA me ajuda a tirar dúvidas na madrugada. É como ter um tutor particular 24/7!"
              }
            ].map((testimonial, index) => (
              <Card 
                key={index} 
                className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 hover-lift card-shine relative overflow-hidden"
                style={{
                  animationDelay: `${index * 0.15}s`
                }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className="text-yellow-400 text-xl inline-block hover:scale-125 transition-transform cursor-pointer"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section 
        id="planos" 
        data-reveal
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50 transition-all duration-1000 delay-400 ${
          visibleSections.has('planos') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Planos que cabem no seu bolso
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para transformar seus estudos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plano ++ */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover-lift card-shine relative overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    Plano ++
                  </h3>
                  <p className="text-gray-600">Para estudantes que querem resultados reais</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-blue-600">R$ 39</span>
                    <span className="text-gray-600 mb-2">/mês</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Cobrado anualmente • Economize 20%</p>
                </div>

                <a href="/cadastro">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 mb-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Começar Agora
                  </Button>
                </a>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Acesso ilimitado a todas as funções</span>
                  </li>
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Fóruns de discussão privados</span>
                  </li>
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Personalização do dashboard</span>
                  </li>
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Diversos quizzes</span>
                  </li>
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Badge exclusivo no perfil</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Plano +++ */}
            <Card className="border-2 border-blue-400 hover:border-blue-600 hover:shadow-2xl transition-all duration-300 relative overflow-hidden hover-lift card-shine scale-105">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-1 text-sm font-semibold shadow-lg animate-pulse">
                ⭐ Mais Popular
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50"></div>
              <CardContent className="p-8 pt-12 relative z-10">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    Plano +++
                  </h3>
                  <p className="text-gray-600">Para quem quer o máximo desempenho</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">R$ 79</span>
                    <span className="text-gray-600 mb-2">/mês</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Cobrado anualmente • Economize 20%</p>
                </div>

              <a href="/cadastro">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 mb-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  Começar Agora
                </Button>
              </a>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-semibold">Tudo do Plano ++</span>
                  </li>
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">IA auxiliar personalizada (Guru)</span>
                  </li>
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Suporte prioritário</span>
                  </li>
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Relatórios avançados de progresso</span>
                  </li>
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Acesso antecipado a novos recursos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden animate-gradient">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para revolucionar seus estudos?
            </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comece gratuitamente hoje e descubra como estudar de forma mais inteligente
          </p>
          <a href="/cadastro">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-110 group">
              Criar Conta Grátis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </a>
          <p className="mt-4 text-blue-200 text-sm flex items-center justify-center gap-2 flex-wrap">
            <span>✓ Sem cartão de crédito</span>
            <span>•</span>
            <span>✓ Sem compromisso</span>
            <span>•</span>
            <span>✓ Cancele quando quiser</span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4 group cursor-pointer">
                <span className="text-xl font-bold">Study</span>
              </div>
              <p className="text-gray-400">Transformando estudantes em campeões</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-blue-400">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-blue-400">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">Carreiras</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-blue-400">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Study. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}