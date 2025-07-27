import { Component, ViewEncapsulation } from '@angular/core';
import { ApiService, InputRequest, ParsedResponse } from '../../../../Services/ApiService';
import { Router } from '@angular/router';
import { ToastService } from '../../../../Services/ToastService';
import { Modal } from 'bootstrap';
import { AuthService } from '../../../../Services/AuthService';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent {
 email: string = '';
  captcha: string = '';
  otp: string = '';
  saveCredentials: boolean = false;
  userId: number | null = null;
  password: string = '';
captchaImage: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  showOTPModal: boolean = false;
    private modalInstance: Modal | null = null;
    selectedRole: string = 'Employee';


  constructor(
    private apiService: ApiService,
    private router: Router,
    private toaster:ToastService,
    private authService:AuthService
   
  ) {
     this.refreshCaptcha();
      

  }

  ngOnInit(): void {}

  refreshCaptcha() {
  this.captchaImage = `https://dummyimage.com/150x50/000/fff&text=${Math.random().toString(36).substring(2, 8)}`;
}

onSignIn(): void {
  this.errorMessage = '';
  this.successMessage = '';
  if (!this.email) {
    this.errorMessage = 'Please enter your email.';
    return;
  }

  if (this.selectedRole === 'Customer') {
     if (!this.captcha) {
    this.errorMessage = 'Please enter captcha.';
    return;
  }
    // Customer login via OTP
    const reqData: InputRequest = {
      reqObj: JSON.stringify({
        P_EMAIL: this.email,
        P_ACTION: 'CREATE',
        P_ROLE: 'Customer'
      })
    };

    this.apiService.postRequest('Account/Login', reqData).subscribe({
      next: (response: ParsedResponse) => {
        if (response.success) {
          const parsed = JSON.parse(response.data);
          this.userId = parsed.UserId;
          this.otp = parsed.OTP;
          this.successMessage = response.message;
          this.showOTPModal = true;
         setTimeout(() => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const modalElement = document.getElementById('otpModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, { backdrop: 'static' });
      this.modalInstance.show();
    } else {
      this.errorMessage = 'OTP modal element not found.';
    }
  }
}, 0);

        } else {
         this.toaster.error(response.message, "Error")
          this.errorMessage = response.message || 'Failed to send OTP.';
        }
      },
      error: (err:any) => {
        this.errorMessage = err.message || 'Error during OTP generation.';
        this.toaster.error("Error While Login", "Error")
      }
    });

  } else if (this.selectedRole === 'Employee') {

    if (!this.password) {
      this.errorMessage = 'Please enter your password.';
      return;
    }
    const reqData: InputRequest = {
      reqObj: JSON.stringify({
        P_EMAIL: this.email,
        P_PASSWORD: this.password,
        P_ACTION: 'VERIFY',
        P_ROLE: 'Employee'
      })
    };
    this.apiService.postRequest('Account/Login', reqData).subscribe({
      next: (response: ParsedResponse) => {
        if (response.success) {
          this.successMessage = response.message;
          this.toaster.success(response.message, "Success")
        localStorage.setItem('Token', response.token);
       const role = this.authService.getRole();

       console.log("role", role)

switch(role) {
  case 'Admin':
    this.router.navigate(['/admin']);
    break;
  case 'Customer':
    this.router.navigate(['/customer-dashboard']);
    break;
  case 'Employee':
    this.router.navigate(['/employee-dashboard']);
    break;
  default:
    this.router.navigate(['/auth/signin']);
}

        } else {
          this.toaster.error(response.message, "Error")
        }
      },
      error: (err:any) => {
       this.toaster.error("Error While Login", "Error")

        this.errorMessage = err.message || 'Error during employee login.';
      }
    });
  }
}
  generateOtp(action: string = 'CREATE'): void {
    // Validate email
    if (!this.email) {
      this.errorMessage = 'Email is required to generate OTP.';
      return;
    }
    const reqData: InputRequest = {
      reqObj: JSON.stringify({
        P_EMAIL: this.email,
          P_ACTION:action
      }),
    
    };

    this.apiService.postRequest('Account/Login', reqData).subscribe({
      next: (response: ParsedResponse) => {
        if (response.success) {
          this.userId = response.data.UserId; 
          this.successMessage = response.message;
          if (action === 'CREATE') {
           this.showOTPModal = true;
            setTimeout(() => {
              const modalElement = document.getElementById('otpModal');
              if (modalElement) {
                this.modalInstance = new Modal(modalElement, { backdrop: 'static' });
                this.modalInstance.show();
              } else {
                this.errorMessage = 'OTP modal element not found.';
              }
            }, 0);
          
          }
          // Simulate sending OTP to email
          console.log(`${action === 'CREATE' ? 'OTP sent' : 'OTP resent'} to ${this.email}`);
        } else {
          this.errorMessage = response.message || `Failed to ${action.toLowerCase()} OTP.`;
        }
      },
      error: (err:any) => {
        this.errorMessage = err.message || `An error occurred while ${action.toLowerCase()}ing OTP.`;
      }
    });
  }

  resendOtp(): void {
    this.generateOtp('RESEND');
  }

  verifyOtp(): void {
    if (!this.otp || this.otp.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP.';
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'User ID is missing. Please try signing in again.';
      return;
    }

    // Create InputRequest for VERIFY OTP
    const reqData: InputRequest = {
      reqObj: JSON.stringify({
        P_EMAIL:this.email,
        P_USERID: this.userId,
        P_OTPCODE: this.otp,
        P_ACTION:'VERIFY'
      }),
    
    };

    this.apiService.postRequest('Account/Login', reqData).subscribe({
      next: (response: ParsedResponse) => {
        if (response.success) {
          this.successMessage = response.message;
          this.toaster.success(response.message, "Success")
          this.showOTPModal = false;
           this.modalInstance?.hide();
//localStorage.setItem('userRole', response.role);
            localStorage.setItem('Token', response.token);
          if (this.saveCredentials) {
            // Save credentials securely (e.g., to localStorage)
            localStorage.setItem('userEmail', this.email);
          }
         // setTimeout(() => this.router.navigate(['/analytics']), 2000);
        } else {
          this.toaster.error(response.message, "Error")
        }
      },
      error: (err:any) => {
        this.errorMessage = err.message || 'An error occurred while verifying OTP.';
      }
    });
  }

  resetPassword(): void {
    this.router.navigate(['/auth/reset-password']);
  }

    hideModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.showOTPModal = false;
      this.modalInstance = null;
    }
  }
}
