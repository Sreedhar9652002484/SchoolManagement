import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../../Services/ApiService';
import { ToastService } from '../../../../../../Services/ToastService';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-management',
  standalone: false,
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss'
})
export class StudentManagementComponent {


@ViewChild('studentModal') studentModal!: ElementRef;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  students: any[] = [];
  classes: any[] = [];
  departments: any[] = [];
  availableStudents: any[] = [];
  filteredClasses: any[] = [];
  newStudent: any = {
    studentId: null,
    studentUniqueId: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    profilePictureUrl: '',
    classId: null,
    departmentId: null,
    userId: null,
    section: '',
    admissionDate: '',
    isActive: true
  };
  editingStudent: any = null;
  private modalInstance: Modal | null = null;
  ShowLoader: boolean = false;

  constructor(private apiService: ApiService, private toaster: ToastService, private router:Router) {
    this.getInitialData();
  }

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.studentModal.nativeElement);
  }

  getInitialData() {
    this.ShowLoader = true;
    const reqData = { reqObj: JSON.stringify({}) };
this.apiService.postRequest('StudentManagement/GetAllStudents',reqData).subscribe({
        next: (response: any) => {
          if (response.success) {
          const parsedData = JSON.parse(response.data);
          console.log(parsedData)
          this.availableStudents = parsedData.AvailableUsers || [];
          this.departments = parsedData.Departments || [];
          this.classes = parsedData.Classes || [];
          this.students = parsedData.AllStudents || [];
          console.log("st", this.students);
         // this.filteredClasses = this.classes; // Initialize filteredClasses
        //  this.getStudents();
         this.ShowLoader = false;
        } else {
          this.ShowLoader = false;
          this.toaster.error(response.message || response.message, 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error('Error fetching lookup data', 'Error');
      }
    });
  }

  get filteredStudents(): any[] {
    return this.students.filter(student =>
      (student.studentUniqueId?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       student.fullName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       student.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       this.getClassName(student.classId)?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       this.getDepartmentName(student.departmentId)?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  get pagedStudents(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.pageSize);
  }

  get showingFrom(): number {
    return this.filteredStudents.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredStudents.length);
  }

  getClassName(classId: number): string {
    const cls = this.classes.find(c => c.CLASSID === classId);
    return cls ? cls.CLASSNAME : '';
  }

  getDepartmentName(departmentId: number): string {
    const dept = this.departments.find(d => d.DEPARTMENTID === departmentId);
    return dept ? dept.DEPARTMENTNAME : '';
  }

  onDepartmentChange() {
    if (this.newStudent.departmentId) {
      this.filteredClasses = this.classes.filter(cls => cls.DEPARTMENTID === +this.newStudent.departmentId);
      this.newStudent.classId = null; 
    } else {
      this.filteredClasses = this.classes;
    }
  }


  onUserChange() {
  const selectedUser = this.availableStudents.find(user => user.USERID === +this.newStudent.userId);
  if (selectedUser) {
    this.newStudent.fullName = selectedUser.FULLNAME;
    this.newStudent.email = selectedUser.EMAIL;
  } else {
    this.newStudent.fullName = '';
    this.newStudent.email = '';
  }
}
openAddEditModal(student?: any) {
  debugger
  this.editingStudent = student ? { ...student } : null;
 this.newStudent = student
    ? {
        studentId: student.StudentId,
        studentUniqueId: student.StudentUniqueId,
        fullName: student.FullName,
        email: student.Email,
        mobileNumber: student.MobileNumber,
        dateOfBirth: student.DateOfBirth?.split('T')[0] || student.DateOfBirth,
        gender: student.Gender,
        address: student.Address,
        profilePictureUrl: student.ProfilePictureUrl,
        classId: student.ClassId,
        
        departmentId: student.DepartmentId,
        userId: student.UserId,
        section: student.Section,
        admissionDate: student.AdmissionDate?.split('T')[0] || student.AdmissionDate,
        isActive: student.IsActive
      }
    : {
        studentId: null,
        studentUniqueId: '',
        fullName: '',
        email: '',
        mobileNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        profilePictureUrl: '',
        classId: null,
        departmentId: null,
        userId: null,
        section: '',
        admissionDate: '',
        isActive: true
      };
  this.onDepartmentChange();
  if (this.modalInstance) {
    this.modalInstance.show();
  }
}

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.newStudent = {
      studentId: null,
      studentUniqueId: '',
      fullName: '',
      email: '',
      mobileNumber: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      profilePictureUrl: '',
      classId: null,
      departmentId: null,
      userId: null,
      section: '',
      admissionDate: '',
      isActive: true
    };
    this.editingStudent = null;
  }

  addStudent() {
    this.ShowLoader = true;
    const reqData = {
      reqObj: JSON.stringify({
        FullName: this.newStudent.fullName,
        Email: this.newStudent.email,
        MobileNumber: this.newStudent.mobileNumber,
        DateOfBirth: this.newStudent.dateOfBirth,
        Gender: this.newStudent.gender,
        Address: this.newStudent.address,
        ProfilePictureUrl: this.newStudent.profilePictureUrl,
        ClassId: this.newStudent.classId,
        DepartmentId: this.newStudent.departmentId,
        UserId: this.newStudent.userId,
        Section: this.newStudent.section,
        AdmissionDate: this.newStudent.admissionDate
      })
    };
this.apiService.postRequest('StudentManagement/AddStudent',reqData).subscribe({
      next: (response: any) => {
        this.ShowLoader = false;
        if (response.success) {
          this.toaster.success(response.message, 'Success');
          this.closeModal();
          this.getInitialData();
        } else {
          this.toaster.error(response.message || response.MESSAGE, 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error('Error adding student', 'Error');
      }
    });
  }

  updateStudent() {
    this.ShowLoader = true;
    const reqData = {
      reqObj: JSON.stringify({
        StudentId: this.newStudent.studentId,
        FullName: this.newStudent.fullName,
        Email: this.newStudent.email,
        MobileNumber: this.newStudent.mobileNumber,
        DateOfBirth: this.newStudent.dateOfBirth,
        Gender: this.newStudent.gender,
        Address: this.newStudent.address,
        ProfilePictureUrl: this.newStudent.profilePictureUrl,
        ClassId: this.newStudent.classId,
        DepartmentId: this.newStudent.departmentId,
        UserId: this.newStudent.userId,
        Section: this.newStudent.section,
        AdmissionDate: this.newStudent.admissionDate
      })
    };
this.apiService.postRequest('StudentManagement/UpdateStudent',reqData).subscribe({
      next: (response: any) => {
        this.ShowLoader = false;
        if (response.success) {
          this.toaster.success(response.message, 'Success');
          this.closeModal();
          this.getInitialData();
        } else {
          this.toaster.error(response.message || response.MESSAGE, 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error('Error updating student', 'Error');
      }
    });
  }

  deleteStudent(studentId: number) {
   this.toaster.confirm('Are you sure you want to delete?', 'Delete')
  .subscribe((confirmed) => {
    if (confirmed) {
        this.ShowLoader = true;
      const reqData = { reqObj: JSON.stringify({ StudentId: studentId }) };
    this.apiService.postRequest('StudentManagement/DeleteStudent',reqData).subscribe({
        next: (response: any) => {
          this.ShowLoader = false;
        if (response.success) {
            this.toaster.success(response.message, 'Success');
            this.getInitialData();
          } else {
            this.toaster.error(response.message || response.MESSAGE, 'Error');
          }
        },
        error: (err: any) => {
          this.ShowLoader = false;
          this.toaster.error('Error deleting student', 'Error');
        }

      });
    }
     else {
      this.ShowLoader = false;
      this.toaster.warning('User Cancelled');
    }
  });
  }

  toggleStatus(studentId: number, action: string) {
    this.ShowLoader = true;
    const reqData = { reqObj: JSON.stringify({ StudentId: studentId }) };
      let endpoint = ''
    action == 'Active'? endpoint = 'StudentManagement/ActivateStudent': endpoint = 'StudentManagement/DeactivateStudent';
    this.apiService.postRequest(endpoint,reqData).subscribe({
      next: (response: any) => {
        this.ShowLoader = false;
          if (response.success) {
          this.toaster.success(response.message, 'Success');
          this.getInitialData();
        } else {
          this.toaster.error(response.message || response.MESSAGE, 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error(`Error ${action.toLowerCase()}ing student`, 'Error');
      }
    });
  }
  viewStudentDetails(student:any){
    localStorage.setItem('selectedStudent', JSON.stringify(student));
    this.router.navigate([`/admin/studentdetails/${student.StudentUniqueId}`])
    }
}
