import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Task} from "./components/task/task";
import {PendingTasks} from "./components/pending-tasks/pending-tasks";
import {CompletedTasks} from "./components/completed-tasks/completed-tasks";
import {TasksService} from './TasksService';

@Component({
  selector: 'app-root',
  imports: [PendingTasks, CompletedTasks],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('todolist');

  private tasksService = inject(TasksService);

  query: string = '';

  addTask(taskName: string) {//TODO to be extracted with the add task component
    this.tasksService.addTask(taskName).subscribe();
  }

  searchTask(event: Event) { //todo extract to search service!
    const query = event.target as HTMLInputElement;
    this.query = query.value.trim().toLocaleLowerCase();
  }
}
