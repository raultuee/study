import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Plus, User, Calendar, Clock, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
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
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Tipos
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  priority: 'baixa' | 'média' | 'alta';
  dueDate?: string;
  description?: string;
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
  "1º ano": {
    "Matemática": [
      { "id": 1, "question": "Qual é o valor de x na equação 2x + 6 = 18?", "options": ["4", "6", "8", "10"], "correctAnswer": 1, "difficulty": "fácil" },
      { "id": 2, "question": "Em um gráfico cartesiano, qual quadrante contém pontos com x positivo e y negativo?", "options": ["1º Quadrante", "2º Quadrante", "3º Quadrante", "4º Quadrante"], "correctAnswer": 3, "difficulty": "fácil" },
      { "id": 3, "question": "Qual é a raiz quadrada de 196?", "options": ["12", "13", "14", "15"], "correctAnswer": 2, "difficulty": "fácil" },
      { "id": 4, "question": "Qual é o valor numérico da expressão 3(a + 2) para a = 4?", "options": ["12", "15", "18", "20"], "correctAnswer": 2, "difficulty": "fácil" },
      { "id": 5, "question": "Qual é a soma dos ângulos internos de um pentágono?", "options": ["360°", "540°", "720°", "900°"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 6, "question": "ENEM: Uma pessoa compra um produto com 10% de desconto e paga R$ 180. Qual era o preço original?", "options": ["R$ 190", "R$ 200", "R$ 210", "R$ 220"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 7, "question": "Um triângulo tem lados 7 cm, 8 cm e 15 cm. Ele é:", "options": ["Equilátero", "Isósceles", "Escaleno", "Não forma triângulo"], "correctAnswer": 3, "difficulty": "médio" },
      { "id": 8, "question": "Qual é o MMC de 12 e 20?", "options": ["40", "60", "80", "100"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 9, "question": "ENEM: Um número é múltiplo de 9 se:", "options": ["Terminar em 9", "A soma dos algarismos for múltipla de 9", "For divisor de 81", "Tiver algarismos iguais"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 10, "question": "Qual é o valor de π arredondado para duas casas decimais?", "options": ["3,12", "3,14", "3,15", "3,16"], "correctAnswer": 1, "difficulty": "fácil" }
    ],
    "Português": [
      { "id": 1, "question": "Analise a frase: 'Às vezes, o que pensamos não corresponde à realidade.' Em 'Às vezes', qual é a classe de palavra e função sintática?", "options": ["Advérbio de tempo / adjunto adverbial", "Preposição / complemento nominal", "Conjunção / conectivo", "Pronome / sujeito oculto"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 2, "question": "Assinale a opção em que a crase está corretamente empregada.", "options": ["Vou à pé até a escola", "Referi-me àqueles alunos", "Chegou à meia-noite", "Entrega feita à mão"], "correctAnswer": 2, "difficulty": "difícil" },
      { "id": 3, "question": "Em relação à coerência textual, qual estratégia melhora a coesão entre parágrafos?", "options": ["Repetição exata de palavras", "Uso de conectivos adequados e retomada pronominal", "Eliminar pronomes para evitar ambiguidade", "Aumentar o número de citações diretas"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 4, "question": "Classifique a figura de linguagem: 'O tempo é um ladrão que nos rouba momentos.'", "options": ["Metáfora", "Metonímia", "Hipérbole", "Antítese"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 5, "question": "Marque a alternativa com concordância verbal correta:", "options": ["Houveram muitos problemas ontem", "Fizeram-se necessárias várias providências", "Fazem-se evidente os erros", "Chegaram o enviado e a equipe"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 6, "question": "Sobre regência verbal, qual frase está correta?", "options": ["Preciso de que ele venha", "Assisti o filme ontem", "Gostaria de participar do evento", "Ela depende de que a convidem"], "correctAnswer": 2, "difficulty": "médio" },
      { "id": 7, "question": "Qual alternativa apresenta um período composto por subordinação?", "options": ["Saí cedo e cheguei a tempo", "Estudarei porque tenho prova", "Muitos vieram, porém poucos ficaram", "Ele correu, perdeu o ônibus"], "correctAnswer": 1, "difficulty": "fácil" },
      { "id": 8, "question": "No trecho 'Os jovens, animados, conversavam', qual é a função do termo 'animados'?", "options": ["Adjunto adverbial", "Predicativo do sujeito", "Complemento nominal", "Objeto direto"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 9, "question": "Assinale a alternativa em que há ambiguidade de sentido:", "options": ["Vi João com binóculo", "Observei a cena atentamente", "Ela trouxe o bolo", "Eles resolveram o problema"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 10, "question": "Sobre intertextualidade, qual prática exemplifica esse recurso?", "options": ["Citar trecho de outro autor e dialogar com ele", "Usar somente frases originais", "Excluir referências históricas", "Manter estilo único sem influências"], "correctAnswer": 0, "difficulty": "difícil" }
    ],
    "Geografia": [
      { "id": 1, "question": "Explique por que a zona de convergência intertropical (ZCIT) é importante para o regime pluviométrico do Brasil norte e nordeste.", "options": ["Porque determina marés", "Porque favorece convecção e chuvas sazonais", "Porque impede ventos", "Porque aumenta a salinidade"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 2, "question": "Qual é a principal diferença entre clima e tempo atmosférico?", "options": ["Clima refere-se ao estado momentâneo, tempo a longo prazo", "Clima é a média de variáveis atmosféricas; tempo é o estado momentâneo", "São sinônimos", "Tempo refere-se só à temperatura"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 3, "question": "Em cartografia, o que significa a escala 1:250.000?", "options": ["1 unidade no mapa = 250.000 unidades no terreno", "1 cm = 2.500 cm", "Mapas urbanos apenas", "Referência de altitude"], "correctAnswer": 0, "difficulty": "fácil" },
      { "id": 4, "question": "Explique brevemente como funciona a subsidência urbana e um de seus impactos.", "options": ["Elevação do solo; aumento da vegetação", "Afundamento do solo por extração de água e danos a construções", "Aumento de temperatura local; diminuição de chuva", "Formação de ilhas; salinização"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 5, "question": "Qual bioma brasileiro sofre maior pressão por desmatamento para agricultura e pastagem?", "options": ["Amazônia", "Cerrado", "Mata Atlântica", "Caatinga"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 6, "question": "O que é gentrificação e qual é uma consequência social comum?", "options": ["Expansão industrial; mais emprego local", "Processo de requalificação urbana que desloca moradores de baixa renda", "Formação de novas favelas; melhoria da infraestrutura", "Política habitacional pública"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 7, "question": "Relacione corrente marítima fria à produtividade marinha: qual o efeito esperado?", "options": ["Menor oxigenação; menos vida marinha", "Correntes frias promovem ressurgência e alta produtividade biológica", "Aquecimento das águas; aumento de peixes tropicais", "Nenhuma relação"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 8, "question": "Explique o conceito de escalas de análise em Geografia e dê um exemplo prático.", "options": ["Escala é apenas mapa; exemplo: escala 1:50.000", "Escalas espacialmente mostram fenômenos locais, regionais e globais; exemplo: estudar mobilidade urbana (local) vs. migração internacional (global)", "Escala é tempo geológico; exemplo: era mesozoica", "Não se usa escalas"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 9, "question": "Qual é a relação entre urbanização acelerada e ilhas de calor nas cidades?", "options": ["Urbanização resfria áreas centrais", "Impermeabilização e materiais que retêm calor elevam temperatura local", "Aumento de vegetação reduz temperatura", "Nenhuma relação"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 10, "question": "Qual fenômeno explica a seca mais intensa no Nordeste brasileiro quando a ZCIT desloca-se?", "options": ["El Niño", "La Niña", "Oscilação do Atlântico Norte", "Oscilação Multidecadal"], "correctAnswer": 0, "difficulty": "difícil" }
    ],
    "História": [
      { "id": 1, "question": "Contextualize as capitanias hereditárias: qual foi a intenção inicial e por que fracassaram em muitos locais?", "options": ["Organizar a Igreja; fracassaram por corrupção e peste", "Distribuir terras para exploração e defesa; fracassaram por falta de recursos, ataques indígenas e isolamento", "Criar cidades-estado; fracassaram por revoltas internas", "Implementar comércio livre; fracassaram por falta de portos"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 2, "question": "Explique o papel da mineração no século XVIII para a estrutura social e econômica do Brasil colonial.", "options": ["Aumentou agricultura; diminuiu escravidão", "Gerou urbanização, imigração interna, centralidade de Minas e intensificou exploração escravista", "Tornou o Brasil independente imediatamente", "Nenhuma importância"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 3, "question": "Quais foram as principais causas econômicas da Proclamação da República no Brasil (1889)?", "options": ["Industrialização acelerada e crise do café; insatisfação militar e elites civis com o regime monárquico", "Chegada dos portugueses", "Revoltas indígenas", "Descoberta de ouro"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 4, "question": "Associe a Revolução Industrial à transformação das relações de trabalho.", "options": ["Trabalhadores passaram a controlar fábricas", "Processo de mecanização, urbanização e surgimento do proletariado industrial", "Redução da produção", "Maior autonomia camponesa"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 5, "question": "Explique uma consequência política da Primeira Guerra Mundial na ordem internacional.", "options": ["Fortalecimento do Império Austro-Húngaro", "Desmantelamento de impérios e criação da Liga das Nações", "Aumento do colonialismo europeu", "Nenhuma mudança"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 6, "question": "O que foi o movimento abolicionista no Brasil e qual estratégia principal usou para pressionar a monarquia?", "options": ["Revolta armada", "Campanhas jurídicas, mobilização urbana e pressão dos comerciantes e setores liberais", "Colonização", "Fuga em massa para a Europa"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 7, "question": "Explique brevemente a crise de 1929 e seu impacto no Brasil.", "options": ["Queda das Bolsas; reduziu a demanda por café e gerou crise econômica que impulsionou políticas de diversificação e industrialização", "Aumentou preços do café", "Levou à independência", "Sem impacto no Brasil"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 8, "question": "Qual a importância das invasões bárbaras para o fim do Império Romano do Ocidente?", "options": ["Fortaleceram o império", "Contribuíram para a fragmentação política e queda administrativa do Império", "Não ocorreram", "Unificaram a Europa"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 9, "question": "Identifique uma característica do Iluminismo e sua influência nas independências americanas.", "options": ["Valorização do absolutismo; diminuíram independências", "Valorização da razão, direitos naturais e contrato social; inspirou revoltas e movimentos de independência", "Rejeição da ciência", "Defesa do mercantilismo"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 10, "question": "Explique o que foi a 'política do café com leite' na República Velha brasileira.", "options": ["Aliança entre as oligarquias de São Paulo (café) e Minas Gerais (leite) para revezar a presidência e manter interesses regionais", "Política agrícola para aumentar produção de leite", "Plano econômico do governo Vargas", "Movimento operário"], "correctAnswer": 0, "difficulty": "difícil" }
    ],
    "Biologia": [
      { "id": 1, "question": "Explique o princípio básico da teoria celular.", "options": ["Células são formadas espontaneamente", "Todos os seres vivos são formados por células; a célula é a unidade básica da vida e provém de outras células", "Células não possuem material genético", "Seres vivos são feitos só de átomos"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 2, "question": "Qual é a função da membrana plasmática e seu modelo explicativo mais aceito?", "options": ["Proteção rígida; modelo de mosaico fluido", "Permeabilidade seletiva; modelo de mosaico fluido", "Produção de energia; teoria endossimbiótica", "Armazenamento de água; teoria da célula vegetal"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 3, "question": "Descreva brevemente o processo de fotossíntese e onde ocorre.", "options": ["Ocorre nas mitocôndrias; transforma O₂ em CO₂", "Ocorre nos cloroplastos; converte energia luminosa em energia química (glicídios) liberando O₂", "Ocorre no núcleo; sintetiza proteínas", "Ocorre na parede celular; armazena glicogênio"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 4, "question": "O que são enzimas e qual é sua importância?", "options": ["Proteínas que atuam como catalisadores biológicos, acelerando reações sem se consumirem", "Lipídios de reserva energética", "Ácidos nucleicos que armazenam informação", "Vitaminas que destroem proteínas"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 5, "question": "Explique a diferença entre autotrofia e heterotrofia.", "options": ["Autotrofos dependem de outros para alimento; heterotrofos produzem seu próprio alimento", "Autotrofos produzem seu próprio alimento (ex.: plantas); heterotrofos obtêm matéria orgânica de outros organismos (ex.: animais)", "São sinônimos", "Referem-se só ao habitat"], "correctAnswer": 1, "difficulty": "fácil" },
      { "id": 6, "question": "Qual a importância da homeostase para os organismos multicelulares?", "options": ["Mantém o equilíbrio interno e permite funcionamento adequado de células e órgãos", "Aumenta mutações", "É responsável apenas pelo crescimento", "Não tem importância"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 7, "question": "Explique o papel do RNA mensageiro (mRNA) na síntese proteica.", "options": ["Transporta aminoácidos até o ribossomo", "Leva informação do DNA até o ribossomo para orientar a montagem de proteínas", "É componente da membrana", "Atua como enzima digestiva"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 8, "question": "O que caracteriza uma espécie endêmica?", "options": ["Presença em todos os continentes", "Espécie restrita a uma área geográfica específica", "Espécie domesticada", "Espécie migratória"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 9, "question": "Diferencie população e comunidade em Ecologia.", "options": ["População = conjunto de indivíduos de espécies diferentes; comunidade = indivíduos da mesma espécie", "População = indivíduos da mesma espécie; comunidade = conjunto de populações de diferentes espécies interagindo", "São sinônimos", "Referem-se só a populações humanas"], "correctAnswer": 1, "difficulty": "fácil" },
      { "id": 10, "question": "Explique sucintamente a hipótese endossimbiótica para a origem de mitocôndrias e cloroplastos.", "options": ["Propõe que organelas derivaram de bactérias simbiontes que foram incorporadas por células ancestrais, explicando DNA próprio e dupla membrana", "Afirma que organelas surgiram por divisão celular recente", "Diz que são formadas por lipídios apenas", "Nega a presença de DNA em organelas"], "correctAnswer": 0, "difficulty": "difícil" }
    ]
  },

  "2º ano": {
    "Matemática": [
      { "id": 11, "question": "A função f(x) = 2x – 6 corta o eixo x em:", "options": ["x = 2", "x = 3", "x = 6", "x = –3"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 12, "question": "Qual é o valor de log10(1000)?", "options": ["1", "2", "3", "4"], "correctAnswer": 2, "difficulty": "médio" },
      { "id": 13, "question": "Uma progressão aritmética tem primeiro termo 4 e razão 3. Qual é o 10º termo?", "options": ["28", "30", "31", "34"], "correctAnswer": 2, "difficulty": "médio" },
      { "id": 14, "question": "A função quadrática f(x) = x² - 4x + 4 possui:", "options": ["2 raízes reais", "1 raiz real", "Nenhuma raiz real", "Raízes negativas"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 15, "question": "ENEM: Um capital de R$ 500 rende juros simples de 4% ao mês por 5 meses. O juro total é:", "options": ["R$ 80", "R$ 90", "R$ 100", "R$ 120"], "correctAnswer": 2, "difficulty": "médio" },
      { "id": 16, "question": "A circunferência de raio 7 cm tem valor aproximado de:", "options": ["22 cm", "30 cm", "44 cm", "55 cm"], "correctAnswer": 2, "difficulty": "médio" },
      { "id": 17, "question": "Determine o determinante da matriz [[2,1],[3,4]].", "options": ["5", "7", "8", "-2"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 18, "question": "Qual é a derivada de f(x) = x²?", "options": ["x", "2x", "x²", "2"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 19, "question": "O valor de sen(30°) é:", "options": ["1", "0.5", "√3/2", "0"], "correctAnswer": 1, "difficulty": "fácil" },
      { "id": 20, "question": "ENEM: Uma cidade cresce 8% ao ano. Se possui 50 mil habitantes, quantos terá após 1 ano?", "options": ["52.000", "54.000", "56.000", "58.000"], "correctAnswer": 1, "difficulty": "médio" }
    ],
    "Português": [
      { "id": 1, "question": "Interprete o trecho: 'A língua é um organismo vivo' — que concepção linguística está implícita e por quê?", "options": ["Estruturalismo; língua é estática", "A abordagem diacrônica e sociolinguística; língua muda e adapta-se ao uso social", "Gramática normativa; língua imutável", "Teoria generativa; língua não interage com sociedade"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 2, "question": "Analise a frase e identifique o objeto direto: 'O professor explicou a teoria aos alunos.'", "options": ["O professor", "explicou", "a teoria", "aos alunos"], "correctAnswer": 2, "difficulty": "fácil" },
      { "id": 3, "question": "Qual alternativa apresenta erro de regência nominal?", "options": ["Apreço por música", "Sede de justiça", "Dúvida de sua capacidade", "Ansioso por resposta"], "correctAnswer": 2, "difficulty": "difícil" },
      { "id": 4, "question": "Marque a alternativa que melhor define periodização literária do Modernismo brasileiro (1922):", "options": ["Retorno ao classicismo", "Ruptura estética e nacionalismo crítico com experimentações formais", "Reforço do parnasianismo", "Imposição do romantismo"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 5, "question": "Sobre a análise de discurso, qual é uma preocupação central?", "options": ["Apenas a gramática", "Relação entre linguagem, poder e ideologia", "Exclusivamente a metalinguagem", "Somente figuras de linguagem"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 6, "question": "No trecho 'Fazem dois anos que moro aqui', por que o verbo 'fazer' está no plural?", "options": ["Concordância com 'anos' e uso impessoal tendo sujeito pleonástico", "Erro gramatical", "Porque 'ano' é feminino", "Por causa do tempo verbal"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 7, "question": "Analise a coesão: qual recurso evita repetições e mantém a linearidade do texto?", "options": ["Elipse, substituição pronominal e conectivos", "Uso excessivo de sinônimos", "Quebras bruscas de parágrafo", "Repetição do mesmo termo"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 8, "question": "Qual característica define um narrador homodiegético?", "options": ["Narrador externo à história", "Narrador personagem que vive os acontecimentos", "Narrador onisciente", "Narrador ausente"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 9, "question": "Assinale a alternativa com uso correto de pontuação para separar orações coordenadas:", "options": ["Fui ao mercado, e comprei pão", "Saí cedo; choveu forte", "Ele estudou mas não passou", "Não há uso de vírgula entre coordenadas adversativas"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 10, "question": "Explique brevemente o que é variação linguística e dê um exemplo.", "options": ["Variação é erro; ex.: grafia diferente", "Mudanças na língua dependendo de fatores sociais, regionais ou situacionais; ex.: 'tu' vs 'você' no Brasil", "Língua imutável; ex.: latim", "Fenômeno exclusivo da escrita"], "correctAnswer": 1, "difficulty": "difícil" }
    ],
    "Geografia": [
      { "id": 1, "question": "Explique a teoria das placas tectônicas e um de seus principais efeitos geográficos.", "options": ["Placas fixas; não há efeitos", "A litosfera é fragmentada em placas que se movem; causa sismos, vulcanismo e orogênese", "Placas climáticas determinam vegetação", "Teoria foi refutada"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 2, "question": "Qual é a importância ecológica e econômica do manguezal?", "options": ["Não tem importância", "Atua como berçário de espécies aquáticas e protege a linha costeira; sustenta pesca local", "É apenas área de turismo", "Serve só para aquicultura"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 3, "question": "Explique a relação entre uso do solo e qualidade hídrica em bacias hidrográficas.", "options": ["Uso urbano e agrícola podem aumentar assoreamento e poluição, afetando qualidade e disponibilidade de água", "Uso do solo não influencia", "Somente influência climática importa", "Qualidade hídrica depende só do oceano"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 4, "question": "O que diferencia clima tropical de clima temperado?", "options": ["Temperatura constante no temperado", "Tropical apresenta altas temperaturas e estação seca/úmida; temperado tem estações bem definidas e amplitude térmica maior", "Tropical tem neve", "Temperado tem clima equatorial"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 5, "question": "Explique o conceito de desenvolvimento sustentável.", "options": ["Crescimento econômico a qualquer custo", "Desenvolvimento que satisfaz necessidades presentes sem comprometer as gerações futuras, equilibrando economia, sociedade e ambiente", "Somente preservação total do ambiente", "Apenas aumento de PIB"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 6, "question": "O que é desertificação e quais fatores humanos a agravam?", "options": ["Aumento de desertos por movimentos naturais apenas", "Degradação das terras em regiões áridas por sobrepastoreio, desmatamento, manejo inadequado e mudanças climáticas", "Processo de irrigação", "Expansão florestal"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 7, "question": "Qual função têm os índices de desenvolvimento humano (IDH) na geografia social?", "options": ["Medem só economia", "Avaliam dimensões de saúde, educação e renda para comparar bem-estar entre regiões", "Medem apenas alfabetização", "São irrelevantes"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 8, "question": "Explique a lógica de corredores ecológicos e sua importância.", "options": ["Apenas estética", "Conexões entre fragmentos de habitat que permitem fluxo genético e movimentos de espécies, reduzindo extinção local", "Substituem áreas protegidas", "São rodovias ecológicas para veículos"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 9, "question": "O que é ilhado climático (microclima) e como ele se forma em áreas urbanas?", "options": ["Fenômeno natural de floresta", "Variação microclimática devido a materiais urbanos, pouca vegetação e geometria urbana que retêm calor", "Refere-se apenas a ilhas tropicais", "Termo usado em oceanografia"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 10, "question": "Explique brevemente o conceito de vulnerabilidade socioambiental.", "options": ["Capacidade de resistir a mudanças econômicas", "Grau em que sistemas sociais e ambientais estão suscetíveis a danos por perigos naturais ou humanos, dependendo de exposição, sensibilidade e capacidade de resposta", "Medida de riqueza regional", "Sinônimo de poluição"], "correctAnswer": 1, "difficulty": "difícil" }
    ],
    "História": [
      { "id": 1, "question": "Explique as transformações políticas na Europa após as Revoluções de 1848.", "options": ["Estabilidade absoluta", "Surgimento de pressões por sufrágio, nacionalismo e reformas liberais, embora muitas revoltas tenham sido sufocadas", "Unificação imediata da Europa", "Nenhuma mudança social"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 2, "question": "Quais fatores contribuíram para a queda do Império Otomano no início do século XX?", "options": ["Fortalecimento econômico", "Problemas administrativos, nacionalismos étnicos, derrotas militares e intervenção estrangeira", "Aumento populacional", "Descoberta de ouro"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 3, "question": "Analise o papel das oligarquias agrárias no Brasil do século XIX.", "options": ["Foram marginalizadas", "Controlavam exportação, política local e influenciaram elites urbanas; resistiram a reformas que ameaçassem sua base econômica (latifúndio e trabalho escravo)", "Substituídas por industriais", "Apoiaram unificação operária"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 4, "question": "Explique a importância do Tratado de Tordesilhas para a colonização da América Portuguesa.", "options": ["Definiu fronteiras entre Espanha e Portugal, influenciando posse territorial; mais tarde pressionou negociações e disputas com outros colonizadores", "Unificou territórios indígenas", "Acabou com a escravidão", "Não teve impacto"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 5, "question": "Quais foram as causas e consequências imediatas da Revolução Russa de 1917?", "options": ["Causas: crise econômica e guerra; consequências: derrubada do czar, guerra civil e estabelecimento do regime soviético", "Causas: abundância alimentar", "Consequência: imediata democracia liberal", "Nenhuma relação com a guerra"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 6, "question": "Como a industrialização afetou as relações de gênero no século XIX?", "options": ["Restabeleceu papéis rurais", "Criou novas oportunidades de trabalho assalariado para mulheres, mas também gerou exploração e divisão do trabalho por gênero", "Eliminou desigualdades", "Não teve impacto"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 7, "question": "Explique o fenômeno do neocolonialismo no século XIX e início do XX.", "options": ["Nova forma de colonização baseada em controle econômico, investimentos e interferência política sem necessariamente ocupar territórios", "Redução do comércio internacional", "Fim do imperialismo", "Autonomia das colônias"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 8, "question": "O que foi a Era Vargas (1930–1945) no Brasil e uma de suas políticas centrais?", "options": ["Período de anarquia", "Centralização do poder e políticas de industrialização e de intervenção no mercado de trabalho (ex.: legislação trabalhista)", "Período exclusivamente agrário", "Retorno à monarquia"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 9, "question": "Explique brevemente o sistema de alianças que precedeu a Primeira Guerra Mundial.", "options": ["Sistema de alianças entre potências europeias (Tríplice Entente e Tríplice Aliança) criou blocos rivais que favoreceram escalada do conflito", "Não havia alianças", "Alianças favoreceram paz duradoura", "Alianças apenas comerciais"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 10, "question": "Analise o processo abolicionista tardio no Brasil: qual foi um fator que retardou a abolição plena?", "options": ["Pressão internacional imediata", "Interesses econômicos das elites escravistas e resistência de proprietários rurais", "Inexistência de movimentos abolicionistas", "Abundância de trabalho livre"], "correctAnswer": 1, "difficulty": "difícil" }
    ],
    "Biologia": [
      { "id": 1, "question": "Explique a diferença entre herança mendeliana e herança poligênica.", "options": ["Mendeliana envolve vários genes; poligênica envolve um gene", "Mendeliana envolve um gene com fenótipos discretos; poligênica envolve múltiplos genes contribuindo para um traço quantitativo", "São sinônimos", "Referem-se apenas a plantas"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 2, "question": "Qual o papel dos ribossomos na célula?", "options": ["Produção de ATP", "Síntese de proteínas por tradução do mRNA", "Reprodução celular", "Digestão intracelular"], "correctAnswer": 1, "difficulty": "fácil" },
      { "id": 3, "question": "Explique o mecanismo básico da seleção natural.", "options": ["Mutação dirigida", "Indivíduos com variações vantajosas têm maior chance de sobreviver e reproduzir, aumentando frequência desses traços na população", "Transformismo instantâneo", "Seleção artificial apenas"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 4, "question": "O que é epigênese no desenvolvimento embrionário?", "options": ["A ideia de que o organismo adulto já existe no ovo", "Processo em que formas complexas surgem por diferenciação progressiva e interação entre células e ambiente", "Sinônimo de clivagem", "Nenhuma relação com embriologia"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 5, "question": "Descreva o papel do sistema imunológico inato.", "options": ["Resposta específica e de memória", "Resposta imediata e inespecífica (barreiras físicas, células fagocíticas, inflamação)", "Produção de anticorpos apenas", "Responsável por digestão"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 6, "question": "Qual é a função principal dos cloroplastos?", "options": ["Respiração celular", "Fotossíntese", "Síntese de proteínas", "Armazenamento de lipídios"], "correctAnswer": 1, "difficulty": "fácil" },
      { "id": 7, "question": "Explique o que é fluxo gênico entre populações.", "options": ["Troca de genes por migração e reprodução entre populações, reduzindo divergência genética", "Mutação aleatória dentro de uma população", "Isolamento total", "Seleção artificial"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 8, "question": "Qual a importância da biodiversidade para a resiliência de ecossistemas?", "options": ["Diminui a resistência a perturbações", "Aumenta a capacidade de recuperação e manutenção de funções ecológicas diante de mudanças", "Impede polinização", "Apenas estética"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 9, "question": "O que é a bioacumulação e por que é preocupante?", "options": ["Acúmulo de resíduos em rios apenas", "Acúmulo progressivo de substâncias tóxicas nos organismos ao longo da cadeia alimentar, podendo atingir níveis perigosos em predadores", "Processo de decomposição", "Aumento de biomassa"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 10, "question": "Explique brevemente a técnica de PCR e sua aplicação.", "options": ["Sequenciamento de proteínas", "Reação em cadeia da polimerase para amplificar segmentos de DNA; usada em diagnóstico, pesquisa e identificação genética", "Extracção de RNA apenas", "Técnica de imagens"], "correctAnswer": 1, "difficulty": "difícil" }
    ]
  },

  "3º ano": {
    "Matemática": [
      { "id": 21, "question": "ENEM: A função exponencial f(x) = 2ⁿ representa crescimento. Qual afirmação é correta?", "options": ["A função sempre decresce", "A função cresce constantemente", "A função cresce até x=0 e depois decresce", "A função não é contínua"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 22, "question": "A derivada de f(x) = 3x³ é:", "options": ["6x", "9x²", "3x²", "9x"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 23, "question": "A integral de ∫ x dx é:", "options": ["x²", "x²/2 + C", "2x + C", "ln(x)"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 24, "question": "O número e representa aproximadamente:", "options": ["2,71", "3,14", "1,61", "1,41"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 25, "question": "A área de um setor circular depende de:", "options": ["Raio e ângulo", "Somente do raio", "Somente do diâmetro", "Somente da circunferência"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 26, "question": "ENEM: Se a probabilidade de um evento é 0,2, então a chance em % é:", "options": ["10%", "20%", "25%", "40%"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 27, "question": "ENEM: O gráfico de uma função linear é:", "options": ["Uma parábola", "Uma reta", "Uma hipérbole", "Uma função descontínua"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 28, "question": "O limite de lim (x→0) (sen x)/x é:", "options": ["0", "1", "∞", "Não existe"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 29, "question": "Se f(x) = √x, então f(25) é:", "options": ["4", "5", "6", "7"], "correctAnswer": 1, "difficulty": "fácil" },
      { "id": 30, "question": "Qual é a função inversa de f(x) = x + 7?", "options": ["x − 7", "x + 7", "7 − x", "1/x"], "correctAnswer": 0, "difficulty": "médio" }
    ],
    "Português": [
      { "id": 1, "question": "Analise o poema modernista: qual inovação formal principal o Modernismo de 1922 trouxe à poesia brasileira?", "options": ["Rigidez métrica", "Liberdade métrica, coloquialismo e experimentação linguística", "Retomada do parnasianismo", "Exclusão do verso livre"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 2, "question": "Sobre ambiguidade intencional em texto literário, qual é seu efeito mais comum?", "options": ["Elimina sentido", "Cria múltiplas camadas de interpretação e ambivalência semântica", "Simplifica a leitura", "É sempre erro do autor"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 3, "question": "Identifique a função da linguagem predominante em um discurso publicitário.", "options": ["Referencial", "Conativa (apelativa)", "Poética", "Fática"], "correctAnswer": 1, "difficulty": "fácil" },
      { "id": 4, "question": "Qual processo leva à formação de uma palavra composta por justaposição?", "options": ["União sem elemento de ligação (ex.: 'girassol')", "Uso de prefixo 're-'", "Derivação sufixal", "Aglutinação com preposição"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 5, "question": "Explique a diferença entre discurso direto e indireto livre.", "options": ["Direto cita; indireto livre mistura fala do personagem com narração sem marcas de fala", "São iguais", "Indireto livre exige aspas", "Direto sempre narra em terceira pessoa"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 6, "question": "Em análise sintática, qual é a diferença entre objeto direto e complemento nominal?", "options": ["Objeto rege verbo; complemento qualifica substantivo", "Ambos são iguais", "Complemento sempre é verbo", "Objeto é adjunto adverbial"], "correctAnswer": 0, "difficulty": "médio" },
      { "id": 7, "question": "Marque a alternativa que melhor descreve intertexto em um romance contemporâneo:", "options": ["Ausência de referências", "Presença intencional de citações, alusões e diálogos com outros textos que enriquecem o sentido", "Cópia literal sem autoria", "Somente uso de folclore"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 8, "question": "No trecho 'Era uma vez uma princesa que não sabia beijar sapos', que recurso de linguagem aparece principalmente?", "options": ["Antítese", "Ironia e desconstrução do conto tradicional", "Metáfora pura", "Assíndeto"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 9, "question": "Quando se analisa o enunciado, o que indica a modalidade epistêmica?", "options": ["Expressa fatos certos", "Indica grau de certeza, possibilidade ou dúvida (ex.: talvez, pode ser)", "Sempre se refere ao tempo", "É sinônimo de modo verbal"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 10, "question": "Explique por que a norma culta varia socialmente e dê um exemplo.", "options": ["Norma culta é fixa; não varia", "Varia conforme contexto sociocultural e educacional; ex.: uso de 'você' vs 'tu' dependendo da região e contexto formal", "Norma culta depende só da idade", "Não existe variação"], "correctAnswer": 1, "difficulty": "médio" }
    ],
    "Geografia": [
      { "id": 1, "question": "Explique por que a circulação atmosférica geral influencia os padrões climáticos globais.", "options": ["Não influencia", "Células de circulação (Hadley, Ferrel, Polar) redistribuem calor e umidade, determinando zonas áridas e úmidas", "Só afeta tsunamis", "Apenas correntes oceânicas importam"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 2, "question": "Qual o papel das águas subterrâneas no abastecimento humano e um risco associado?", "options": ["Não são usadas", "São reservatórios importantes; risco de contaminação por atividades agrícolas e extração excessiva (subsistência)", "Somente usadas na indústria", "São ilimitadas"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 3, "question": "Explique a relação entre uso de combustíveis fósseis e aumento do efeito estufa.", "options": ["Não há relação", "Queima libera CO₂ e outros gases que aumentam retenção de calor na atmosfera, intensificando o efeito estufa e mudanças climáticas", "Reduz CO₂", "Afeta só a ozonosfera"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 4, "question": "O que é um sistema urbano nacional e por que ele importa para políticas públicas?", "options": ["Conjunto hierarquizado de cidades que determina fluxos de bens, pessoas e serviços; importante para planejamento regional e investimentos", "Apenas cidades do interior", "Rede elétrica", "Só lazer"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 5, "question": "Explique o processo de erosão e um método de controle aplicado em encostas.", "options": ["Erosão é só vento", "Erosão é desgaste do solo por água/vento; controle: terraceamento, plantio de cobertura e obras de contenção", "Controle por queimadas", "Não há método eficaz"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 6, "question": "Como a globalização econômica afeta padrões de especialização regional?", "options": ["Uniformiza tudo sem diferenças", "Cria zonas de especialização conforme vantagens comparativas (ex.: polos industriais) e pode aumentar desigualdades regionais", "Elimina indústrias locais sempre", "Promove apenas cultura pop"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 7, "question": "Qual é o papel das zonas costeiras na proteção contra eventos climáticos extremos?", "options": ["Nenhum papel", "Manguezais, dunas e recifes atuam como barreiras naturais que dissipam energia de tempestades e protegem o interior", "Apenas praias artificiais importam", "Somente infraestruturas humanas funcionam"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 8, "question": "Explique o conceito de pegada hídrica e sua utilidade.", "options": ["Quantidade de chuva anual", "Volume total de água utilizado para produzir bens e serviços; útil para medir consumo e sustentabilidade", "Área ocupada por rios", "Índice financeiro"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 9, "question": "Relacione a urbanização periférica à mobilidade urbana e acesso a serviços.", "options": ["Periferia tem melhor acesso sempre", "Expansão periférica pode aumentar deslocamentos longos, custos e reduzir acesso a serviços de qualidade", "Periferia elimina necessidade de transporte", "Não há relação"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 10, "question": "Explique brevemente como a acidificação dos oceanos ocorre e sua consequência biológica.", "options": ["Apenas aquecimento", "Maior CO₂ dissolvido reduz pH do mar, afetando calcificação de organismos marinhos como corais e moluscos", "Aumenta salinidade apenas", "Não afeta vida marinha"], "correctAnswer": 1, "difficulty": "difícil" }
    ],
    "História": [
      { "id": 1, "question": "Analise as causas profundas da Segunda Guerra Mundial além do Tratado de Versalhes.", "options": ["Somente o tratado", "Crise econômica global, ascensão de regimes totalitários, revanchismo e falhas das políticas de apaziguamento", "Expansão pacífica", "Nenhuma causa econômica"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 2, "question": "Explique o conceito de Guerra Fria e uma de suas manifestações regionais.", "options": ["Conflito armado direto entre EUA e URSS", "Conflito ideológico e político entre blocos; manifestações em guerras por procuração (ex.: Guerra do Vietnã)", "Aliança econômica", "Sistema colonial"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 3, "question": "Quais foram os fatores que conduziram ao fim do Apartheid na África do Sul?", "options": ["Estagnação econômica, pressões internas de movimentos como o ANC, sanções internacionais e negociações políticas", "Apoio irrestrito aos segregacionistas", "Isolamento completo", "Descoberta de petróleo"], "correctAnswer": 0, "difficulty": "difícil" },
      { "id": 4, "question": "Analise a transição do Brasil para a redemocratização (década de 1980): um fator chave foi:", "options": ["Fortalecimento da ditadura", "Movimentos sociais, mobilização urbana e desgaste econômico/político do regime militar", "Isolamento internacional", "Aumento de censura"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 5, "question": "Explique o processo de descolonização pós-1945 e um desafio comum enfrentado pelas novas nações.", "options": ["Foi homogêneo", "Processo de independência impulsionado por movimentos nacionalistas e enfraquecimento europeu; desafio: construir instituições estáveis e lidar com fronteiras arbitrárias", "Todas tornaram-se potências", "Houve retorno ao colonialismo"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 6, "question": "Qual foi o impacto socioeconômico da industrialização tardia em países latino-americanos?", "options": ["Desenvolvimento sem desigualdades", "Crescimento industrial desigual que, em muitos casos, gerou urbanização rápida, concentração de renda e dependência externa", "Substituição completa da agricultura", "Eliminação de classes sociais"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 7, "question": "Explique a relação entre nacionalismo e formação de estados-nação no século XIX europeu.", "options": ["Nacionalismo foi irrelevante", "Nacionalismo unificou populações com identidade comum e foi motor para unificações (ex.: Itália, Alemanha) e fragmentações", "Implicou apenas em alianças comerciais", "Foi apenas cultural sem efeito político"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 8, "question": "Analise o papel das mulheres nas lutas sociais do século XX e um exemplo concreto.", "options": ["Foram ausentes", "Participaram ativamente em movimentos por direitos, trabalho e sufrágio; ex.: movimento sufragista e lutas por direitos trabalhistas", "Somente em papéis secundários", "Sem impacto político"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 9, "question": "O que foi a Revolução Industrial do ponto de vista tecnológico e uma inovação-chave?", "options": ["Retorno à produção artesanal", "Mecanização da produção; máquina a vapor como inovação-chave", "Expansão agrícola sem indústria", "Aumento da escravidão artesanal"], "correctAnswer": 1, "difficulty": "fácil" },
      { "id": 10, "question": "Explique a importância das rotas comerciais atlânticas nos séculos XV–XVIII.", "options": ["Sem importância econômica", "Fundamentaram o comércio triangular, circulação de mercadorias, povos e capital e sustentaram economias coloniais e metrópoles", "Movimentaram apenas elites indígenas", "Foram exclusivamente locais"], "correctAnswer": 1, "difficulty": "difícil" }
    ],
    "Biologia": [
      { "id": 1, "question": "Explique a estrutura básica do DNA e como a complementaridade de bases permite a replicação.", "options": ["DNA é proteína; replicação não envolve bases", "DNA é uma dupla hélice de nucleotídeos; A emparelha com T e C com G, permitindo cópia semiconservativa", "DNA é lipídio", "DNA não se replica"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 2, "question": "O que é uma mutação genética e como pode afetar um organismo?", "options": ["Sempre benéfica", "Alteração na sequência de DNA que pode ser neutra, deletéria ou vantajosa dependendo do contexto", "Não ocorre em células somáticas", "Sempre letal"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 3, "question": "Explique o papel do sistema endócrino e um exemplo de hormônio e sua função.", "options": ["Só regula temperatura", "Sistema de sinalização por hormônios; exemplo: insulina regula glicemia", "Função digetiva", "Controla apenas crescimento celular"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 4, "question": "Descreva brevemente a técnica de clonagem reprodutiva e uma preocupação ética associada.", "options": ["Duplicação de órgãos sem debate", "Criação de indivíduos geneticamente idênticos por transferência nuclear; preocupação: identidade, bem-estar e implicações sociais", "Processo natural sem intervenção", "Sem questões éticas"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 5, "question": "Explique a importância da microbiota intestinal para a saúde humana.", "options": ["Não tem importância", "Contribui para digestão, síntese de vitaminas, defesa imunológica e equilíbrio metabólico", "Só causa doenças", "Substitui o fígado"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 6, "question": "O que é homeostase térmica e como mamíferos a mantêm?", "options": ["Variação constante de temperatura", "Manutenção da temperatura interna por mecanismos como sudorese, vasodilatação/vasoconstrição e termogênese", "Apenas migração sazonal", "Ignorada por organismos"] , "correctAnswer": 1, "difficulty": "médio" },
      { "id": 7, "question": "Explique o conceito de nicho ecológico.", "options": ["Área geográfica apenas", "Conjunto de condições ambientais e recursos que permitem a sobrevivência e reprodução de uma espécie, incluindo papel funcional no ecossistema", "Sinônimo de habitat", "Referência apenas a produtores"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 8, "question": "O que são anticorpos e como atuam?", "options": ["Lípidos que transportam O₂", "Proteínas produzidas pelo sistema imune que se ligam especificamente a antígenos, neutralizando-os ou marcando-os para destruição", "Estruturas celulares sem função imune", "Somente presentes em plantas"], "correctAnswer": 1, "difficulty": "médio" },
      { "id": 9, "question": "Explique a diferença entre população efetiva (Ne) e tamanho populacional total (N) em genética de populações.", "options": ["São idênticos", "Ne é o número de indivíduos que contribuem para a reprodução de forma efetiva; geralmente é menor que N e influencia deriva genética", "Ne sempre maior que N", "Termos usados apenas em ecologia humana"], "correctAnswer": 1, "difficulty": "difícil" },
      { "id": 10, "question": "Descreva brevemente como vacinas de RNA mensageiro (mRNA) funcionam.", "options": ["Administram vírus vivo sem modificação", "Entregam mRNA que codifica antígeno; células produzem a proteína alvo e o sistema imune gera resposta sem infecção pela patógena completa", "Usam apenas proteínas inativas", "Funcionalidade desconhecida"], "correctAnswer": 1, "difficulty": "difícil" }
    ]
  }
}


// Componente de Tarefas
function TarefasContent() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<'baixa' | 'média' | 'alta'>('média');
  const [selectedDueDate, setSelectedDueDate] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    
    const newTodo: Todo = { 
      id: Date.now(), 
      text: inputValue, 
      completed: false,
      priority: selectedPriority,
      dueDate: selectedDueDate,
      description: selectedDescription
    };
    
    setTodos([...todos, newTodo]);
    setInputValue("");
    setSelectedPriority('média');
    setSelectedDueDate("");
    setSelectedDescription("");
    setShowForm(false);
    toast.success('Tarefa adicionada com sucesso! ✅');
  };

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success('Tarefa removida! 🗑️');
  };

  // Ordenar tarefas por prioridade
  const priorityOrder = { 'alta': 0, 'média': 1, 'baixa': 2 };
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.completed ? 1 : -1;
  });

  const getPriorityColor = (priority: 'baixa' | 'média' | 'alta') => {
    switch (priority) {
      case 'alta':
        return 'bg-red-600/20 border-red-600/50 text-red-400';
      case 'média':
        return 'bg-yellow-600/20 border-yellow-600/50 text-yellow-400';
      case 'baixa':
        return 'bg-green-600/20 border-green-600/50 text-green-400';
    }
  };

  const getPriorityBadgeColor = (priority: 'baixa' | 'média' | 'alta') => {
    switch (priority) {
      case 'alta':
        return 'bg-red-600 text-white';
      case 'média':
        return 'bg-yellow-600 text-white';
      case 'baixa':
        return 'bg-green-600 text-white';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      <header>
        <h1 className="text-4xl font-bold mb-4 text-white">Minhas Tarefas</h1>
        <p className="text-blue-200/80 mb-4">Organize suas tarefas por prioridade</p>
        
        {!showForm ? (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Nova Tarefa
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-6 bg-blue-900/60 rounded-xl border border-blue-700/50"
          >
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Título da Tarefa</label>
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ex: Estudar para prova, Fazer trabalho..."
                className="bg-blue-800 border-blue-700/50 text-white placeholder:text-blue-300/70 h-12 text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2 text-sm font-medium">Prioridade</label>
                <Select value={selectedPriority} onValueChange={(value) => setSelectedPriority(value as 'baixa' | 'média' | 'alta')}>
                  <SelectTrigger className="bg-blue-800 border-blue-700/50 text-white">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-900 border-blue-700/50">
                    <SelectItem value="baixa" className="text-white hover:bg-green-600/20 focus:bg-green-600/20">
                      🟢 Baixa
                    </SelectItem>
                    <SelectItem value="média" className="text-white hover:bg-yellow-600/20 focus:bg-yellow-600/20">
                      🟡 Média
                    </SelectItem>
                    <SelectItem value="alta" className="text-white hover:bg-red-600/20 focus:bg-red-600/20">
                      🔴 Alta
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-white mb-2 text-sm font-medium">Data (opcional)</label>
                <Input
                  type="date"
                  value={selectedDueDate}
                  onChange={(e) => setSelectedDueDate(e.target.value)}
                  className="bg-blue-800 border-blue-700/50 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 text-sm font-medium">Descrição (opcional)</label>
              <Input
                type="text"
                value={selectedDescription}
                onChange={(e) => setSelectedDescription(e.target.value)}
                placeholder="Adicione detalhes sobre a tarefa..."
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
              <Button
                onClick={handleAddTodo}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      <main className="space-y-3">
        {sortedTodos.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-blue-400/50" />
            <p className="text-blue-300/80 text-lg">Nenhuma tarefa adicionada ainda.</p>
            <p className="text-blue-400/60 text-sm mt-2">Clique em "Adicionar Nova Tarefa" para começar!</p>
          </div>
        ) : (
          <AnimatePresence>
            {sortedTodos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`border-2 flex flex-col p-4 transition-all duration-300 ${getPriorityColor(todo.priority)} ${todo.completed ? 'opacity-50 bg-blue-800/40' : 'bg-blue-900/80'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleTodo(todo.id)} 
                          className="hover:bg-green-500/20 text-green-400 flex-shrink-0"
                        >
                          <Check className="h-5 w-5" />
                        </Button>
                        <span className={`flex-grow text-white text-lg ${todo.completed ? 'line-through text-blue-300/80' : ''}`}>
                          {todo.text}
                        </span>
                      </div>

                      <div className="ml-12 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getPriorityBadgeColor(todo.priority)}>
                            {todo.priority === 'alta' && '🔴 Alta'}
                            {todo.priority === 'média' && '🟡 Média'}
                            {todo.priority === 'baixa' && '🟢 Baixa'}
                          </Badge>
                          {todo.dueDate && (
                            <Badge className="bg-blue-700/50 text-blue-200 border border-blue-600/50">
                              📅 {formatDate(todo.dueDate)}
                            </Badge>
                          )}
                        </div>
                        
                        {todo.description && (
                          <p className="text-sm text-blue-200/70">{todo.description}</p>
                        )}
                      </div>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteTodo(todo.id)} 
                      className="hover:bg-red-500/20 text-red-400 flex-shrink-0"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>

      {sortedTodos.length > 0 && (
        <div className="pt-4 border-t border-blue-700/30">
          <p className="text-blue-200/80 text-sm">
            {sortedTodos.filter(t => !t.completed).length} tarefa(s) pendente(s)
          </p>
        </div>
      )}
    </div>
  );
}

// Atualize a função getAchievementsData para aceitar currentView
const getAchievementsData = (currentView: string, unlockedAchievements: Set<number>): Achievement[] => [
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
    unlocked: currentView === 'tarefas' || unlockedAchievements.has(2),
  },
  {
    id: 3,
    title: "Planejador",
    description: "Acesse a seção de Agenda",
    unlocked: currentView === 'agenda' || unlockedAchievements.has(3),
  },
  {
    id: 4,
    title: "Estudioso",
    description: "Acesse a seção de Quizzes",
    unlocked: currentView === 'quizzes' || unlockedAchievements.has(4),
  },
  {
    id: 5,
    title: "Social",
    description: "Acesse o Fórum da Turma",
    unlocked: currentView === 'forum' || unlockedAchievements.has(5),
  },
  {
    id: 6,
       title: "Conhecedor",
    description: "Acesse a seção de Perfil",
    unlocked: currentView === 'perfil' || unlockedAchievements.has(6),
  }
];

// Componente de Conquistas com notificações
function ConquistasContent({ currentView }: { currentView: string }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    // Verificar se desbloqueou uma nova conquista
    const achievements = getAchievementsData(currentView, unlockedAchievements);
    achievements.forEach((achievement) => {
      if (achievement.unlocked && !unlockedAchievements.has(achievement.id)) {
        setUnlockedAchievements(prev => new Set([...prev, achievement.id]));
        // Toast de desbloqueio
        toast.success(`🏆 Conquista desbloqueada: ${achievement.title}!`, {
          description: achievement.description,
          duration: 5000
        });
      }
    });
  }, [currentView, unlockedAchievements]);

  const achievementsData = getAchievementsData(currentView, unlockedAchievements);
  const unlockedCount = achievementsData.filter((ach) => ach.unlocked).length;
  const totalAchievements = achievementsData.length;
  const progressPercentage = (unlockedCount / totalAchievements) * 100;

  const icons = [
    { id: 1, icon: "🎓" },
    { id: 2, icon: "📋" },
    { id: 3, icon: "📅" },
    { id: 4, icon: "🎯" },
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
                            ? 'text-white group-hover:text-blue-200' 
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
          <Button onClick={() => toast.error("Função ainda não disponível, há poucos usuários na Study.")} className="bg-blue-700 text-white hover:bg-blue-800">
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
          <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white break-words">
                {getGreeting()}, estudante.
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-auto">
              
                <Card className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 row-span-2 flex flex-col w-full justify-center p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden min-h-[200px]">
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
                <Card onClick={() => setCurrentView('tarefas')} className="col-span-1 sm:col-span-2 md:col-span-1 h-32 md:h-36 flex flex-col justify-center p-3 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
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
                    <p className="text-white/90 text-xs md:text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                      Seu progresso na plataforma
                    </p>
                  </CardHeader>
                </Card>

                <Card onClick={() => setCurrentView('agenda')} className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 h-32 md:h-36 flex flex-col justify-center p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
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
                    <p className="text-white/90 text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
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
                    <p className="text-white/90 text-xs opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-200 max-w-xs leading-relaxed">
                      Reforce e prove seus conhecimentos
                    </p>
                  </CardHeader>
                </Card>

                <Card onClick={() => setCurrentView('forum')} className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-1 h-32 md:h-36 flex flex-col justify-center p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
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
                  className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-1 h-32 md:h-36 flex flex-col justify-center items-center p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <Plus />
                </Card>

                <a href="/planos" className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 h-6 md:h-6'>
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