import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../../Services/ApiService';
import { ToastService } from '../../../../../../Services/ToastService';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-teacher-management',
  standalone: false,
  templateUrl: './teacher-management.component.html',
  styleUrl: './teacher-management.component.scss'
})
export class TeacherManagementComponent {
@ViewChild('teacherModal') teacherModal!: ElementRef;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  teachers: any[] = [];
  departments: any[] = [];
  availableTeachers: any[] = [];
  newTeacher: any = {
    teacherId: null,
    teacherUniqueId: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    designation: '',
    address: '',
    profilePictureUrl: '',
    departmentId: null,
    userId: null,
    isActive: true
  };
  editingTeacher: any = null;
  private modalInstance: Modal | null = null;
  ShowLoader: boolean = false;

  constructor(private apiService: ApiService, private toaster: ToastService, private router: Router) {
    this.getInitialData();
  }

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.teacherModal.nativeElement);
  }

  getInitialData() {
    this.ShowLoader = true;
    const reqData = { reqObj: JSON.stringify({}) };
    this.apiService.postRequest('TeacherManagement/GetAllTeachers', reqData).subscribe({
      next: (response: any) => {
        if (response.success) {
          const parsedData = JSON.parse(response.data);
          this.teachers = parsedData.AllTeachers || [];
          this.departments = parsedData.Departments || [];
          this.availableTeachers = parsedData.AvailableTeachers || [];
          this.ShowLoader = false;
               console.log(parsedData);
        } else {
          this.ShowLoader = false;
          this.toaster.error(response.message || 'Error fetching teacher data', 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error('Error fetching teacher data', 'Error');
      }
    });
  }

  get filteredTeachers(): any[] {
    return this.teachers.filter(teacher =>
      (teacher.teacherUniqueId?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       teacher.fullName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       teacher.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       teacher.designation?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       this.getDepartmentName(teacher.departmentId)?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  get pagedTeachers(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTeachers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTeachers.length / this.pageSize);
  }

  get showingFrom(): number {
    return this.filteredTeachers.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredTeachers.length);
  }

  getDepartmentName(departmentId: number): string {
    const dept = this.departments.find(d => d.DEPARTMENTID === departmentId);
    return dept ? dept.DEPARTMENTNAME : '';
  }

  onUserChange() {
    const selectedUser = this.availableTeachers.find(user => user.USERID === +this.newTeacher.userId);
    if (selectedUser) {
      this.newTeacher.fullName = selectedUser.FULLNAME;
      this.newTeacher.email = selectedUser.EMAIL;
    } else {
      this.newTeacher.fullName = '';
      this.newTeacher.email = '';
    }
  }

  openAddEditModal(teacher?: any) {
    this.editingTeacher = teacher ? { ...teacher } : null;
    this.newTeacher = teacher
      ? {
          teacherId: teacher.TeacherId,
          teacherUniqueId: teacher.TeacherUniqueId,
          fullName: teacher.FullName,
          email: teacher.Email,
          mobileNumber: teacher.MobileNumber,
          designation: teacher.Designation,
          address: teacher.Address,
          profilePictureUrl: teacher.ProfilePictureUrl,
          departmentId: teacher.DepartmentId,
          userId: teacher.UserId,
          isActive: teacher.IsActive
        }
      : {
          teacherId: null,
          teacherUniqueId: '',
          fullName: '',
          email: '',
          mobileNumber: '',
          designation: '',
          address: '',
          profilePictureUrl: '',
          departmentId: null,
          userId: null,
          isActive: true
        };
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.newTeacher = {
      teacherId: null,
      teacherUniqueId: '',
      fullName: '',
      email: '',
      mobileNumber: '',
      designation: '',
      address: '',
      profilePictureUrl: '',
      departmentId: null,
      userId: null,
      isActive: true
    };
    this.editingTeacher = null;
  }

  addTeacher() {
    this.ShowLoader = true;
    const reqData = { reqObj: JSON.stringify(this.newTeacher) };
    this.apiService.postRequest('TeacherManagement/AddTeacher', reqData).subscribe({
      next: (response: any) => {
        this.ShowLoader = false;
        if (response.success) {
          this.toaster.success(response.message, 'Success');
          this.closeModal();
          this.getInitialData();
        } else {
          this.toaster.error(response.message || 'Error adding teacher', 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error('Error adding teacher', 'Error');
      }
    });
  }

  updateTeacher() {
    this.ShowLoader = true;
    const reqData = { reqObj: JSON.stringify(this.newTeacher) };
    this.apiService.postRequest('TeacherManagement/UpdateTeacher', reqData).subscribe({
      next: (response: any) => {
        this.ShowLoader = false;
        if (response.success) {
          this.toaster.success(response.message, 'Success');
          this.closeModal();
          this.getInitialData();
        } else {
          this.toaster.error(response.message || 'Error updating teacher', 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error('Error updating teacher', 'Error');
      }
    });
  }

  deleteTeacher(teacherId: number) {
    this.toaster.confirm('Are you sure you want to delete?', 'Delete')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.ShowLoader = true;
          const reqData = { reqObj: JSON.stringify({ teacherId: teacherId }) };
          this.apiService.postRequest('TeacherManagement/DeleteTeacher', reqData).subscribe({
            next: (response: any) => {
              this.ShowLoader = false;
              if (response.success) {
                this.toaster.success(response.message, 'Success');
                this.getInitialData();
              } else {
                this.toaster.error(response.message || 'Error deleting teacher', 'Error');
              }
            },
            error: (err: any) => {
              this.ShowLoader = false;
              this.toaster.error('Error deleting teacher', 'Error');
            }
          });
        } else {
          this.ShowLoader = false;
          this.toaster.warning('User Cancelled');
        }
      });
  }

  toggleStatus(teacherId: number, action: string) {
    this.ShowLoader = true;
    const reqData = { reqObj: JSON.stringify({ teacherId: teacherId }) };
    const endpoint = action === 'Active' ? 'TeacherManagement/ActivateTeacher' : 'TeacherManagement/DeactivateTeacher';
    this.apiService.postRequest(endpoint, reqData).subscribe({
      next: (response: any) => {
        this.ShowLoader = false;
        if (response.success) {
          this.toaster.success(response.message, 'Success');
          this.getInitialData();
        } else {
          this.toaster.error(response.message || 'Error', 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error(`Error ${action.toLowerCase()}ing teacher`, 'Error');
      }
    });
  }

  viewTeacherDetails(teacher: any) {
    debugger
    localStorage.setItem('selectedTeacher', JSON.stringify(teacher));
    this.router.navigate([`/admin/teacherdetails/${teacher.TeacherUniqueId}`]);
  }
}
