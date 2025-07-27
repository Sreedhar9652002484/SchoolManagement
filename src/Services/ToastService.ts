import { Injectable, ApplicationRef, ComponentRef, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable } from 'rxjs';
import { createComponent } from '@angular/core';
import { ConfirmationDialogComponent } from '../app/shared/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private confirmRef: ComponentRef<ConfirmationDialogComponent> | null = null;

  constructor(private toastr: ToastrService, private appRef: ApplicationRef, private injector: Injector) {}

  success(message: string, title: string = 'Success') {
    this.toastr.success(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right'
    });
  }

  warning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-right'
    });
  }

  error(message: string, title: string = 'Error') {
    this.toastr.error(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-right'
    });
  }

  // Confirm method that creates a custom toast with Yes/No buttons
  confirm(message: string, title: string = 'Confirm'): Observable<boolean> {
    if (this.confirmRef) {
      this.destroyConfirm(); // Ensure only one confirm at a time
    }

    const subject = new Subject<boolean>();

    // Dynamically create ConfirmToastComponent instance
    this.confirmRef = createComponent(ConfirmationDialogComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    this.confirmRef.instance.message = message;
    this.confirmRef.instance.title = title;
    this.confirmRef.instance.result.subscribe((res: boolean) => {
      subject.next(res);
      subject.complete();
      this.destroyConfirm();
    });

    // Add component's DOM element to body
    document.body.appendChild(this.confirmRef.location.nativeElement);
    this.appRef.attachView(this.confirmRef.hostView);

    return subject.asObservable();
  }

  private destroyConfirm() {
    if (this.confirmRef) {
      this.appRef.detachView(this.confirmRef.hostView);
      this.confirmRef.destroy();
      this.confirmRef = null;
    }
  }
}
