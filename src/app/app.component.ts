import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RouterModule, LayoutComponent],
  template: '<app-layout></app-layout>', // Using LayoutComponent as the root template
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'investment-dashboard';
}