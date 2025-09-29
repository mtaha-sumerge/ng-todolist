import { Component, DestroyRef, inject, Input, OnInit, Output } from '@angular/core';
import { Task } from "../task/task";
import { TasksService } from '../../services/TasksService';
import { EventEmitter } from 'stream';
import { TaskI } from '../../models/TaskI';

@Component({
  selector: 'app-pending-tasks',
  standalone: true,
  imports: [Task],
  templateUrl: './pending-tasks.html',
  styleUrl: './pending-tasks.css'
})
export class PendingTasks implements OnInit {
  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  @Input() searchQuery: string = '';

  pendingTasks = this.tasksService.loadedPendingTasks;

  ngOnInit() {
    const subscription = this.tasksService.loadPendingTasks().subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe(); // technically not necessarily required
    });
  }
}

