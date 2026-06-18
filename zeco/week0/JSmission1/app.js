const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');

// 1. 할 일 추가 함수
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    addTodo(input.value);
    input.value = ''; // 입력창 비우기
  }
});

function addTodo(text) {
  const li = document.createElement('li');
  li.textContent = text;

  // 완료 버튼
  const completeBtn = document.createElement('button');
  completeBtn.textContent = '완료';
  completeBtn.className = 'complete-btn';
  completeBtn.onclick = () => moveToDone(li);

  li.appendChild(completeBtn);
  todoList.appendChild(li);
}

// 2. 완료 목록으로 이동 함수
function moveToDone(li) {
  const btn = li.querySelector('button');
  btn.textContent = '삭제';
  btn.className = 'delete-btn';
  btn.onclick = () => deleteTodo(li);

  doneList.appendChild(li);
}

// 3. 할 일 삭제 함수
function deleteTodo(li) {
  li.remove();
}
