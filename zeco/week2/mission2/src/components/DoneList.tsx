import { useTodo } from '../context/TodoContext';
import TaskItem from './TaskItem';

function DoneList() {
  const { doneTasks, deleteTask } = useTodo();

  return (
    <div className="flex-1 flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">완료</h2>
      <ul className="flex flex-col gap-2">
        {doneTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            buttonText="삭제"
            onClick={deleteTask}
            variant="delete"
          />
        ))}
      </ul>
    </div>
  );
}

export default DoneList;
