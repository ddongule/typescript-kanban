type TodoCategory = 'to-do' | 'in-progress' | 'done';

type TodoItem = {
  id: number;
  content: string;
  isDone: boolean;
  category: TodoCategory;
  tags?: string[];
};

type KanbanItem = {
  id: number;
  title: string;
  todos: TodoItem[];
};

const todos: TodoItem[] = [
  { id: 0, content: '하이', isDone: false, category: 'to-do', tags: ['ddd'] },
];

const temporaryItem: KanbanItem[] = [{ id: 0, title: 'To do', todos }];
export default class Kanban {
  kanbanList: KanbanItem[];

  constructor() {
    this.kanbanList = temporaryItem;

    this.init();
  }

  init() {
    const $input = document.querySelector('#todo-input');
    const $controlBtns = document.querySelectorAll('.btn');

    // $input.addEventListener('keydown', this.onEnterClick.bind(this));
  }

  renderTodo(todoList) {}
}

new Kanban();
