import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CategoriesService } from '../../../services/categories.service';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { AdminCategoriesEdit } from './admin-categories-edit/admin-categories-edit';
import { AdminCategoriesItem } from './admin-categories-item/admin-categories-item';
import { Category } from '../../../models/restaurant.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-categories',
  imports: [CdkDropList, CdkDrag, AdminCategoriesEdit, AdminCategoriesItem],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCategories {

  
  public showAddCategory: boolean = false;


  constructor(
    private apiService: ApiService,
    public categoriesService: CategoriesService
  ) {

  }
  
  
  onCategoryDrop(event: CdkDragDrop<Category[]>): void {
    const categories = this.categoriesService.categories();
    moveItemInArray(categories, event.previousIndex, event.currentIndex);

    categories.forEach((cat, index) => {
      const updatedPosition = index + 1;

      if (cat.id !== updatedPosition) {
        cat.id = updatedPosition;

        if (cat.id) {
          this.apiService.updateCategory(cat.id, cat).subscribe();
        }
      }
    });

    const allCategories = this.categoriesService.categories().map(p => {
      const updated = categories.find(cp => cp.id === p.id);
      return updated ? updated : p;
    });

    this.categoriesService.categories.set(allCategories);
  }

  
  public onCategoryCancel(status: boolean) {
    if (status) {
      this.showAddCategory = false;
    }
  }

}
