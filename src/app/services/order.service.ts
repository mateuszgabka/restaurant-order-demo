import { Injectable, signal } from '@angular/core';
import { CartItem, CustomerInfo, Order } from '../models/restaurant.model';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  constructor(
    private apiService: ApiService,
    private productService: ProductService
  ) {
  }


  public order = signal<Order>(new Order());
  public currentOrder: Order | undefined;

  public initNewOrder(): void {
    if (this.order()) {
      return;
    }
    this.order.set(new Order());
  }

  public addToOrder(productId: number): void {
    this.order.update((currentOrder) => {
      if (!currentOrder) {
        currentOrder = new Order();
      }

      const currentItems = currentOrder.items ?? [];
      const existingItem = currentItems.find(item => item.productId === productId);

      let updatedItems: CartItem[];

      if (existingItem) {
        updatedItems = currentItems.map(item =>
          item.productId === productId ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item);
      } else {
        const newItem = new CartItem(productId);
        newItem.quantity = 1;
        updatedItems = [...currentItems, newItem];
      }

      return {
        ...currentOrder, items: updatedItems
      };
    });
  }

  public removeItem(productId: number): void {
    this.order.update((currentOrder) => {
      if (!currentOrder || !currentOrder.items) {
        return currentOrder;
      }

      const updatedItems = currentOrder.items.filter(
        (item) => item.productId !== productId
      );

      return {
        ...currentOrder,
        items: updatedItems,
      };
    });
  }


  public submitOrder(customer: CustomerInfo) {
    const currentOrder = this.order();

    // Tworzymy kopię obiektu zamówienia z uzupełnionymi danymi
    const orderToSubmit: Order = {
      ...currentOrder,
      customer: customer,
      totalAmount: this.getTotalAmount(),
      createdAt: new Date()
    };

    return this.apiService.createOrder(orderToSubmit).pipe(
      tap(() => {
        this.currentOrder = orderToSubmit;
        this.initNewOrder();
      })
    );
  }

  
  public getTotalAmount(): number {
    if (!this.order()?.items || this.productService.products().length === 0) return 0;

    let amount = 0;
    if (this.order()) {
      for (let item of this.order().items) {
        const found = this.productService.products().find(p => p.id === item.productId);
        if (found) {
          amount += found.price * item.quantity;
        }
      }
    }

    return amount; 
  }

}