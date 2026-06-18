import './style.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import DoneList from './components/DoneList';
import { TodoProvider } from './context/TodoContext';

function App() {
  return (
    <TodoProvider>
      <div className="todo-container">
        <h1 className="todo-container__header">ZECO TODO</h1>

        <TodoForm />

        <div className="render-container">
          <TodoList />
          <DoneList />
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
