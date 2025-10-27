import { useEffect, useRef, useState } from 'react';
import { Calendar, MessageSquare, Brain, Users, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
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
  const observerRef = useRef<IntersectionObserver | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Study
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#recursos" className="text-gray-700 hover:text-blue-600 transition">Recursos</a>
              <a href="#beneficios" className="text-gray-700 hover:text-blue-600 transition">Benefícios</a>
              <a href="#depoimentos" className="text-gray-700 hover:text-blue-600 transition">Depoimentos</a>
            </div>

            <div className="hidden md:flex space-x-4">
              <a href="/login"><Button variant="ghost" className="text-blue-600">Entrar</Button></a>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">Começar Grátis</Button>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-blue-100">
            <div className="px-4 py-4 space-y-3">
              <a href="#recursos" className="block text-gray-700 hover:text-blue-600">Recursos</a>
              <a href="#beneficios" className="block text-gray-700 hover:text-blue-600">Benefícios</a>
              <a href="#depoimentos" className="block text-gray-700 hover:text-blue-600">Depoimentos</a>
              <a href="/login"><Button variant="ghost" className="w-full text-blue-600">Entrar</Button></a>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Começar Grátis</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        id="hero" 
        data-reveal
        className={`pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-blue-700 font-semibold text-sm">🎓 Sua jornada acadêmica começa aqui</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Organize. Estude.
            <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Conquiste.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A plataforma completa que transforma a rotina de estudos em resultados extraordinários. 
            Agenda inteligente, IA, quizzes e comunidade em um só lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              Começar Gratuitamente
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
              Ver Demonstração
            </Button>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
                  <div className="flex-1 h-4 bg-white/20 rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-32 bg-white/10 rounded-lg"></div>
                  <div className="h-32 bg-white/10 rounded-lg"></div>
                  <div className="h-32 bg-white/10 rounded-lg"></div>
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
              return (
                <Card 
                  key={index}
                  className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
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
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-600 to-blue-800 transition-all duration-1000 delay-300 ${
          visibleSections.has('beneficios') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
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
                className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" />
                <span className="text-white text-lg">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all">
              Comece Sua Transformação Hoje
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <section 
        id="resultados"
        data-reveal
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-800 to-white transition-all duration-1000 delay-300 ${
          visibleSections.has('resultados') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10' 
        }`}
      >
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Resultados de estudantes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
              
              <div className="flex flex-col items-center">
                <AnimatedNumber 
                  targetValue={10} 
                  duration={1500}
                  startOnVisible={visibleSections.has('resultados')}
                  suffix="h"
                  className="text-6xl md:text-7xl font-bold text-blue-900"
                />
                <p className="text-xl text-blue-900 mt-2">economizadas por semana</p>
              </div>
              
              <div className="flex flex-col items-center">
                <AnimatedNumber 
                  targetValue={40} 
                  duration={1500}
                  startOnVisible={visibleSections.has('resultados')}
                  suffix="%"
                  className="text-6xl md:text-7xl font-bold text-blue-900"
                />
                <p className="text-xl text-blue-900 mt-2">de aumento nas notas</p>
              </div>

              <div className="flex flex-col items-center">
                <AnimatedNumber
                  targetValue={3} 
                  duration={1500}
                  startOnVisible={visibleSections.has('resultados')}
                  suffix="x"
                  className="text-6xl md:text-7xl font-bold text-blue-900"
                />
                <p className="text-xl text-blue-900 mt-2">mais rápido para organizar sua rotina</p>
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
                name: "Ana Silva",
                role: "Estudante de Engenharia",
                text: "Minha organização melhorou 100%! Nunca mais perdi um prazo e minhas notas subiram muito."
              },
              {
                name: "Carlos Santos",
                role: "Cursinho Pré-Vestibular",
                text: "A IA me ajuda a tirar dúvidas na madrugada. É como ter um tutor particular 24/7!"
              },
              {
                name: "Julia Oliveira",
                role: "Estudante de Medicina",
                text: "Os quizzes são perfeitos para fixar conteúdo. Indispensável para quem estuda muito."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-2 border-blue-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
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
            <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano ++</h3>
                  <p className="text-gray-600">Para estudantes que querem resultados reais</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-blue-600">R$ 39</span>
                    <span className="text-gray-600 mb-2">/mês</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Cobrado anualmente • Economize 20%</p>
                </div>

                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 mb-8 py-6 text-lg">
                  Começar Agora
                </Button>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Acesso ilimitado a todas as funções</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Fóruns de discussão privados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Personalização do dashboard</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Diversos quizzes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Badge exclusivo no perfil</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Plano +++ */}
            <Card className="border-2 border-blue-400 hover:border-blue-600 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-1 text-sm font-semibold">
                Mais Popular
              </div>
              <CardContent className="p-8 pt-12">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano +++</h3>
                  <p className="text-gray-600">Para quem quer o máximo desempenho</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-blue-600">R$ 79</span>
                    <span className="text-gray-600 mb-2">/mês</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Cobrado anualmente • Economize 20%</p>
                </div>

                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 mb-8 py-6 text-lg">
                  Começar Agora
                </Button>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Tudo do Plano ++</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">IA auxiliar personalizada (Guru)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Suporte prioritário</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Relatórios avançados de progresso</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Acesso antecipado a novos recursos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para revolucionar seus estudos?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comece gratuitamente hoje e descubra como estudar de forma mais inteligente
          </p>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all">
            Criar Conta Grátis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="mt-4 text-blue-200 text-sm">Sem cartão de crédito • Sem compromisso • Cancele quando quiser</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold">Study</span>
              </div>
              <p className="text-gray-400">Transformando estudantes em campeões</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition">Preços</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Carreiras</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
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
};