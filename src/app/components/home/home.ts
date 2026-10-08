import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductCardComponent } from '../../components/product-card/product-card';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/restaurant.model';
import { CatNavComponent } from '../cat-nav/cat-nav';
import { OrderComponent } from '../order/order';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, CatNavComponent, CommonModule, OrderComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public selectedCategoryId = signal<number | null | undefined>(undefined);
  
  public isReady = computed(() => !this.productService.isLoading() && this.productService.products().length > 0);
  
  constructor(
    public productService: ProductService
  ) { 
  }

  ngOnInit(): void {
  }

  onCategoryChange(categoryId: number | undefined): void {
    this.selectedCategoryId.set(categoryId ? Number(categoryId) : undefined);
  }
}
