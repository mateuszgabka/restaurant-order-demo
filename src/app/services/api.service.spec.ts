import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { of, throwError } from 'rxjs';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Orders', () => {
    it('createOrder should call POST /orders', () => {
      const order = { id: '1', items: [], customer: {}, createdAt: new Date() };
      service.createOrder(order).subscribe();
      
      const req = httpMock.expectOne(`${service.apiUrl}/orders`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(order);
      req.flush(order);
    });

    it('getOrders should call GET /orders', () => {
      const orders = [{ id: '1', items: [], customer: {}, createdAt: new Date() }];
      service.getOrders().subscribe(data => {
        expect(data).toEqual(orders);
      });
      
      const req = httpMock.expectOne(`${service.apiUrl}/orders?_sort=-createdAt`);
      expect(req.request.method).toBe('GET');
      req.flush(orders);
    });

    it('updateOrderStatus should call PATCH /orders/:id', () => {
      const orderId = '1';
      const status = 'completed';
      service.updateOrderStatus(orderId, status).subscribe();
      
      const req = httpMock.expectOne(`${service.apiUrl}/orders/${orderId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ status });
      req.flush({});
    });

    it('deleteOrder should call DELETE /orders/:id', () => {
      const orderId = '1';
      service.deleteOrder(orderId).subscribe();
      
      const req = httpMock.expectOne(`${service.apiUrl}/orders/${orderId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('Categories', () => {
    it('getCategories should call GET /categories', () => {
      const categories = [{ id: '1', name: 'Dinner' }];
      service.getCategories().subscribe(data => {
        expect(data).toEqual(categories);
      });
      
      const req = httpMock.expectOne(`${service.apiUrl}/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(categories);
    });

    it('addCategory should call POST /categories', () => {
      const category = { name: 'Dessert' };
      service.addCategory(category).subscribe();
      
      const req = httpMock.expectOne(`${service.apiUrl}/categories`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(category);
      req.flush(category);
    });

    it('updateCategory should call PUT /categories/:id', () => {
      const id = '1';
      const category = { id, name: 'Lunch' };
      service.updateCategory(id, category).subscribe();
      
      const req = httpMock.expectOne(`${service.apiUrl}/categories/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(category);
      req.flush(category);
    });

    it('deleteCategory should call DELETE /categories/:id', () => {
      const id = '1';
      service.deleteCategory(id).subscribe();
      
      const req = httpMock.expectOne(`${service.apiUrl}/categories/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('Products', () => {
    it('getProducts should call GET /products', () => {
      const products = [{ id: '1', name: 'Pizza', price: 10 }];
      service.getProducts().subscribe(data => {
        expect(data).toEqual(products);
      });
      
      const req = httpMock.expectOne(`${service.apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(products);
    });

    it('addProduct should call POST /products', () => {
      const product = { name: 'Burger', price: 8 };
      service.addProduct(product).subscribe();
      
      const req = httpMock.expectOne(`${service.apiUrl}/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(product);
      req.flush(product);
    });

    it('updateProduct should call PUT /products/:id', () => {
      const id = '1';
      const product = { id, name: 'Pasta', price: 12 };
      service.updateProduct(id, product).subscribe();
      
      const req = httpMock.expectOne(`${service.apiUrl}/products/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(product);
      req.flush(product);
    });

    it('deleteProduct should call DELETE /products/:id', () => {
      const id = '1';
      service.deleteProduct(id).subscribe();
      
      const req = httpMock.expectOne(`${service.apiUrl}/products/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});