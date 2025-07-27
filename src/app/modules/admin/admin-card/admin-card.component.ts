import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-card',
  standalone: false,
  templateUrl: './admin-card.component.html',
  styleUrl: './admin-card.component.scss'
})
export class AdminCardComponent {
  @Input() title!: string;
  @Input() value!: string;
  @Input() subtitle!: string;
  @Input() iconSrc!: string;
  @Input() changeValue!: string;
  @Input() changePositive: boolean = true;
}
