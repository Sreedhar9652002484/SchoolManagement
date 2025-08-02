import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { ApiService } from '../../../../../Services/ApiService';
import { ToastService } from '../../../../../Services/ToastService';

@Component({
  selector: 'app-subjects',
  standalone: false,
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent {
  @ViewChild('subjectModal') subjectModal!: ElementRef;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  mappings: any[] = [];
  subjects: any[] = [];
  teachers: any[] = [];
  classes: any[] = [];
  periods:any[] = [];
  sections: any[] = [];
  newMapping: any = {
    mappingId: null,
    subjectId: null,
    teacherId: null,
    periodId: null,
    classId: null,
    section: '',
    academicYear:'',
    isActive: true
  };

  editingMapping: any = null;
  private modalInstance: Modal | null = null;
  ShowLoader: boolean = false;


  constructor(private apiService: ApiService, private toaster: ToastService, private router: Router) {
    this.getInitialData();
  }

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.subjectModal.nativeElement);
  }

  getInitialData() {
    this.ShowLoader = true;
    const reqData = { reqObj: JSON.stringify({}) };
    this.apiService.postRequest('SubjectMapping/GetAllMappings', reqData).subscribe({
      next: (response: any) => {
           
        if (response.StCode  === 'S') {
          const parsedData = JSON.parse(response.data);
         this.mappings = parsedData.AllMappings || [];
          this.subjects = parsedData.Subjects || [];
          this.teachers = parsedData.Teachers || [];
          this.classes = parsedData.Classes || [];
          this.periods = parsedData.Periods || [];
          this.sections = parsedData.Sections || []; 
          this.ShowLoader = false;
          console.log(parsedData);
        } else {
          this.ShowLoader = false;
          this.toaster.error(response.message || 'Error fetching subject mappings', 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error('Error fetching subject mappings', 'Error');
      }
    });
  }

  get filteredMappings(): any[] {
    return this.mappings.filter(mapping =>
      (mapping.DEPARTMENTNAME?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       mapping.FULLNAME?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
  get pagedMappings(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMappings.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMappings.length / this.pageSize);
  }

  get showingFrom(): number {
    return this.filteredMappings.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredMappings.length);
  }



  openAddEditModal(mapping?: any) {
    this.editingMapping = mapping ? { ...mapping } : null;
    
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.newMapping = {
      mappingId: null,
      subjectId: null,
      teacherId: null,
      studentIds: [],
      isActive: true
    };
    this.editingMapping = null;
  }

  addMapping() {
    debugger
    this.ShowLoader = true;
    const reqData = { reqObj: JSON.stringify(this.newMapping) };
    this.apiService.postRequest('SubjectMapping/AddMapping', reqData).subscribe({
      next: (response: any) => {
        this.ShowLoader = false;
        if (response.success) {
          this.toaster.success(response.message, 'Success');
          this.closeModal();
          this.getInitialData();
        } else {
          this.toaster.error(response.message || 'Error adding mapping', 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error('Error adding mapping', 'Error');
      }
    });
  }

  updateMapping() {
    this.ShowLoader = true;
    const reqData = { reqObj: JSON.stringify(this.newMapping) };
    this.apiService.postRequest('SubjectMapping/UpdateMapping', reqData).subscribe({
      next: (response: any) => {
        this.ShowLoader = false;
        if (response.success) {
          this.toaster.success(response.message, 'Success');
          this.closeModal();
          this.getInitialData();
        } else {
          this.toaster.error(response.message || 'Error updating mapping', 'Error');
        }
      },
      error: (err: any) => {
        this.ShowLoader = false;
        this.toaster.error('Error updating mapping', 'Error');
      }
    });
  }

  deleteMapping(mappingId: number) {
    this.toaster.confirm('Are you sure you want to delete?', 'Delete')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.ShowLoader = true;
          const reqData = { reqObj: JSON.stringify({ mappingId: mappingId }) };
          this.apiService.postRequest('SubjectMapping/DeleteMapping', reqData).subscribe({
            next: (response: any) => {
              this.ShowLoader = false;
              if (response.success) {
                this.toaster.success(response.message, 'Success');
                this.getInitialData();
              } else {
                this.toaster.error(response.message || 'Error deleting mapping', 'Error');
              }
            },
            error: (err: any) => {
              this.ShowLoader = false;
              this.toaster.error('Error deleting mapping', 'Error');
            }
          });
        } else {
          this.ShowLoader = false;
          this.toaster.warning('User Cancelled');
        }
      });
  }

  toggleStatus(mappingId: number, action: string) {
    this.ShowLoader = true;
    const reqData = { reqObj: JSON.stringify({ mappingId: mappingId }) };
    const endpoint = action === 'Active' ? 'SubjectMapping/ActivateMapping' : 'SubjectMapping/DeactivateMapping';
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
        this.toaster.error(`Error ${action.toLowerCase()}ing mapping`, 'Error');
      }
    });
  }

  viewMappingDetails(mapping: any) {
    localStorage.setItem('selectedMapping', JSON.stringify(mapping));
    this.router.navigate([`/admin/mappingdetails/${mapping.MappingId}`]);
  }
}