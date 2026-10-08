import { ChangeDetectionStrategy, Component, signal, output, computed } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/restaurant.model';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-cat-nav',
  imports: [CommonModule],
  templateUrl: './cat-nav.html',
  styleUrl: './cat-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatNavComponent {
  public categories = signal<Category[]>([]);
  public isReady = computed(() => !this.categoriesService.isLoading() && this.categoriesService.categories().length > 0);

  public categorySelected = output<number | undefined>();
  public selectedCat: number = 1;


  constructor(
    public categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.select(1);
  }

  public select(id: number): void {
    this.selectedCat = id;
    this.categorySelected.emit(id);
  }

}
