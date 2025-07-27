import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AdminCardComponent } from './admin-card/admin-card.component';
import { AdminAnalyticsComponent } from './admin-analytics/admin-analytics.component';
import { NgChartsModule } from 'ng2-charts';
import { UserManagementComponent } from './Admin-Permissions/user-management/user-management.component';
import { FormsModule } from '@angular/forms';
import { StudentManagementComponent } from './Admin-Permissions/Students/student-management/student-management.component';
import { StudentDetailsComponent } from './Admin-Permissions/Students/student-details/student-details.component';
import { TeacherCardComponent } from './Admin-Permissions/Teachers/teacher-card/teacher-card.component';
import { TeacherManagementComponent } from './Admin-Permissions/Teachers/teacher-management/teacher-management.component';
import { TeacherDetailsComponent } from './Admin-Permissions/Teachers/teacher-details/teacher-details.component';
import { SubjectsComponent } from './Admin-Permissions/subjects/subjects.component';



@NgModule({
  declarations: [AdminHeaderComponent,AdminSidebarComponent,AdminDashboardComponent,AdminCardComponent,AdminAnalyticsComponent,
    UserManagementComponent,StudentManagementComponent, StudentDetailsComponent, TeacherManagementComponent, TeacherCardComponent, TeacherDetailsComponent,
  SubjectsComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    NgChartsModule,
    FormsModule,
    SharedModule
  ]
})
export class AdminModule { }
