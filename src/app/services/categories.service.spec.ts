import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoriesService } from './categories.service';
import { ApiService } from './api.service';
import { of, throwError } from 'rxjs';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        CategoriesService
      ]
    });
    service = TestBed.inject(CategoriesService);
    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadProducts', () => {
    it('should load categories successfully', () => {
      const mockCategories = [{ id: '1', name: 'Dinner' }];
      
      service.loadProducts();
      
      const req = httpMock.expectOne(`${apiService.apiUrl}/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
      
      expect(service.categories()).toEqual(mockCategories);
      expect(service.isLoading()).toBe(false);
    });

    it('should handle error when loading categories', () => {
      const errorMessage = 'Error loading categories';
      
      service.loadProducts();
      
      const req = httpMock.expectOne(`${apiService.apiUrl}/categories`);
      req.error(new Error(errorMessage));
      
      expect(service.isLoading()).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Błąd pobierania kategorii:', expect.any(Error));
    });
  });

  describe('getCategoryById', () => {
    it('should return category by id', () => {
      const mockCategories = [{ id: '1', name: 'Dinner' }];
      service.categories.set(mockCategories);
      
      const category = service.getCategoryById('1');
      
      expect(category).toEqual(mockCategories[0]);
    });

    it('should return undefined for non-existent id', () => {
      const mockCategories = [{ id: '1', name: 'Dinner' }];
      service.categories.set(mockCategories);
      
      const category = service.getCategoryById('2');
      
      expect(category).toBeUndefined();
    });
  });
});