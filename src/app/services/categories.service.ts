import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { Category } from '../models/restaurant.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  public categories = signal<Category[]>([]);
  public isLoading = signal<boolean>(false);

  public catMap = computed(() => {
    const map = new Map<number | string, Category>();
    for (const cat of this.categories()) {
      map.set(cat.id, cat);
      map.set(String(cat.id), cat);
    }
    return map;
  });

  constructor(private apiService: ApiService) {
    this.loadProducts();
  }

  public loadProducts(): void {
    if (this.categories().length > 0) return;

    this.isLoading.set(true);
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.categories().sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Błąd pobierania kategorii:', err);
        this.isLoading.set(false);
      },
    });
  }

  
    public getCategoryById(id: number | string): Category | undefined {
        return this.catMap().get(id);
    }

}