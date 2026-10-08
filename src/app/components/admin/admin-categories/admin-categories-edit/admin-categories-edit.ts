import { ChangeDetectionStrategy, Component, Input, effect, signal, output } from '@angular/core';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../models/restaurant.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-categories-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories-edit.html',
  styleUrl: './admin-categories-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCategoriesEdit {
  @Input() showStatus?: boolean;
  @Input() id?: number;

  public category = signal<Category>(new Category());
  public cancelCategory = output<boolean>();

  constructor(
    private categoriesService: CategoriesService,
    private apiService: ApiService
  ) {
    effect(() => {
      if (this.id) {
        const categoryToEdit = this.categoriesService.getCategoryById(this.id);
        if (categoryToEdit) {
          this.category.set(new Category({
            id: this.id,
            name: categoryToEdit.name
          }));
        }
      }
    });
  }

  onSaveCategory(): void {
    const currentCategory = this.category();

    if (!currentCategory.name?.trim()) {
      return;
    }

    // Edit
    if (this.id) {
      const updatedcategory: Category = {
        id: this.id,
        name: currentCategory.name.trim(),
      };

      this.apiService.updateCategory(this.id, updatedcategory).subscribe({
        next: (res) => {
          this.categoriesService.categories.update(categories =>
            categories.map(p => p.id === res.id ? res : p)
          );
          this.close();
        },
        error: (err) => console.error('Błąd edycji produktu:', err)
      });
    }
    // New
    else {
      const newcategoryData: Omit<Category, 'id'> = {
        name: currentCategory.name.trim()
      };

      this.apiService.addCategory(newcategoryData).subscribe({
        next: (savedCategory) => {
          this.categoriesService.categories.update(categories => [...categories, savedCategory]);
          this.category.set(new Category());
          this.close();
        },
        error: (err) => console.error('addCategory:', err)
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
    this.cancelCategory.emit(true);
  }
}
