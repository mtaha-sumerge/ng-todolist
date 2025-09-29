import { inject, Injectable, signal } from "@angular/core";
import { firebaseConfig } from "../config/firestore";
import { HttpClient } from "@angular/common/http";
import { catchError, map, switchMap, tap, throwError } from "rxjs";
import { TaskI } from "../models/TaskI";
import { AuthService } from "../services/AuthService";

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    private readonly BASE_URL: string = "https://firestore.googleapis.com/v1"
    private readonly PENDING_COLLECTION_PATH: string = this.BASE_URL + `/projects/${firebaseConfig.projectId}/databases/(default)/documents/pending_tasks`
    private readonly COMPLETED_COLLECTION_PATH: string = this.BASE_URL + `/projects/${firebaseConfig.projectId}/databases/(default)/documents/completed_tasks`
    // PATCH https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/todos/TODO_ID

    private httpClient = inject(HttpClient);

    private pendingTasks = signal<TaskI[]>([]);
    loadedPendingTasks = this.pendingTasks.asReadonly();

    private completedTasks = signal<TaskI[]>([]);
    loadedCompletedTasks = this.completedTasks.asReadonly();

    private authService = inject(AuthService);

    // Gets the token of the current session - if any
    private getAuthHeaders() {
        const token = sessionStorage.getItem('authToken');
        return token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};
    }

    // Requests data from pending_tasks collection
    loadPendingTasks() {
        return this.httpClient
            .get(this.PENDING_COLLECTION_PATH, this.getAuthHeaders())
            .pipe(
                map((res: any) => {
                    const docs = res.documents ?? [];
                    return docs.map((doc: any) => ({
                        id: doc.name.split('/').pop(), // last part of /s
                        name: doc.fields.name.stringValue
                    }))
                }),
                tap({
                    next: (pendingTasks) => this.pendingTasks.set(pendingTasks)
                })
            );
    }

    // Requests data from completed_tasks collection
    loadCompletedTasks() {
        return this.httpClient
            .get(this.COMPLETED_COLLECTION_PATH, this.getAuthHeaders())
            .pipe(
                map((res: any) => {
                    const docs = res.documents ?? [];
                    return docs.map((doc: any) => ({
                        id: doc.name.split('/').pop(), // last part of /s
                        name: doc.fields.name.stringValue
                    }))
                }),
                tap({
                    next: (completed_tasks) => this.completedTasks.set(completed_tasks)
                })
            );
    }

    // Posts new task
    addTask(taskName: string) {
        return this.httpClient.post(this.PENDING_COLLECTION_PATH, {
            fields: {
                name: { stringValue: taskName }
            }
        }, this.getAuthHeaders()
        ).pipe(
            tap((res: any) => {
                const newTask: TaskI = {
                    id: res.name.split('/').pop(),
                    name: res.fields.name.stringValue
                };
                this.pendingTasks.set([...this.pendingTasks(), newTask]);
            })
        );
    }

    // Deletes existing task
    removeTask(taskId: string, status: 'pending' | 'completed') {

        if (status === 'completed') {
            const completedTasks = this.completedTasks();
            this.completedTasks.set(completedTasks.filter(t => t.id !== taskId));
            return this.httpClient.delete(this.COMPLETED_COLLECTION_PATH + '/' + taskId, this.getAuthHeaders())
                .pipe(
                    catchError(() => {
                        this.completedTasks.set(completedTasks);
                        return throwError(() => new Error('Failed to remove.'));
                    })
                );
        }
        else {
            const pendingTasks = this.pendingTasks();
            this.pendingTasks.set(pendingTasks.filter(t => t.id !== taskId));
            return this.httpClient.delete(this.PENDING_COLLECTION_PATH + '/' + taskId, this.getAuthHeaders())
                .pipe(
                    catchError((error) => {
                        this.pendingTasks.set(pendingTasks);
                        return throwError(() => new Error('Failed to remove.'));
                    })
                );
        }
    }

    // Bidirectional moving of existing task
    moveTask(task: TaskI, from: 'pending' | 'completed') {
        if (from === 'pending') {

            const currentPending = this.pendingTasks();
            this.pendingTasks.set(currentPending.filter(t => t.id !== task.id));

            const currentCompleted = this.completedTasks();
            const movedTask: TaskI = { ...task };
            this.completedTasks.set([...currentCompleted, movedTask]);

            return this.httpClient.delete(`${this.PENDING_COLLECTION_PATH}/${encodeURIComponent(task.id)}`, this.getAuthHeaders()).pipe(
                switchMap(() => // switchMap bt switch to another observable
                    this.httpClient.post(this.COMPLETED_COLLECTION_PATH, {
                        fields: {
                            name: { stringValue: task.name }
                        }
                    }, this.getAuthHeaders()
                )
                ),
                catchError(() => {
                    this.pendingTasks.set(currentPending);
                    this.completedTasks.set(currentCompleted);
                    return throwError(() => new Error('Move failed'));
                })
            );
        } else {
            const currentCompleted = this.completedTasks();
            this.completedTasks.set(currentCompleted.filter(t => t.id !== task.id));

            const currentPending = this.pendingTasks();
            const movedTask: TaskI = { ...task };
            this.pendingTasks.set([...currentPending, movedTask]);

            return this.httpClient.delete(`${this.COMPLETED_COLLECTION_PATH}/${encodeURIComponent(task.id)}`, this.getAuthHeaders()).pipe(
                // tap(() => console.log(`${this.COMPLETED_COLLECTION_PATH}/${encodeURIComponent(task.id)}`)),
                switchMap(() =>
                    this.httpClient.post(this.PENDING_COLLECTION_PATH, {
                        fields: {
                            name: { stringValue: task.name }
                        }
                    }, this.getAuthHeaders()
                )
                ),
                catchError((error) => {
                    this.completedTasks.set(currentCompleted);
                    this.pendingTasks.set(currentPending);
                    return throwError(() => new Error('Move failed'));
                })
            );
        }
    }



}