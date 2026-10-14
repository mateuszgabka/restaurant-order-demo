import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { of, throwError } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadProducts', () => {
    it('should load products successfully', () => {
      const mockProducts = [
        { id: '1', name: 'Pizza', price: 10, position: 1 },
        { id: '2', name: 'Burger', price: 8, position: 2 }
      ];
      
      service.loadProducts();
      
      const req = httpMock.expectOne(`${service.apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
      
      expect(service.products()).toEqual(mockProducts);
      expect(service.isLoading()).toBe(false);
    });

    it('should handle error when loading products', () => {
      const errorMessage = 'Error loading products';
      
      service.loadProducts();
      
      const req = httpMock.expectOne(`${service.apiUrl}/products`);
      req.error(new Error(errorMessage));
      
      expect(service.isLoading()).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Error products loading:', expect.any(Error));
    });
  });

  describe('getProductById', () => {
    it('should return product by id', () => {
      const mockProducts = [
        { id: '1', name: 'Pizza', price: 10, position: 1 },
        { id: '2', name: 'Burger', price: 8, position: 2 }
      ];
      service.products.set(mockProducts);
      
      const product = service.getProductById('1');
      
      expect(product).toEqual(mockProducts[0]);
    });

    it('should return undefined for non-existent id', () => {
      const mockProducts = [
        { id: '1', name: 'Pizza', price: 10, position: 1 },
        { id: '2', name: 'Burger', price: 8, position: 2 }
      ];
      service.products.set(mockProducts);
      
      const product = service.getProductById('3');
      
      expect(product).toBeUndefined();
    });
  });
});