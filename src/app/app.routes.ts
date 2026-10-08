import { Routes } from '@angular/router';


import { HomeComponent } from './components/home/home';
import { OrderCheckoutComponent } from './components/order-checkout/order-checkout';
import { OrderSucessComponent } from './components/order-sucess/order-sucess';
import { AuthGuard } from './auth/auth.guard';
import { AdminComponent } from './components/admin/admin';
import { LoginComponent } from './components/admin/login/login';

export const routes: Routes = [
    { path: '', component: HomeComponent  },
    { path: 'home', component: HomeComponent },
    { path: 'checkout', component: OrderCheckoutComponent },
    { path: 'order-success', component: OrderSucessComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard.canActivate()]}
];
