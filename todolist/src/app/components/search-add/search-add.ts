import { Component, computed, DestroyRef, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { TasksService } from '../../services/TasksService';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TaskI } from '../../models/TaskI';

@Component({
  selector: 'app-search-add',
  standalone: true,
  imports: [MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './search-add.html',
  styleUrl: '../../app.css'
})
export class SearchAdd implements OnInit {
  wannaAdd = true; // flag
  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);

  @Output() query = new EventEmitter<string>();
  filteredTasks = signal<string[]>([]);

  // Service subcription
  ngOnInit() {
    const subscription1 = this.tasksService.loadPendingTasks().subscribe();
    const subscription2 = this.tasksService.loadCompletedTasks().subscribe();

    this.searchCtrl.valueChanges.subscribe(value => {
      this.filteredTasks.set(this._filter(value || ''));
    });

    // console.log(this.filteredTasks);

    this.destroyRef.onDestroy(() => {
      subscription1.unsubscribe(); // technically not necessarily required
      subscription2.unsubscribe();
    });
  }

  private pendingTasks = this.tasksService.loadedPendingTasks;
  private completedTasks = this.tasksService.loadedCompletedTasks;

  // Extract task names
  tasks = computed(() => [...this.pendingTasks().map((t: TaskI) => t.name), ...this.completedTasks().map((t: TaskI) => t.name)]);

  toggleMode() {
    this.wannaAdd = !this.wannaAdd;
  }

  addTask(taskName: string) {
    this.tasksService.addTask(taskName.trim()).subscribe();
  }

  searchTask(query: string | null) {
    // console.log(query.trim().toLowerCase());
    this.query.emit((query ?? '').trim().toLowerCase());
  }

  searchCtrl = new FormControl('');

  _filter(query: string) {
    // Array -> Set -> Array 3ashan nsheel el duplicates
    return Array.from(new Set(this.tasks().filter(name => name.toLowerCase().includes(query.toLowerCase()))));
  }

}
