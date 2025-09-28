import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TasksService } from '../../services/TasksService';

@Component({
  selector: 'app-search-add',
  standalone: true,
  imports: [],
  templateUrl: './search-add.html',
  styleUrl: '../../app.css'
})
export class SearchAdd {

  wannaAdd = true;

  private tasksService = inject(TasksService);

  @Output() query = new EventEmitter<string>();

  toggleMode() {
    this.wannaAdd = !this.wannaAdd;
  }

  addTask(taskName: string) {
    this.tasksService.addTask(taskName.trim()).subscribe();
  }

  searchTask(query: string) {
    console.log(query.trim().toLowerCase());
    this.query.emit(query.trim().toLowerCase());
  }

}
