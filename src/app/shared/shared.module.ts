import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';



@NgModule({
  declarations: [LoaderComponent, ConfirmationDialogComponent],
  imports: [
    CommonModule
  ],
  exports: [LoaderComponent] 
})
export class SharedModule { }
