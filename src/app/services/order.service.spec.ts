import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

describe('OrderService', () => {
  let service: OrderService;
  let productService: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        OrderService
      ]
    });
    service = TestBed.inject(OrderService);
    productService = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToOrder', () => {
    it('should add a new item to the order', () => {
      const productId = 1;
      
      service.addToOrder(productId);
      
      const order = service.order();
      expect(order.items).toContainEqual({ productId, quantity: 1 });
    });

    it('should increment quantity if item exists', () => {
      const productId = 1;
      service.addToOrder(productId);
      service.addToOrder(productId);
      
      const order = service.order();
      expect(order.items).toContainEqual({ productId, quantity: 2 });
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the order', () => {
      const productId = 1;
      service.addToOrder(productId);
      service.removeItem(productId);
      
      const order = service.order();
      expect(order.items).not.toContainEqual({ productId, quantity: 1 });
    });
  });

  describe('submitOrder', () => {
    it('should submit the order successfully', () => {
      const customer = { name: 'John Doe', email: 'john@example.com' };
      const order = { items: [{ productId: 1, quantity: 2 }], customer, totalAmount: 20, createdAt: new Date() };
      
      // Mock ProductService to return products
      productService.products.set([{ id: 1, name: 'Pizza', price: 10 }]);
      
      // Mock ApiService to return a successful response
      service.order.set(order);
      
      const mockResponse = { id: '123', ...order };
      
      service.submitOrder(customer).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.currentOrder).toEqual(order);
        expect(service.order()).toEqual(new Order());
      });
      
      const req = httpMock.expectOne(`${service.apiUrl}/orders`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(order);
      req.flush(mockResponse);
    });

    it('should handle error when submitting order', () => {
      const customer = { name: 'John Doe', email: 'john@example.com' };
      const errorMessage = 'Error submitting order';
      
      // Mock ProductService to return products
      productService.products.set([{ id: 1, name: 'Pizza', price: 10 }]);
      
      // Mock ApiService to return an error
      service.order.set({ items: [{ productId: 1, quantity: 2 }], customer, totalAmount: 20, createdAt: new Date() });
      
      service.submitOrder(customer).subscribe({
        next: () => fail('Expected error, but got success'),
        error: (err) => {
          expect(err.message).toBe(errorMessage);
        }
      });
      
      const req = httpMock.expectOne(`${service.apiUrl}/orders`);
      req.error(new Error(errorMessage));
    });
  });

  describe('getTotalAmount', () => {
    it('should calculate total amount correctly', () => {
      // Mock ProductService to return products
      productService.products.set([
        { id: 1, name: 'Pizza', price: 10 },
        { id: 2, name: 'Burger', price: 8 }
      ]);
      
      // Add items to order
      service.addToOrder(1);
      service.addToOrder(2);
      
      const total = service.getTotalAmount();
      expect(total).toBe(18);
    });
  });
});