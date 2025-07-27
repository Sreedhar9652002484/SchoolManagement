import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../../Services/AuthService';

@Component({
  selector: 'app-admin-header',
  standalone: false,
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
@Input() isSidebarOpen = true;
@Output() toggleSidebar = new EventEmitter<void>();
  userName: string = 'Admin';
  userProfileImage: string = 'https://via.placeholder.com/40';

  constructor(private authService: AuthService) {}

  ngOnInit() {
  const email = this.authService.getEmail();
  if (email) {
    this.userName = email.split('@')[0];
  }
}


  toggleTheme() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme');
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
