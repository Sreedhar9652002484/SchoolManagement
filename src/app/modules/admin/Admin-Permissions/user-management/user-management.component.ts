import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { ApiService, ParsedResponse } from '../../../../../Services/ApiService';
import { ToastService } from '../../../../../Services/ToastService';



@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
 @ViewChild('userModal') userModal!: ElementRef;
  private modalInstance: Modal | null = null;
  
ShowLoader: boolean = false;
roles: any[] = [];
users:any[]=[];
searchTerm: string = '';
currentPage: number = 1;
pageSize: number = 10;


  constructor(private apiService:ApiService, private toaster:ToastService) {
    this.getIntialData()

  }


  newUser = { userId:null,name: '', email: '',password:'', roleId: null, role:''};
  editingUser: any;


  ngAfterViewInit() {
    if (this.userModal) {
      this.modalInstance = new Modal(this.userModal.nativeElement);
    }
  }
  

  getIntialData(){
    this.ShowLoader = true;
     const reqData = {
     reqObj :JSON.stringify({
      role:"Admin"
    })
  }
     this.apiService.postRequest('UserManagement/GetRoles',reqData).subscribe({
          next: (response: any) => {
           
            if (response.success) {
            const parsedData = JSON.parse(response.data);
            this.roles = parsedData.Roles;
            this.users = parsedData.AllUsers;
         
             this.ShowLoader = false;

            } else {
             this.ShowLoader = false;

              this.toaster.error(response.message, "Error")
            }
          },
          error: (err:any) => {
            
          }
        });
  }


get filteredUsers(): any[] {
  return this.users.filter(user =>
    user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    user.userId?.toString().includes(this.searchTerm)  
  );
}


get pagedUsers(): any[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.filteredUsers.slice(start, start + this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.filteredUsers.length / this.pageSize);
}

get showingFrom(): number {
  return this.filteredUsers.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
}

get showingTo(): number {
  return Math.min(this.currentPage * this.pageSize, this.filteredUsers.length);
}

  openAddEditModal(user?: any) {
    this.editingUser = user ? { ...user } : null;
    this.newUser = user ? { ...user } : {name: '', email: '', roleId: null, role:'' };
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }


  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.newUser = {userId:null, name: '', email: '',password:'', roleId: null, role:'' };
    this.editingUser = null;
  }


addUser(type:string) {
  this.ShowLoader = true;
  const selectedRole = this.roles.find((x: any) => x.RoleId == this.newUser.roleId);
   type == 'CREATE'?'CREATE':'UPDATE';
    this.newUser.role = selectedRole.RoleName;
    const reqData = {
     reqObj :JSON.stringify({
      name:this.newUser.name,
      email:this.newUser.email,
      password:this.newUser.password,
      roleId:this.newUser.roleId,
      role: this.newUser.role,
      UserId:this.newUser.userId,
      type:type
       })
  }


     this.apiService.postRequest('UserManagement/AddEditUser',reqData).subscribe({
          next: (response: ParsedResponse) => {
         
            if (response.success) {
              this.toaster.success(response.message, "Success");
              this.ShowLoader = false;
            this.getIntialData()
            } else {
              this.toaster.error(response.message, "Error")
               this.ShowLoader = false;
            }
          }
        });
    this.closeModal();
  }

deleteUser(id: number) {
    this.toaster.confirm('Are you sure you want to delete?', 'Delete')
  .subscribe((confirmed) => {
    if (confirmed) {
        this.ShowLoader = true;

      const reqData:any = {
     reqObj :JSON.stringify({
      UserId:id
       })
      }

    this.apiService.postRequest('UserManagement/DeleteUser',reqData).subscribe({
          next: (response: ParsedResponse) => {
     
            if (response.success) {
              this.ShowLoader = false;
              this.toaster.success(response.message, "Success");
            this.getIntialData()
            } else {
              this.ShowLoader = false;
              this.toaster.error(response.message, "Error")
            }
          }
        })
      
    } else {
      this.ShowLoader = false;
      this.toaster.warning('User Cancelled');
    }
  });
  }

  toggleStatus(id: number, action:string) {
        debugger
        this.ShowLoader = true;
       const reqData:any = {
     reqObj :JSON.stringify({
      UserId:id
       })
      }
      let endpoint = ''
      action == 'Active'? endpoint = 'UserManagement/ActivateUser': endpoint = 'UserManagement/DeactivateUser';
    this.apiService.postRequest(endpoint,reqData).subscribe({
          next: (response: ParsedResponse) => {
        
            if (response.success) {
              this.ShowLoader = false;
              this.toaster.success(response.message, "Success");
            this.getIntialData()
            } else {
              this.ShowLoader = false;
              this.toaster.error(response.message, "Error")
            }
          }
        })
  }
}
