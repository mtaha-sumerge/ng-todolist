import { ComponentFixture, TestBed } from '@angular/core/testing';
import 'zone.js';
import 'zone.js/testing';
import { CompletedTasks } from '../components/completed-tasks/completed-tasks';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('CompletedTasks', () => {
  let component: CompletedTasks;
  let fixture: ComponentFixture<CompletedTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedTasks],
      providers: [HttpClient, HttpHandler]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(CompletedTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have the title "Completed Tasks"', () => {
      fixture = TestBed.createComponent(CompletedTasks);
      component = fixture.componentInstance;
      fixture.detectChanges();
      let compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.card-header').textContent.trim()).toBe('Completed Tasks');
    })
});
