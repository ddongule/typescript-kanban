import { KanbanItem, TodoItem } from './index';

export const todoList: TodoItem[] = [
  {
    id: 0,
    content: { title: '제목', body: '내용' },
    isDone: false,
    category: 'to-do',
    tags: ['태그1'],
  },
];

export const inProgressList: TodoItem[] = [
  {
    id: 0,
    content: { title: '제목', body: '내용' },
    isDone: false,
    category: 'in-progress',
    tags: ['태그1'],
  },
];

export const doneList: TodoItem[] = [
  {
    id: 0,
    content: { title: '제목', body: '내용' },
    isDone: false,
    category: 'done',
    tags: ['태그1'],
  },
];

export const defaultKanban: KanbanItem[] = [
  { id: 0, title: 'To do', todos: todoList },
  { id: 1, title: 'In progress', todos: inProgressList },
  { id: 2, title: 'Done', todos: doneList },
];
