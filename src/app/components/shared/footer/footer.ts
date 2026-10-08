import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
  
  <footer class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-center">
    <p class="text-slate-400 text-xs">&copy; {{ currentYear }} Gąbka Studio. All rights reserved.</p>
  </footer>
  `,
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  public currentYear: number | undefined = new Date().getFullYear();

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }
}
