import { ChangeDetectionStrategy, Component, computed, signal, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { Product } from '../../models/restaurant.model';
import { ApiService } from '../../services/api.service';
import { OrderItemComponent } from './order-item/order-item';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-order',
  imports: [CurrencyPipe, CommonModule, OrderItemComponent],
  templateUrl: './order.html',
  styleUrl: './order.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent {
  @Input() checkout: boolean | undefined;

  public order = computed(() => {
      return this.orderService.order();
    });

  constructor(
    private apiService: ApiService,
    public orderService: OrderService,
    public productService: ProductService,
    public router: Router
  ) { 
  }

  ngOnInit() {
    this.orderService.initNewOrder();
  }
  

  
}
