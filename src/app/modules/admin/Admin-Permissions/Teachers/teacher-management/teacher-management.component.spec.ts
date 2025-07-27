import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherManagementComponent } from './teacher-management.component';

describe('TeacherManagementComponent', () => {
  let component: TeacherManagementComponent;
  let fixture: ComponentFixture<TeacherManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
