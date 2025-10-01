import { ComponentFixture, TestBed } from '@angular/core/testing';
import 'zone.js'
import 'zone.js/testing';
import { PendingTasks } from '../components/pending-tasks/pending-tasks';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('PendingTasks', () => {
  let component: PendingTasks;
  let fixture: ComponentFixture<PendingTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingTasks],
      providers: [HttpClient, HttpHandler]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(PendingTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have the title "Pending Tasks"', () => {
    fixture = TestBed.createComponent(PendingTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.card-header').textContent.trim()).toBe('Pending Tasks');
  })
});
