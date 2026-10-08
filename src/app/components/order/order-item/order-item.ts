import { ChangeDetectionStrategy, Component, Input, signal, computed } from '@angular/core';
import { CartItem, Product } from '../../../models/restaurant.model';
import { OrderService } from '../../../services/order.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-order-item',
  imports: [CurrencyPipe],
  templateUrl: './order-item.html',
  styleUrl: './order-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderItemComponent {
  @Input() item!: CartItem;

  constructor(
    private apiService: ApiService,
    public orderService: OrderService,
    private productService: ProductService
  ) {
  }

  ngOnInit() {
  }


  public getProductName(productId: number): string {
    const found = this.productService.getProductById(productId);
    return found?.name ?? '';
  }

  public getProductPrice(productId: number): number {
    const found = this.productService.getProductById(productId);
    return found?.price ?? 0;
  }

  public removeItem(productId: number): void {
    this.orderService.removeItem(productId);
  }

}
