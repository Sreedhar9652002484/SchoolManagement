import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../Services/ThemeService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  
})
export class AppComponent implements OnInit {
  title = 'crm-school-app';
  constructor(private themeService: ThemeService){
  }
  
  ngOnInit() {
    this.themeService.initTheme();
     console.log("theme")
  }
 
}
