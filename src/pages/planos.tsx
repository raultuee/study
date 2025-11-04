import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';


// 3. Componente da Página de Planos
export function Planos() {

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 text-white">
      <div className="w-full max-w-5xl mx-auto">
            <section 
            id="planos" 
            data-reveal
            className={`py-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 delay-400`}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Planos que cabem no seu bolso
                </h2>
                <p className="text-xl text-white max-w-2xl mx-auto">
                  Escolha o plano ideal para transformar seus estudos
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Plano ++ */}
                <Card className="bg-transparent border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover-lift card-shine relative overflow-hidden">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        Plano ++
                      </h3>
                      <p className="text-gray-200">Para estudantes que querem resultados reais</p>
                    </div>
                    
                    <div className="mb-8">
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold text-white">R$ 39</span>
                        <span className="text-gray-200 mb-2">/mês</span>
                      </div>
                      <p className="text-sm text-gray-200 mt-1">Cobrado anualmente • Economize 20%</p>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 mb-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      Começar Agora
                    </Button>

                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 group cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-200 group-hover:text-white transition-colors">Acesso ilimitado a todas as funções</span>
                      </li>
                      <li className="flex items-start gap-3 group cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-200 group-hover:text-white transition-colors">Fóruns de discussão privados</span>
                      </li>
                      <li className="flex items-start gap-3 group cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-200 group-hover:text-white transition-colors">Personalização do dashboard</span>
                      </li>
                      <li className="flex items-start gap-3 group cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-200 group-hover:text-white transition-colors">Diversos quizzes</span>
                      </li>
                      <li className="flex items-start gap-3 group cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-200 group-hover:text-white transition-colors">Badge exclusivo no perfil</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Plano +++ */}
                <Card className="bg-transparent border-2 border-blue-400 hover:border-blue-600 hover:shadow-2xl transition-all duration-300 relative overflow-hidden hover-lift card-shine scale-105">
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-1 text-sm font-semibold shadow-lg animate-pulse">
                    ⭐ Mais Popular
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50"></div>
                  <CardContent className="p-8 pt-12 relative z-10">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        Plano +++
                      </h3>
                      <p className="text-gray-600">Para quem quer o máximo desempenho</p>
                    </div>
                    
                    <div className="mb-8">
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">R$ 79</span>
                        <span className="text-gray-600 mb-2">/mês</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Cobrado anualmente • Economize 20%</p>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 mb-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                      Começar Agora
                    </Button>

                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 group cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-200 group-hover:text-white transition-colors font-semibold">Tudo do Plano ++</span>
                      </li>
                      <li className="flex items-start gap-3 group cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-200 group-hover:text-white transition-colors">IA auxiliar personalizada (Guru)</span>
                      </li>
                      <li className="flex items-start gap-3 group cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-200 group-hover:text-white transition-colors">Suporte prioritário</span>
                      </li>
                      <li className="flex items-start gap-3 group cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-200 group-hover:text-white transition-colors">Relatórios avançados de progresso</span>
                      </li>
                      <li className="flex items-start gap-3 group cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-200 group-hover:text-white transition-colors">Acesso antecipado a novos recursos</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
      </div>
    </div>
  );
}