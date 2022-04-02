import { defaultKanban } from './mock';

type TodoCategory = 'to-do' | 'in-progress' | 'done';

type tag = {
  id: number;
  content: string;
};

export type TodoItem = {
  id: number;
  category: TodoCategory;
  content: {
    title: string;
    body: string;
  };
  isDone: boolean;
  tags?: tag[];
};

export type KanbanItem = {
  id: number;
  title: string;
  todos: TodoItem[];
};

export default class Kanban {
  kanbanList: KanbanItem[];

  constructor() {
    this.kanbanList = defaultKanban;

    this.init();
  }

  init() {
    this.renderKanban(this.kanbanList);
  }

  deleteKanban(id: number) {
    this.kanbanList = this.kanbanList.filter((kanban) => kanban.id !== id);

    this.renderKanban(this.kanbanList);
  }

  deleteTodoItem(id: number, category: string) {
    const kanbanId = this.kanbanList.findIndex((kanban) => kanban.title === category);
    const targetKanban = this.kanbanList.find((kanban) => kanban.title === category);
    const newTodos = targetKanban.todos.filter((todo) => todo.id !== id);

    this.kanbanList[kanbanId].todos = newTodos;
    this.renderKanban(this.kanbanList);
  }

  makeKanban({ id, title, todos }: KanbanItem) {
    const $kanban = document.createElement('section');
    $kanban.classList.add('board');

    const addBtn = `
      <section class="todo">
        <button class="todo-item add" id="add-todo-${title}">
          <span class="plus-btn blue"></span>
        </button>
      </section>`;

    const todoHTML = todos
      .map(({ id: todoId, content, tags }) => {
        return `
        <section class="todo" id="${title}+${todoId}">
          <div class="todo-item">
            <div class="wrapper">
              <div class="item-header">
                <div class="item-title">
                  <span class="item-title-icon"></span>
                  <div class="title">${content ? content.title : ''}</div>
                </div>
                <div class="todo-control" >
                  <button class='delete-item' id="delete-todo-${todoId}">
                    <span class="delete-btn"></span>
                  </button>
                </div>
              </div>

              <div class="todo-content">${content ? content.body : ''}</div>
            </div>

            <div class="tags">
              ${tags
                .map(({ id: tagId, content }) => {
                  return `<span class="tag" id="tag-${todoId}">
                            ${content} 
                            <button class='delete-tag delete-btn' id="todo-delete-${tagId}"></button>
                          </span>`;
                })
                .join('')}
              
              <div class="tag add-tag-btn">
                <span contentEditable>태그</span>
                <button class="add-btn" id="todo-${todoId}"></button>
              </div>
              
            </div>
          </div>
        </section>
      `;
      })
      .join('');

    const item = `
      <section class="board-title">
        <div class="board-header">
          <div class="total"><span id="todo-count">${todos.length}</span></div>
          <h2 class="title">${title}</h2>
        </div>

        <div class="board-control">
          <button class='kanban-delete' id="kanban-${id}"><span class="delete-btn"></span></button>
        </div>
      </section>
      
      <div class="wrapper">
        ${addBtn}
        ${todos.length ? todoHTML : ''}
      </div>`;

    $kanban.innerHTML = item;

    return $kanban;
  }

  addTodoInputToKanban(category) {
    const $kanban = document.createElement('section');
    $kanban.classList.add('todo');
    $kanban.setAttribute('id', 'add-item');

    const item = `
      <div class="todo-item add-item">
        <div>
          <div class="item-header">
            <div class="item-title">
              <span class="item-title-icon"></span>
              <div class="title add-title" contentEditable>제목</div>
            </div>
          </div>
          <div class="todo-content add-content" contentEditable>내용</div>
          
        </div>
        <div class="todo-control">
          <button class="cancel">Cancel</button>
          <button class="add">Add Item</button>
        </div>
      </div>
    `;

    $kanban.innerHTML = item;
    $kanban.querySelector('.cancel').addEventListener('click', () => {
      this.renderKanban(this.kanbanList);
    });

    $kanban.querySelector('.add').addEventListener('click', ({ currentTarget }) => {
      const kanbanId = this.kanbanList.findIndex(({ title }) => title === category);

      if (!(currentTarget instanceof HTMLButtonElement)) return;
      const todoItem = currentTarget.closest('.todo-item');
      const title = todoItem.querySelector('.add-title').textContent;
      const body = todoItem.querySelector('.add-content').textContent;

      const newTodoId =
        this.kanbanList[kanbanId].todos.length > 0
          ? this.kanbanList[kanbanId].todos[this.kanbanList[kanbanId].todos.length - 1].id + 1
          : 0;

      const newTodo: TodoItem = {
        id: newTodoId,
        content: { title, body },
        isDone: false,
        category: category as TodoItem['category'],
        tags: [],
      };

      const todos = [...this.kanbanList[kanbanId].todos, newTodo];
      this.kanbanList[kanbanId].todos = todos;
      this.renderKanban(this.kanbanList);
    });

    return $kanban;
  }

  renderKanban(kanbanList) {
    const addKanbanBtn = document.createElement('button');
    addKanbanBtn.classList.add('board', 'add');
    addKanbanBtn.innerHTML = `<span class="plus-btn blue"></span>`;

    const board = document.querySelector(`.todo-container`);
    board.innerHTML = '';

    const frag = document.createDocumentFragment();
    const kanbanElements = kanbanList.map((kanban) => this.makeKanban(kanban));

    frag.append(...kanbanElements);

    board.append(frag, addKanbanBtn);

    const $kanbanAddBtn = document.querySelector('.board.add');
    const $kanbanDeleteBtn = document.querySelectorAll('.kanban-delete');
    const $todoAddBtn = document.querySelectorAll('.todo-item.add');
    const $todoDeleteBtn = document.querySelectorAll('.delete-item');
    const $tagAddBtn = document.querySelectorAll('.add-btn');
    const $tagDeleteBtn = document.querySelectorAll('.delete-tag');

    $tagDeleteBtn.forEach((btn) => {
      btn.addEventListener('click', ({ currentTarget }) => {
        if (!(currentTarget instanceof HTMLButtonElement)) return;

        const category = currentTarget.closest('.todo').id.split('+')[0];

        const todoId = Number(currentTarget.closest('.tag').id.split('tag-')[1]);
        const tagId = Number(currentTarget.id.split('todo-delete')[1]);

        const kanbanId = this.kanbanList.findIndex((kanban) => kanban.title === category);
        const targetKanban = this.kanbanList.find((kanban) => kanban.title === category);
        const todo = targetKanban.todos.find((todo) => todo.id === todoId);
        const todoIndex = targetKanban.todos.findIndex((todo) => todo.id === todoId);

        const newTags = todo.tags.filter((tag) => tag.id !== tagId);

        this.kanbanList[kanbanId].todos[todoIndex].tags = newTags;
        this.renderKanban(this.kanbanList);
      });
    });

    $tagAddBtn.forEach((btn) => {
      btn.addEventListener('click', ({ currentTarget }) => {
        if (!(currentTarget instanceof HTMLButtonElement)) return;

        const category = currentTarget.closest('.todo').id.split('+')[0];
        const id = Number(currentTarget.id.split('todo-')[1]);

        const kanbanId = this.kanbanList.findIndex((kanban) => kanban.title === category);
        const targetKanban = this.kanbanList.find((kanban) => kanban.title === category);
        const todo = targetKanban.todos.find((todo) => todo.id === id);
        const todoIndex = targetKanban.todos.findIndex((todo) => todo.id === id);

        const newId = todo.tags.length > 0 ? todo.tags[todo.tags.length - 1].id + 1 : 0;
        todo.tags.push({
          id: newId,
          content: currentTarget.closest('.tag').querySelector('span').textContent,
        });

        this.kanbanList[kanbanId].todos.splice(todoIndex, 1, todo);
        this.renderKanban(this.kanbanList);
      });
    });

    $kanbanAddBtn.addEventListener('click', () => {
      const newId =
        this.kanbanList.length > 0 ? this.kanbanList[this.kanbanList.length - 1].id + 1 : 0;
      this.kanbanList = [...this.kanbanList, { id: newId, title: `kanban-${newId}`, todos: [] }];

      this.renderKanban(this.kanbanList);
    });

    $kanbanDeleteBtn.forEach((btn) => {
      btn.addEventListener('click', ({ currentTarget }) => {
        this.deleteKanban(Number((currentTarget as HTMLButtonElement).id.split('kanban-')[1]));
      });
    });

    $todoAddBtn.forEach((btn) =>
      btn.addEventListener('click', ({ currentTarget }) => {
        if (!(currentTarget instanceof HTMLButtonElement)) return;
        if (document.querySelector('#add-item button.add')) return;

        const category = (currentTarget as HTMLButtonElement).id.split('add-todo-')[1];

        currentTarget.closest('.wrapper').prepend(this.addTodoInputToKanban(category));
      })
    );

    $todoDeleteBtn.forEach((btn) => {
      btn.addEventListener('click', ({ currentTarget }) => {
        if (!(currentTarget instanceof HTMLButtonElement)) return;

        const category = currentTarget.closest('.todo').id.split('+')[0];
        const id = Number(currentTarget.id.split('delete-todo-')[1]);

        this.deleteTodoItem(id, category);
      });
    });
  }
}

new Kanban();
