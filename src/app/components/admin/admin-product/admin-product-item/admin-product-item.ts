import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Product } from '../../../../models/restaurant.model';
import { AdminProductEdit } from '../admin-product-edit/admin-product-edit';
import { ApiService } from '../../../../services/api.service';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-admin-product-item',
  imports: [CommonModule, AdminProductEdit],
  templateUrl: './admin-product-item.html',
  styleUrl: './admin-product-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductItem {

  constructor(
    private apiService: ApiService,
    private productService: ProductService
  ) {

  }
  @Input() product?: Product;
  public showEditProduct: boolean = false;

  public onProductCancel(status: boolean) {
    if (status) {
      this.showEditProduct = false;
    }
  }

  deleteProduct(id: number): void {
    this.apiService.deleteProduct(id).subscribe({
      next: () => {
        this.productService.products.update(products =>
          products.filter(p => p.id !== id)
        );
      },
      error: (err) => {
        console.error('deleteProduct:', err);
      }
    });
  }
}
