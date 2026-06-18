import type { Task } from '../types/task';

type TaskItemProps = {
  task: Task;
  buttonText: string;
  onClick: (task: Task) => void;
  buttonColor: string;
};

function TaskItem({ task, buttonText, onClick, buttonColor }: TaskItemProps) {
  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{task.text}</span>
      <button
        type="button"
        className="render-container__item-button"
        style={{ backgroundColor: buttonColor }}
        onClick={() => onClick(task)}
      >
        {buttonText}
      </button>
    </li>
  );
}

export default TaskItem;
