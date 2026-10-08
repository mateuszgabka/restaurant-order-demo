import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    public router: Router
  ) {
  }


  public password = signal('');
  public isLoading = signal(false);
  public errorMessage = signal('');

  public onSubmit(): void {
    if (!this.password().trim()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.password()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Nieprawidłowe hasło. Spróbuj ponownie.');
      }
    });
  }
}