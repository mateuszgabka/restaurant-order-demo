import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models/restaurant.model';

@Injectable({
    providedIn: 'root', // Singleton - żyje przez cały czas działania aplikacji
})
export class ProductService {

    public products = signal<Product[]>([]);
    public isLoading = signal<boolean>(false);

    public productsMap = computed(() => {
        const map = new Map<string | number, Product>();
        for (const product of this.products()) {
            map.set(product.id, product);
            map.set(String(product.id), product);
        }
        return map;
    });

    constructor(
        private apiService: ApiService
    ) {
        this.loadProducts();
    }

    public loadProducts(): void {
        if (this.products().length > 0) return;

        this.isLoading.set(true);
        this.apiService.getProducts().subscribe({
            next: (data) => {
                this.products.set(data);
                this.products().sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error products loading:', err);
                this.isLoading.set(false);
            },
        });
    }

    public getProductById(id: number | string): Product | undefined {
        return this.productsMap().get(id);
    }
}