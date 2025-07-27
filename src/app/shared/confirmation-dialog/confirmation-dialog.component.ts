import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: false,
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
 @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure?';
  @Output() result = new EventEmitter<boolean>();

  confirm() {
    this.result.emit(true);
  }

  cancel() {
    this.result.emit(false);
  }
}
