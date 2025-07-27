import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme = 'light-theme';

  setTheme(theme: 'light-theme' | 'dark-theme') {
    document.body.classList.remove(this.currentTheme);
    document.body.classList.add(theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme') as 'light-theme' | 'dark-theme';
    this.setTheme(savedTheme || 'light-theme');
    //console.log(savedTheme);
  }

  toggleTheme() {
    this.setTheme(this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme');
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }
}
