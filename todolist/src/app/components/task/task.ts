import { Component, inject, Input, signal } from '@angular/core';
import { TasksService } from '../../services/TasksService';
import { TaskI } from '../../models/TaskI';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task {
  // Task info
  @Input({ required: true }) id !: string;
  @Input({ required: true }) title !: string;
  // @Input({ required: true }) status !: 'pending' | 'completed';
  status = signal<'pending' | 'completed' | null>(null);

  @Input() set taskStatus(value: 'pending' | 'completed') {
    this.status.set(value);
  }

  private tasksService = inject(TasksService);

  // Moves task from pending to completed
  doTask() {
    const task: TaskI = { id: this.id, name: this.title };
    this.tasksService.moveTask(task, 'pending').subscribe(() => this.status.set('completed'));
  }

  // Moves task from completed to pending
  undoTask() {
    const task: TaskI = { id: this.id, name: this.title };
    this.tasksService.moveTask(task, 'completed').subscribe(() => this.status.set('pending'));
  }
  
  removeTask() {
    this.tasksService.removeTask(this.id, this.status()!).subscribe();
  }


}
