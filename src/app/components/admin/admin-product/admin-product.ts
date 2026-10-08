import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CategoriesService } from '../../../services/categories.service';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/restaurant.model';
import { AdminProductEdit } from './admin-product-edit/admin-product-edit';
import { ApiService } from '../../../services/api.service';
import { AdminProductItem } from './admin-product-item/admin-product-item';
@Component({
  selector: 'app-admin-product',
  imports: [AdminProductItem, FormsModule, CommonModule, AdminProductEdit, CdkDropList, CdkDrag],
  templateUrl: './admin-product.html',
  styleUrl: './admin-product.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProduct {

  public selectedCategoryId = signal<number>(1);
  public showAddProduct: boolean = false;


  constructor(
    public productService: ProductService,
    public categoriesService: CategoriesService,
    private apiService: ApiService
  ) {
  }

  public filteredProducts = computed(() =>
    this.productService.products()
      .filter(p => p.categoryId === this.selectedCategoryId())
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  );

  public currentCategoryName = computed(() => {
    const catId = this.selectedCategoryId();
    const map = this.categoriesService.catMap();

    const category = map.get(Number(catId)) ?? map.get(String(catId));
    return category?.name ?? '';
  });

  onSelectCategory(id: number | string): void {
    this.selectedCategoryId.set(Number(id));
  }

  public onProductCancel(status: boolean) {
    if (status) {
      this.showAddProduct = false;
    }
  }

  onProductDrop(event: CdkDragDrop<Product[]>): void {
    const categoryProducts = [...this.filteredProducts()];
    moveItemInArray(categoryProducts, event.previousIndex, event.currentIndex);

    categoryProducts.forEach((product, index) => {
      const updatedPosition = index + 1;

      if (product.position !== updatedPosition) {
        product.position = updatedPosition;

        if (product.id) {
          this.apiService.updateProduct(product.id, product).subscribe();
        }
      }
    });

    const allProducts = this.productService.products().map(p => {
      const updated = categoryProducts.find(cp => cp.id === p.id);
      return updated ? updated : p;
    });

    this.productService.products.set(allProducts);
  }

}
