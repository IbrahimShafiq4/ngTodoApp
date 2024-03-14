import { Injectable, signal } from '@angular/core';
import { TodoInterface } from '../types/todo.interface';
import { FilterEnum } from '../types/filter.enum';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private STORAGE_KEY = 'todos';

  todosSig = signal<TodoInterface[]>([]);

  filterSig = signal<FilterEnum>(FilterEnum.all);

  constructor() {
    const storedTodos = localStorage.getItem(this.STORAGE_KEY);
    if (storedTodos) {
      this.todosSig.set(JSON.parse(storedTodos));
    }
  }

  private saveToLocalStorage(): void {
    const todos = this.todosSig();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }

  changeFilter(filterName: FilterEnum): void {
    this.filterSig.set(filterName);
  }

  addTodo(text: string): void {
    const newTodo: TodoInterface = {
      text,
      isCompleted: false,
      id: Math.random().toString(16),
    };

    this.todosSig.update((todos) => [...todos, newTodo]);
    this.saveToLocalStorage();
  }

  changeTodo(id: string, text: string): void {
    this.todosSig.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
    this.saveToLocalStorage();
  }

  removeTodo(id: string): void {
    this.todosSig.update((todos) => todos.filter((todo) => todo.id !== id));
    this.saveToLocalStorage();
  }

  toggleTodo(id: string): void {
    this.todosSig.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    );
    this.saveToLocalStorage();
  }

  toggleAll(isCompleted: boolean): void {
    this.todosSig.update((todos) =>
      todos.map((todo) => ({ ...todo, isCompleted }))
    );
    this.saveToLocalStorage();
  }

  getCompletedTodos(): TodoInterface[] {
    return this.todosSig().filter((todo) => todo.isCompleted);
  }
}
