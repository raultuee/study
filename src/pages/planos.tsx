import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Planos() {
  const [showPlansAlert, setShowPlansAlert] = useState(true);

  return (
    <>
      {/* Pop-up de Alerta de Planos */}
      <AnimatePresence>
        {showPlansAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-gradient-to-br from-blue-900/90 to-blue-800/90 border-2 border-blue-500/60 rounded-2xl p-8 max-w-md w-full shadow-2xl backdrop-blur-md space-y-6 relative overflow-hidden"
            >
              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-30"></div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <Info className="w-8 h-8 text-blue-300 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-white">Planos Premium</h2>
                </div>
                <button
                  onClick={() => setShowPlansAlert(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                <p className="text-white/90 leading-relaxed">
                  Os planos <span className="font-semibold text-blue-200">premium</span> do Study estão disponíveis por <span className="font-bold text-blue-300">solicitação</span>.
                </p>

                <div className="bg-blue-800/50 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-sm text-white/80">
                    🚀 <span className="font-semibold">Se a demanda for alta</span>, continuaremos expandindo o projeto com novos recursos e plataformas!
                  </p>
                </div>

                <div className="space-y-2 bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-white/80 font-semibold">Como solicitar seu plano:</p>
                  <ul className="text-sm text-white/70 space-y-1">
                    <li>✓ Clique em "Solicitar" no plano desejado</li>
                    <li>✓ Aguarde nossa confirmação</li>
                  </ul>
                </div>

                <p className="text-xs text-white/60">
                  Obrigado por acreditar no Study! 💙
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPlansAlert(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl relative z-10"
              >
                Entendi!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      Solicitar
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
                      Solicitar
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
    </>
  );
}