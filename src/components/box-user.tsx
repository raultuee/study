import { Zap } from "lucide-react";

export function BoxUser() {
    return (
        <div className="fixed bottom-6 left-6 bg-black/80 text-white rounded-xl p-4 text-sm backdrop-blur-sm border border-white/10">
        <p className="font-semibold mb-2 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Atalhos do Teclado:
        </p>
        <div className="space-y-1 text-xs">
          <div><kbd className="bg-white/20 px-2 py-1 rounded mr-1">Ctrl+G</kbd> Nova senha</div>
          <div><kbd className="bg-white/20 px-2 py-1 rounded mr-1">Ctrl+R</kbd> Reiniciar</div>
        </div>
      </div>
    )
}