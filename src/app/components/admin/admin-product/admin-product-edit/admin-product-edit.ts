import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, Input, output, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../models/restaurant.model';
import { ApiService } from '../../../../services/api.service';
import { ProductService } from '../../../../services/product.service';
import { CategoriesService } from '../../../../services/categories.service';

@Component({
  selector: 'app-admin-product-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-product-edit.html',
  styleUrl: './admin-product-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductEdit {
  @Input() category!: number;
  @Input() showStatus?: boolean;
  @Input() id?: number;

  public product = signal<Product>(new Product());
  public cancelProduct = output<boolean>();

  constructor(
    private categoriesService: CategoriesService,
    private apiService: ApiService,
    private productService: ProductService
  ) {
    effect(() => {
      if (this.id) {
        const productToEdit = this.productService.getProductById(this.id);
        if (productToEdit) {
          this.product.set(new Product({
            id: this.id,
            categoryId: productToEdit.categoryId,
            name: productToEdit.name,
            description: productToEdit.description,
            price: productToEdit.price
          }));
        }
      }
    });
  }

  onSaveProduct(): void {
    const currentProduct = this.product();

    if (!currentProduct.name?.trim() || !currentProduct.description?.trim() || !currentProduct.price || currentProduct.price <= 0) {
      return;
    }

    // Edit
    if (this.id) {
      const updatedProduct: Product = {
        id: this.id,
        name: currentProduct.name.trim(),
        description: currentProduct.description.trim(),
        price: Number(currentProduct.price),
        categoryId: Number(this.category)
      };

      this.apiService.updateProduct(this.id, updatedProduct).subscribe({
        next: (res) => {
          this.productService.products.update(products =>
            products.map(p => p.id === res.id ? res : p)
          );
          this.close();
        },
        error: (err) => console.error('Błąd edycji produktu:', err)
      });
    }
    // New
    else {
      const newProductData: Omit<Product, 'id'> = {
        name: currentProduct.name.trim(),
        description: currentProduct.description.trim(),
        price: Number(currentProduct.price),
        categoryId: Number(this.category),
      };

      this.apiService.addProduct(newProductData).subscribe({
        next: (savedProduct) => {
          this.productService.products.update(products => [...products, savedProduct]);
          this.product.set(new Product());
          this.close();
        },
        error: (err) => console.error('addProduct:', err)
      });
    }
  }

  public currentCategoryName() {
    const catId = this.category;
    const map = this.categoriesService.catMap();
    const category = map.get(Number(catId)) ?? map.get(String(catId));
    return category?.name ?? '';
  }

  close() {
    this.showStatus = false;
    this.cancelProduct.emit(true);
  }
}