import { Component, signal, computed, inject } from '@angular/core';

import { AdminProduct } from './admin-product/admin-product';
import { AdminCategories } from './admin-categories/admin-categories';
import { AdminOrderTab } from './admin-order-tab/admin-order-tab';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AdminProduct, AdminCategories, AdminOrderTab],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent {


}