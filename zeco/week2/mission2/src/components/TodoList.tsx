import { useTodo } from '../context/TodoContext';
import TaskItem from './TaskItem';

function TodoList() {
  const { todos, completeTask } = useTodo();

  return (
    <div className="flex-1 flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">할 일</h2>
      <ul className="flex flex-col gap-2">
        {todos.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            buttonText="완료"
            onClick={completeTask}
            variant="complete"
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
