import { Component, inject, Input } from '@angular/core';
import { CompletedTasks } from '../completed-tasks/completed-tasks';
import { PendingTasks } from '../pending-tasks/pending-tasks';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';
import { SearchAdd } from "../search-add/search-add";
import { TaskI } from '../../models/TaskI';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CompletedTasks, PendingTasks, SearchAdd],
  templateUrl: './dashboard.html',
  styleUrl: '../../app.css'
})
export class Dashboard {

  // For logout handling
  private authService = inject(AuthService);
  private router = inject(Router);

  query: string = '';

  // Calls logout servies and redirects to authentication route
  logout() {
    this.authService.logout();
    console.log("Shelt el token");
    this.router.navigate(['']);
  }
}
