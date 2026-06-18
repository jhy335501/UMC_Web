import type { Task } from '../types/task';

type TaskItemProps = {
  task: Task;
  buttonText: string;
  onClick: (task: Task) => void;
  variant: 'complete' | 'delete';
};

function TaskItem({ task, buttonText, onClick, variant }: TaskItemProps) {
  const buttonClass =
    variant === 'complete'
      ? 'px-3 py-1 rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors'
      : 'px-3 py-1 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors';

  return (
    <li className="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <span className="text-gray-800 dark:text-gray-100 text-sm">{task.text}</span>
      <button type="button" className={buttonClass} onClick={() => onClick(task)}>
        {buttonText}
      </button>
    </li>
  );
}

export default TaskItem;
