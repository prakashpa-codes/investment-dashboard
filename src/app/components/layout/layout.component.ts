import { Component, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    DashboardComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  //navLinks: string[] = ['Dashboard', 'Investments', 'Reports', 'Settings'];
  isMobile: boolean = window.innerWidth <= 768;
  isSidenavOpen: boolean = !this.isMobile; // Open in desktop, closed in mobile
  menuIcon: string = this.isSidenavOpen ? 'menu_open' : 'menu'; // Ensures correct icon on load

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => this.updateSidebarState(), 0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateSidebarState();
  }

  private updateSidebarState(): void {
    this.isMobile = window.innerWidth <= 768;
    if (this.sidenav) {
      this.sidenav.mode = this.isMobile ? 'over' : 'side';
      this.isSidenavOpen = !this.isMobile; // Reset open state on resize
      this.menuIcon = this.isSidenavOpen ? 'menu_open' : 'menu'; // Ensures correct icon after resize
    }
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.isSidenavOpen = !this.sidenav.opened; // Toggle based on actual state
      this.sidenav.toggle();
      this.menuIcon = this.isSidenavOpen ? 'menu_open' : 'menu'; // Always correct icon
    }
  }

  closeSidenav(): void {
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
      this.isSidenavOpen = false;
      this.menuIcon = 'menu'; // Reset icon when closing in mobile
    }
  }
}
