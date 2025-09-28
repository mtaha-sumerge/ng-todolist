import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Task } from "../task/task";
import { TasksService } from '../../services/TasksService';

@Component({
  selector: 'app-completed-tasks',
  standalone: true,
  imports: [Task],
  templateUrl: './completed-tasks.html',
  styleUrl: '../../app.css'
})
export class CompletedTasks implements OnInit {
  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);

  @Input() searchQuery: string = '';

  completedTasks = this.tasksService.loadedCompletedTasks;

  ngOnInit() {
    const subscription = this.tasksService.loadCompletedTasks().subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe(); // technically not necessarily required
    });
  }
}