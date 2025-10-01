import { ComponentFixture, TestBed } from '@angular/core/testing';
import 'zone.js';
import 'zone.js/testing';
import { Dashboard } from '../components/dashboard/dashboard';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [HttpClient, HttpHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a logout button', () => {
    const logoutBtn = fixture.debugElement.nativeElement.querySelector('#logout');
    expect(logoutBtn.textContent).toContain('Logout');
  });
});
