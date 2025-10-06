'use client'; // Necessário para indicar que este é um Componente de Cliente (usa estado)

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// 1. Definição do tipo para cada tarefa
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export function Tarefas() {
  // 2. Estados para gerenciar a lista de tarefas e o valor do input
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Estudar React com TypeScript", completed: true },
    { id: 2, text: "Finalizar componente de perfil", completed: true },
    { id: 3, text: "Começar a lista de tarefas", completed: false },
    { id: 4, text: "Entregar o projeto", completed: false },
  ]);
  const [inputValue, setInputValue] = useState("");

  // 3. Função para adicionar uma nova tarefa
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(), // ID único baseado no timestamp
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue(""); // Limpa o input
  };

  // 4. Função para marcar uma tarefa como concluída/não concluída
  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 5. Função para deletar uma tarefa
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="w-full min-h-screen text-white p-4 sm:p-8 flex justify-center items-center">
      <div className="w-full max-w-2xl space-y-8">
        <header>
          <h1 className="text-4xl font-bold mb-4">Minhas Tarefas</h1>
          <form onSubmit={handleAddTodo} className="flex items-center gap-2">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Adicionar nova tarefa..."
              className="bg-blue-900 border-blue-700/50 text-white placeholder:text-blue-300/70 h-12 text-lg"
            />
            <Button type="submit" size="icon" className="h-12 w-12 flex-shrink-0">
              <Plus className="h-6 w-6" />
            </Button>
          </form>
        </header>

        <main className="space-y-3">
          <AnimatePresence>
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`
                    border-blue-700/50 flex items-center justify-between p-4 transition-all duration-300
                    ${todo.completed
                      ? 'bg-blue-800/40 opacity-50'
                      : 'bg-blue-900/80'
                    }
                  `}
                >
                  <span
                    className={`
                      flex-grow cursor-pointer
                      ${todo.completed ? 'line-through text-blue-300/80' : ''}
                    `}
                    onClick={() => handleToggleTodo(todo.id)}
                  >
                    {todo.text}
                  </span>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleTodo(todo.id)}
                      className="hover:bg-green-500/20 text-green-400"
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence> 
        </main>
      </div>
    </div>
  );
}