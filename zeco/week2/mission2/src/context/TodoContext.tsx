import { createContext, useContext, useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { Task } from '../types/task';

type TodoContextType = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  todos: Task[];
  doneTasks: Task[];
  addTodo: () => void;
  completeTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const addTodo = () => {
    if (!input.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: input,
    };

    setTodos([...todos, newTask]);
    setInput('');
  };

  const completeTask = (task: Task) => {
    setTodos(todos.filter((t) => t.id !== task.id));
    setDoneTasks([...doneTasks, task]);
  };

  const deleteTask = (task: Task) => {
    setDoneTasks(doneTasks.filter((t) => t.id !== task.id));
  };

  return (
    <TodoContext.Provider
      value={{
        input,
        setInput,
        todos,
        doneTasks,
        addTodo,
        completeTask,
        deleteTask,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTodo() {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodo must be used within TodoProvider');
  }

  return context;
}
