import { Component, Input } from '@angular/core';
import { AuthService } from '../../../../Services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: false,
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {
 @Input() isSidebarOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
}
