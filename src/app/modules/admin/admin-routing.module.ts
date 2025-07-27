import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAnalyticsComponent } from './admin-analytics/admin-analytics.component';
import { UserManagementComponent } from './Admin-Permissions/user-management/user-management.component';
import { StudentManagementComponent } from './Admin-Permissions/Students/student-management/student-management.component';
import { StudentDetailsComponent } from './Admin-Permissions/Students/student-details/student-details.component';
import { TeacherManagementComponent } from './Admin-Permissions/Teachers/teacher-management/teacher-management.component';
import { TeacherDetailsComponent } from './Admin-Permissions/Teachers/teacher-details/teacher-details.component';
import { SubjectsComponent } from './Admin-Permissions/subjects/subjects.component';


const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },  
      { path: 'analytics', component: AdminAnalyticsComponent },
      { path: 'manageusers', component: UserManagementComponent },
      { path: 'students', component: StudentManagementComponent },
      { path: 'studentdetails/:studentId', component: StudentDetailsComponent },
      { path: 'teachers', component: TeacherManagementComponent },
      { path: 'teacherdetails/:teacherId', component: TeacherDetailsComponent },
      { path: 'subjects', component: SubjectsComponent },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
