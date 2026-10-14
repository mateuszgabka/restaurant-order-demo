import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';
import { localStorageMock } from '../../testing/local-storage-mock';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    // Reset localStorage mock before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return success with correct password', () => {
      const password = 'admin123';
      const mockResponse = { token: 'fake-jwt-token-xyz-123' };
      
      service.login(password).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('admin_jwt_token')).toBe(mockResponse.token);
        expect(service.isLoggedIn()).toBe(true);
      });
    });

    it('should return error with incorrect password', () => {
      const password = 'wrongpassword';
      
      service.login(password).subscribe({
        next: () => fail('Expected error, but got success'),
        error: (err) => {
          expect(err.message).toBe('Invalid password');
          expect(localStorage.getItem('admin_jwt_token')).toBeNull();
          expect(service.isLoggedIn()).toBe(false);
        }
      });
    });
  });

  describe('logout', () => {
    it('should remove token and update isLoggedIn', () => {
      // Set up token first
      const token = 'fake-jwt-token-xyz-123';
      localStorage.setItem('admin_jwt_token', token);
      service.isLoggedIn.set(true);
      
      service.logout();
      
      expect(localStorage.getItem('admin_jwt_token')).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
    });
  });
});