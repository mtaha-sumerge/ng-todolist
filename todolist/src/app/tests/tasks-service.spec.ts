import { TestBed } from '@angular/core/testing';
import { TasksService } from '../services/TasksService';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firebaseConfig } from '../config/firestore';
import { TaskI } from '../models/TaskI';

describe('TasksService', () => {
  let service: TasksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TasksService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('Tasks Service should be injected', () => {
    expect(service).toBeTruthy();
  });

  it('addTask should post and add to pendingTasks signal', () => {
    service.addTask('New Task').subscribe();

    const req = httpMock.expectOne(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/pending_tasks`);
    expect(req.request.method).toBe('POST');

    const mockRes = {
      name: 'projects/demo/databases/(default)/documents/pending_tasks/456',
      fields: { name: { stringValue: 'New Task' } }
    };
    req.flush(mockRes);

    expect(service.loadedPendingTasks()).toContain(jasmine.objectContaining({ id: '456', name: 'New Task' }));
  });

  it('removeTask should delete and update pendingTasks signal', () => {
    (service as any).pendingTasks.set([{ id: 'abc', name: 'Delete me' }]);

    service.removeTask('abc', 'pending').subscribe({
      error: err => {
        expect(err.message).toBe('Failed to remove.');
        expect(service.loadedPendingTasks()).toEqual([{ id: 'abc', name: 'Delete me' }]);
      }
    });

    const req = httpMock.expectOne(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/pending_tasks/abc`);
    req.error(new ProgressEvent('error'));
  });

  it('moveTask should move from pending to completed', () => {
    const task: TaskI = { id: 't1', name: 'Move me' };
    (service as any).pendingTasks.set([task]);
    (service as any).completedTasks.set([]);

    service.moveTask(task, 'pending').subscribe();

    const deleteReq = httpMock.expectOne(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/pending_tasks/t1`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({});

    const postReq = httpMock.expectOne(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/completed_tasks`);
    
    expect(postReq.request.method).toBe('POST');
    postReq.flush({
      name: 'projects/demo/databases/(default)/documents/completed_tasks/t1',
      fields: { name: { stringValue: 'Move me' } }
    });

    expect(service.loadedPendingTasks()).toEqual([]);
    expect(service.loadedCompletedTasks()).toContain(jasmine.objectContaining({ id: 't1', name: 'Move me' }));
  });

});