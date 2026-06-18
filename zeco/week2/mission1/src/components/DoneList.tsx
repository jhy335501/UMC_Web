import { useTodo } from '../context/TodoContext';
import TaskItem from './TaskItem';

function DoneList() {
  const { doneTasks, deleteTask } = useTodo();

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">완료</h2>
      <ul className="render-container__list">
        {doneTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            buttonText="삭제"
            onClick={deleteTask}
            buttonColor="#dc3545"
          />
        ))}
      </ul>
    </div>
  );
}

export default DoneList;
