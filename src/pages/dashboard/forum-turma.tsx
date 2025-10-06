import { Check, PlusIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function ForumTurma() {
  return (
    <div className="flex h-screen items-center justify-center">
        <div>
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <div className="*:data-[slot=avatar]:ring-background flex -space-x-2">
                    <Avatar>
                      <AvatarImage src="" alt="@shadcn" />
                      <AvatarFallback className="bg-white">CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage
                        src=""
                        alt="@maxleiter"
                      />
                      <AvatarFallback className="bg-white">LR</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage
                        src=""
                        alt="@evilrabbit"
                      />
                      <AvatarFallback className="bg-white">ER</AvatarFallback>
                    </Avatar>
                  </div>
                </EmptyMedia>
                <EmptyTitle className="text-white">Nenhuma turma encontrada.</EmptyTitle>
                <EmptyDescription className="text-white">
                  Entre, ou convide colaboradores para seu fórum.
                </EmptyDescription>
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
    </div>
  )
}
