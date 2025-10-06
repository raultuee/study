import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

// 1. (Opcional) Estrutura de dados para o perfil do usuário
// Isso torna o componente reutilizável e fácil de alimentar com dados de uma API
type UserProfileData = {
  name: string;
  avatarUrl: string;
  bio: string;
  plans: string[];
  forums: { name: string; url: string }[];
  portfolioUrl: string;
};

const userData: UserProfileData = {
  name: "Usuário Teste",
  avatarUrl: "https://github.com/shadcn.png", // Imagem de exemplo
  bio: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique ipsa earum suscipit itaque enim molestias voluptatum quaerat, aliquid officiis eaque! Nihil vitae fugit animi magni et doloremque, perferendis accusantium nam!",
  plans: ["Plano ++", "Prata"],
  forums: [{ name: "Etecanos do Study", url: "#" }],
  portfolioUrl: "www.portifolio.com.br",
};


export function Perfil() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative">
          {/* Banner Superior */}
          <div className="h-48 bg-blue-800 rounded-t-xl" />

          {/* Avatar Flutuante */}
          <div className="absolute top-28 left-8">
            <Avatar className="h-32 w-32 border-8 border-blue-900">
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
              <AvatarFallback>UT</AvatarFallback>
            </Avatar>
          </div>

          {/* Card Principal de Conteúdo */}
          <div className="bg-blue-900 p-8 pt-20 rounded-b-xl text-white">
            {/* Badges de Plano */}
            <div className="flex justify-end -mt-8 mb-4 space-x-2">
              <Badge className="bg-gray-900 text-white border-gray-700 hover:bg-gray-800">
                {userData.plans[0]}
              </Badge>
              <Badge variant="secondary" className="bg-gray-300 text-gray-800 hover:bg-gray-200">
                {userData.plans[1]}
              </Badge>
            </div>

            {/* Nome e Bio */}
            <h1 className="text-3xl font-bold">{userData.name}</h1>
            <p className="text-blue-200/90 mt-2 text-base">
              {userData.bio}
            </p>

            {/* Seção Fóruns */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Fóruns</h2>
              <div className="mt-2">
                <Badge className="bg-cyan-500 text-white text-md py-1 px-4 hover:bg-cyan-600 cursor-pointer">
                  {userData.forums[0].name}
                  <Check className="h-4 w-4 ml-2" />
                </Badge>
              </div>
            </div>

            {/* Seção Portifólio */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Portifólio</h2>
              <a 
                href={`https://${userData.portfolioUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 mt-2 block hover:underline"
              >
                {userData.portfolioUrl}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}