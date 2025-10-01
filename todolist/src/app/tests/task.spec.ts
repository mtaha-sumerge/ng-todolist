import { ComponentFixture, TestBed } from '@angular/core/testing';
import 'zone.js';
import 'zone.js/testing';
import { Task } from '../components/task/task';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('Task', () => {
  let component: Task;
  let fixture: ComponentFixture<Task>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Task],
      providers: [HttpClient, HttpHandler]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Task);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a task title', () => {
    const taskTitle = fixture.debugElement.nativeElement.querySelector('#title');
    expect(taskTitle.textContent).toBeTruthy();
  });

  it('should render Done button when status is pending', () => {
    spyOn(component, 'status').and.returnValue('pending');
    fixture.detectChanges();

    const doneBtn = fixture.nativeElement.querySelector('#done');
    expect(doneBtn).toBeTruthy();
  });

  it('should not render Undone button when status is pending', () => {
    spyOn(component, 'status').and.returnValue('pending');
    fixture.detectChanges();

    const undoneBtn = fixture.nativeElement.querySelector('#undone');
    expect(undoneBtn).toBeFalsy();
  });

  it('should render Undone button when status is completed', () => {
    spyOn(component, 'status').and.returnValue('completed');
    fixture.detectChanges();

    const undoneBtn = fixture.nativeElement.querySelector('#undone');
    expect(undoneBtn).toBeTruthy();
  });

  it('should not render Done button when status is completed', () => {
    spyOn(component, 'status').and.returnValue('completed');
    fixture.detectChanges();

    const doneBtn = fixture.nativeElement.querySelector('#done');
    expect(doneBtn).toBeFalsy();
  });


  it('should render a delete button', () => {
    const deleteBtn = fixture.debugElement.nativeElement.querySelector('#delete');
    expect(deleteBtn).toBeTruthy();
  });

});
