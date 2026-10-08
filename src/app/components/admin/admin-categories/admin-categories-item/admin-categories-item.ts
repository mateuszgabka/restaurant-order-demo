import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../models/restaurant.model';
import { AdminCategoriesEdit } from '../admin-categories-edit/admin-categories-edit';

@Component({
  selector: 'app-admin-categories-item',
  imports: [AdminCategoriesEdit],
  templateUrl: './admin-categories-item.html',
  styleUrl: './admin-categories-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCategoriesItem {

  constructor(
    private apiService: ApiService,
    private categoriesService: CategoriesService
  ) {

  }
  @Input() category?: Category;
  public showEditCategory: boolean = false;

  public onCategoryCancel(status: boolean) {
    if (status) {
      this.showEditCategory = false;
    }
  }

  deleteCategory(id: number): void {
    this.apiService.deleteCategory(id).subscribe({
      next: () => {
        this.categoriesService.categories.update(category =>
          category.filter(p => p.id !== id)
        );
      },
      error: (err) => {
        console.error('deleteCategory:', err);
      }
    });
  }

  

}
