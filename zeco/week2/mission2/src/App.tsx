import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';
import { TodoProvider } from './context/TodoContext';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import DoneList from './components/DoneList';

function AppContent() {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">ZECO TODO</h1>
          <button
            onClick={toggleDark}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            {isDark ? '☀️ 라이트 모드' : '🌙 다크 모드'}
          </button>
        </div>

        <TodoForm />

        <div className="flex gap-4 mt-6">
          <TodoList />
          <DoneList />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </DarkModeProvider>
  );
}

export default App;