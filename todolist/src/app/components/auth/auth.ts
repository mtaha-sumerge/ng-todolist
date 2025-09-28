import { Component, inject, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: '../../app.css'
})
export class Auth {

  wannaLogin = true;

  private authService = inject(AuthService);

  private router = inject(Router);
  
  error = signal('');

  // error: string | null = null;

  toggleLogin() {
    this.wannaLogin = !this.wannaLogin;
    this.error.set('');
  }

  onSubmit(form: NgForm) {

    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;
    form.reset();

    if (this.wannaLogin) {
      this.authService.login(email, password).subscribe({
        next: resData => {
          // console.log(resData);
          this.error.set('');
          this.router.navigate(['/tasks']);
        },
        error: err => {
          console.error(err);
          this.error.set('Log-in failed: ' + (err.error?.error?.message ?? ''));
          // console.log(this.error);
        }
      })
    }
    else {
      this.authService.signUp(email, password).subscribe({
        next: resData => {
          console.log(resData);
          this.error.set('');
        },
        error: err => {
          console.error(err);
          this.error.set('Sign-up failed: ' + (err.error?.error?.message ?? ''));
          // console.log(this.error);
        }
      });
    }
  }

}

