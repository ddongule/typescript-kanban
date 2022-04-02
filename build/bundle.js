System.register("mock", [], function (exports_1, context_1) {
    "use strict";
    var todoList, inProgressList, doneList, defaultKanban;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("todoList", todoList = [
                {
                    id: 0,
                    content: { title: '제목', body: '내용' },
                    isDone: false,
                    category: 'to-do',
                    tags: ['태그1'],
                },
            ]);
            exports_1("inProgressList", inProgressList = [
                {
                    id: 0,
                    content: { title: '제목', body: '내용' },
                    isDone: false,
                    category: 'in-progress',
                    tags: ['태그1'],
                },
            ]);
            exports_1("doneList", doneList = [
                {
                    id: 0,
                    content: { title: '제목', body: '내용' },
                    isDone: false,
                    category: 'done',
                    tags: ['태그1'],
                },
            ]);
            exports_1("defaultKanban", defaultKanban = [
                { id: 0, title: 'To do', todos: todoList },
                { id: 1, title: 'In progress', todos: inProgressList },
                { id: 2, title: 'Done', todos: doneList },
            ]);
        }
    };
});
System.register("index", ["mock"], function (exports_2, context_2) {
    "use strict";
    var mock_1, Kanban;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (mock_1_1) {
                mock_1 = mock_1_1;
            }
        ],
        execute: function () {
            Kanban = class Kanban {
                constructor() {
                    this.kanbanList = mock_1.defaultKanban;
                    this.init();
                }
                init() {
                    this.renderKanban(this.kanbanList);
                }
                deleteKanban(id) {
                    this.kanbanList = this.kanbanList.filter((kanban) => kanban.id !== id);
                    this.renderKanban(this.kanbanList);
                }
                deleteTodoItem(id, category) {
                    const kanbanId = this.kanbanList.findIndex((kanban) => kanban.title === category);
                    const targetKanban = this.kanbanList.find((kanban) => kanban.title === category);
                    const newTodos = targetKanban.todos.filter((todo) => todo.id !== id);
                    this.kanbanList[kanbanId].todos = newTodos;
                    this.renderKanban(this.kanbanList);
                }
                makeKanban({ id, title, todos }) {
                    const $kanban = document.createElement('section');
                    $kanban.classList.add('board');
                    const addBtn = `
      <section class="todo">
        <button class="todo-item add" id="add-todo-${title}">
          <span class="plus-btn blue"></span>
        </button>
      </section>`;
                    const todoHTML = todos
                        .map(({ id, content }) => {
                        return `
        <section class="todo" id="${title}+${id !== null && id !== void 0 ? id : 0}">
          <div class="todo-item">
            <div class="item-header">
              <div class="item-title">
                <span class="item-title-icon"></span>
                <div class="title">${content ? content.title : ''}</div>
              </div>
              <div class="todo-control" >
                <button class='delete-item' id="delete-todo-${id !== null && id !== void 0 ? id : 0}">
                  <span class="delete-btn"></span>
                </button>
              </div>
            </div>

            <div class="todo-content">${content ? content.body : ''}</div>
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
                        if (!(currentTarget instanceof HTMLButtonElement))
                            return;
                        const todoItem = currentTarget.closest('.todo-item');
                        const title = todoItem.querySelector('.add-title').textContent;
                        const body = todoItem.querySelector('.add-content').textContent;
                        console.log(title, body);
                        const newTodoId = this.kanbanList[kanbanId].todos.length > 0
                            ? this.kanbanList[kanbanId].todos[this.kanbanList[kanbanId].todos.length - 1].id + 1
                            : 0;
                        const newTodo = {
                            id: newTodoId,
                            content: { title, body },
                            isDone: false,
                            category: category,
                            tags: ['태그1'],
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
                    $kanbanAddBtn.addEventListener('click', () => {
                        const newId = this.kanbanList.length > 0 ? this.kanbanList[this.kanbanList.length - 1].id + 1 : 0;
                        this.kanbanList = [...this.kanbanList, { id: newId, title: `kanban-${newId}`, todos: [] }];
                        this.renderKanban(this.kanbanList);
                    });
                    $kanbanDeleteBtn.forEach((btn) => {
                        btn.addEventListener('click', ({ currentTarget }) => {
                            this.deleteKanban(Number(currentTarget.id.split('kanban-')[1]));
                        });
                    });
                    $todoAddBtn.forEach((btn) => btn.addEventListener('click', ({ currentTarget }) => {
                        if (!(currentTarget instanceof HTMLButtonElement))
                            return;
                        if (document.querySelector('#add-item button.add'))
                            return;
                        const category = currentTarget.id.split('add-todo-')[1];
                        currentTarget.closest('.wrapper').prepend(this.addTodoInputToKanban(category));
                    }));
                    $todoDeleteBtn.forEach((btn) => {
                        btn.addEventListener('click', ({ currentTarget }) => {
                            if (!(currentTarget instanceof HTMLButtonElement))
                                return;
                            const category = currentTarget.closest('.todo').id.split('+')[0];
                            const id = Number(currentTarget.id.split('delete-todo-')[1]);
                            this.deleteTodoItem(id, category);
                        });
                    });
                }
            };
            exports_2("default", Kanban);
            new Kanban();
        }
    };
});
