import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from '../../services/todos.service';
import { FilterEnum } from '../../types/filter.enum';

@Component({
  selector: 'app-todos-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class FooterComponent implements OnInit {
  todosService = inject(TodosService);

  filterSig = this.todosService.filterSig;

  filterEnum = FilterEnum;
  activeCount = computed(() => {
    return this.todosService.todosSig().filter((todo) => !todo.isCompleted).length
  })

  clearAll = computed(() => {
    return this.todosService.getCompletedTodos().length > 0;
  });

  noTodosClass = computed(() => this.todosService.todosSig().length === 0)
  itemsLeftText = computed(
    () => `item${this.activeCount() !== 1 ? 's' : ''} left`
  )
  changeFilter(event: Event, filterName: FilterEnum) {
    event.preventDefault();
    this.todosService.changeFilter(filterName)
  }

  clearAllCompleted(event: Event): void {
    event.preventDefault();
    const completedTodos = this.todosService.getCompletedTodos();
    completedTodos.forEach((todo) => {
      this.todosService.removeTodo(todo.id);
    });
    
    localStorage.setItem('todos', JSON.stringify(this.todosService.todosSig()));
  }

  uncompletedTodos = computed(() => {
    return this.todosService.todosSig().filter((todo) => !todo.isCompleted);
  });

  ngOnInit(): void {

    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      this.todosService.todosSig.set(JSON.parse(storedTodos));
    }
  }
}
