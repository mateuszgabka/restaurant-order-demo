import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { OrderService } from '../../services/order.service';
import { Order } from '../../models/restaurant.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-sucess',
  imports: [DatePipe, CurrencyPipe, CommonModule],
  templateUrl: './order-sucess.html',
  styleUrl: './order-sucess.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSucessComponent {
  public order: Order | undefined;

  constructor(
    public orderService: OrderService,
    private productService: ProductService,
    public router: Router
  ) {

  }
  ngOnInit() {
    this.order = this.orderService.currentOrder;
    if (!this.order) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    this.orderService.currentOrder = undefined;
  }

  
  public getProductName(productId: number): string {
    const found = this.productService.getProductById(productId);
    return found?.name ?? '';
  }

  public getProductPrice(productId: number): number {
    const found = this.productService.getProductById(productId);
    return found?.price ?? 0;
  }
}
