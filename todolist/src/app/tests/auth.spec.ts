import { ComponentFixture, TestBed } from '@angular/core/testing';
import 'zone.js'
import 'zone.js/testing';
import { Auth } from '../components/auth/auth';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('Auth', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auth, FormsModule],
      providers: [HttpClient, HttpHandler]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render form with email and password inputs', () => {
    const email = fixture.debugElement.nativeElement.querySelector('#email');
    const password = fixture.debugElement.nativeElement.querySelector('#password');
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
  });

  it('should disable submit button when input fields are invalid', async () => {
    const email = fixture.debugElement.nativeElement.querySelector('#email');
    const password = fixture.debugElement.nativeElement.querySelector('#password');
    email.value = 'test.com';
    password.value = '1';
    email.dispatchEvent(new Event('input'));
    password.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    const submitButton = fixture.debugElement.nativeElement.querySelector('#submit');
    expect(submitButton.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', async () => {
    const email = fixture.debugElement.nativeElement.querySelector('#email');
    const password = fixture.debugElement.nativeElement.querySelector('#password');

    email.value = 'test@test.com';
    email.dispatchEvent(new Event('input'));
    password.value = 'testing';
    password.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    const submitButton = fixture.debugElement.nativeElement.querySelector(('#submit'));
    expect(submitButton.disabled).toBeFalse();
  });

  it('should toggle between login and signup mode', () => {
    const toggleButton = fixture.debugElement.nativeElement.querySelector(('#toggle'));
    const initialMode = component.wannaLogin;

    toggleButton.click();
    fixture.detectChanges();

    expect(component.wannaLogin).toBe(!initialMode);
  });

});
