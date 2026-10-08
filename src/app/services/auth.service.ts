import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'admin_jwt_token';
  public isLoggedIn = signal<boolean>(!!localStorage.getItem(this.TOKEN_KEY));

  public login(password: string): Observable<{ token: string }> {
    // This is only  for the test purpose
    if (password === 'admin123') {
      const mockResponse = { token: 'fake-jwt-token-xyz-123' };
      
      return of(mockResponse).pipe(
        delay(400),
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          this.isLoggedIn.set(true);
        })
      );
    }

    return throwError(() => new Error('Invalid password')).pipe(delay(400));
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
  }
}