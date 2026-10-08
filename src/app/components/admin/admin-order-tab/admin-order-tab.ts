import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Order } from '../../../models/restaurant.model';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-order-tab',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-order-tab.html',
  styleUrl: './admin-order-tab.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderTab {
  public isLoadingOrders = signal<boolean>(false);
  public orders = signal<Order[]>([]);

  constructor(
    private apiService: ApiService,
    public productService: ProductService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  public loadOrders(forceReload = false): void {
    if (!forceReload && this.orders().length > 0) return;

    this.isLoadingOrders.set(true);
    this.apiService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);

        this.isLoadingOrders.set(false);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoadingOrders.set(false);
      },
    });
  }

  onStatusChange(orderId: string, newStatus: string): void {
    if (!orderId) return;

    this.apiService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        this.orders.update(list =>
          list.map(o => String(o.id) === String(orderId) ? { ...o, status: updatedOrder.status } : o)
        );
      },
      error: (err) => console.error('updateOrderStatus:', err)
    });
  }

  onDeleteOrder(orderId: string | number): void {
    if (!orderId) return;

    this.apiService.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders.update(list => list.filter(o => String(o.id) !== String(orderId)));
      },
      error: (err) => console.error('deleteOrder:', err)
    });
  }
}