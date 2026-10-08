import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
    <header class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
      <div class="flex items-center gap-3">
        <h1 (click)="router.navigate(['/'])" class="text-xl font-bold tracking-tight hover:cursor-pointer text-amber-500"><img src="logo.png"> Restaurant <span class="text-xs text-slate-400 font-normal ml-2">Order System</span></h1>
      </div>
      
      <div class="flex items-center gap-4">
        <button (click)="router.navigate(['/login'])" class="text-sm font-medium text-slate-400 hover:text-white transition">
          Admin
        </button>
      </div>
    </header>
  `,
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(public router: Router) {}
}
