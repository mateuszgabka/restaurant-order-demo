import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { Product } from '../../models/restaurant.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent { 
  @Input() product: Product | undefined;

  constructor(private orderService: OrderService) { 
  }

  public addToOrder(productId: number | undefined) {
    if (productId) {
      this.orderService.addToOrder(productId);
    }
  }

}
