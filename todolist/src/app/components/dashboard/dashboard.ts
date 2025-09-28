import { Component, inject, Input } from '@angular/core';
import { CompletedTasks } from '../completed-tasks/completed-tasks';
import { PendingTasks } from '../pending-tasks/pending-tasks';
import { TasksService } from '../../services/TasksService';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';
import { SearchAdd } from "../search-add/search-add";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CompletedTasks, PendingTasks, SearchAdd],
  templateUrl: './dashboard.html',
  styleUrl: '../../app.css'
})
export class Dashboard {
  private tasksService = inject(TasksService);

  // For logout handling
  private authService = inject(AuthService);
  private router = inject(Router);

  query: string = '';

  logout() {
    this.authService.logout();
    console.log("Shelt el token");
    this.router.navigate(['']);
  }
}
