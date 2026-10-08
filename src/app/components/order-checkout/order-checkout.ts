import { ChangeDetectionStrategy, inject, Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderComponent } from '../order/order';
import { CustomerInfo } from '../../models/restaurant.model';
import { OrderService } from '../../services/order.service';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-order-checkout',
  imports: [ReactiveFormsModule, CommonModule, OrderComponent, RouterLink],
  templateUrl: './order-checkout.html',
  styleUrl: './order-checkout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCheckoutComponent implements OnInit {
  ngOnInit(): void {
  }

  constructor(
    public orderService: OrderService,
    public router: Router
  ) { 
  }
  
  private fb = inject(FormBuilder);

  // Tworzymy strukturę formularza z podziałem na sekcje
  checkoutForm: FormGroup = this.fb.group({
    customer: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{9,15}$/)]],
    }),
    address: this.fb.group({
      street: ['', [Validators.required]],
      buildingNumber: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]], // 00-000
      city: ['', [Validators.required]],
    }),
    paymentMethod: ['cash', [Validators.required]],
    notes: [''],
  });

  
  isFieldInvalid(groupName: string, fieldName: string): boolean {
    const field = this.checkoutForm.get(`${groupName}.${fieldName}`);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      let customer: CustomerInfo;
      customer = this.checkoutForm.value as CustomerInfo;

      this.orderService.submitOrder(customer).subscribe({
          next: (savedOrder) => {
            
            this.router.navigate(['/order-success']);
          },
          error: (err) => {
            console.error('submitOrder:', err);
            alert('Something goes wrong, please try again');
          }
        });

    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
