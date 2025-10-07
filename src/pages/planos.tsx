import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// 1. Definição do tipo para cada plano
type Plan = {
  name: string;
  description: string;
  price: {
    monthly: number;
    annually: number;
  };
  features: string[];
  ctaText: string;
  isRecommended?: boolean;
};

// 2. Dados dos planos (fácil de modificar)
const plansData: Plan[] = [
  {
    name: "Plano ++",
    description: "Para indivíduos e profissionais que desejam levar seus estudos ao próximo nível.",
    price: {
      monthly: 49,
      annually: 39,
    },
    features: [
      "Acesso ilimitado a todos as funções",
      "Fóruns de discussão privados",
      "Personalização do dashboard",
      "Diversos quizzes",
      "Badge no perfil",
    ],
    ctaText: "Começar com o ++",
    isRecommended: true,
  },
  {
    name: "Plano +++",
    description: "Para organizações e turmas que precisam de colaboração e gerenciamento.",
    price: {
      monthly: 99,
      annually: 79,
    },
    features: [
      "Acesso ilimitado a todos as funções",
      "Fóruns de discussão privados",
      "Personalização do dashboard",
      "Diversos quizzes",
      "Badge no perfil",
      "IA auxiliar (Guru)",
    ],
    ctaText: "Contatar Vendas",
  },
];

// 3. Componente da Página de Planos
export function Planos() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 text-white">
      <div className="w-full max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-blue-200/80 max-w-2xl mx-auto">
            Comece gratuitamente e evolua conforme suas necessidades. Cancele a qualquer momento.
          </p>
        </header>

        {/* Toggle de Cobrança (Mensal/Anual) */}
        <div className="flex justify-center items-center gap-2 mb-10">
          <Button
            onClick={() => setBillingCycle('monthly')}
            variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
            className="text-white bg-white/10 hover:bg-white/20 data-[state=active]:bg-blue-600"
          >
            Mensal
          </Button>
          <div className="relative">
            <Button
              onClick={() => setBillingCycle('annually')}
              variant={billingCycle === 'annually' ? 'default' : 'ghost'}
              className="text-white bg-white/10 hover:bg-white/20 data-[state=active]:bg-blue-600"
            >
              Anual
            </Button>
            <Badge className="absolute -top-9 -right-8 bg-yellow-500 text-black text-xs px-2 py-0.5 transform -rotate-12">
              Economize 20%
            </Badge>
          </div>
        </div>

        {/* Grade de Planos */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {plansData.map((plan) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col rounded-2xl text-white bg-white/5 backdrop-blur-sm border-2 transition-all duration-300 ${plan.isRecommended ? 'border-cyan-400' : 'border-white/20'}`}
            >
              <CardHeader className="relative">
                {plan.isRecommended && (
                  <Badge className="absolute top-4 right-4 bg-cyan-500 text-white">Mais Popular</Badge>
                )}
                <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
                <CardDescription className="text-blue-200/80 pt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                {/* Preço Dinâmico */}
                <div className="mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={billingCycle}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-end"
                    >
                      <span className="text-5xl font-bold">
                        R$ {plan.price[billingCycle]}
                      </span>
                      <span className="text-lg text-blue-200/80 ml-2">
                        /mês
                      </span>
                    </motion.div>
                  </AnimatePresence>
                  <p className="text-sm text-blue-300/60 mt-1">
                    {billingCycle === 'annually' ? `Cobrado R$${plan.price.annually * 12} anualmente` : 'Cobrado mensalmente'}
                  </p>
                </div>
                
                {/* Botão de Ação */}
                <Button
                  onClick={() => {toast.info("Plano ainda em desenvolvimento.")}} 
                  size="lg" 
                  className={`w-full text-lg h-12 mb-8 ${plan.isRecommended ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  {plan.ctaText}
                </Button>

                {/* Lista de Benefícios */}
                <ul className="space-y-3 text-base text-blue-100/90 mt-auto">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
}