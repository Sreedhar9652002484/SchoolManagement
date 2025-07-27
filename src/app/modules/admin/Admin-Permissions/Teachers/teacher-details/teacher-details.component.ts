import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-teacher-details',
  standalone: false,
  templateUrl: './teacher-details.component.html',
  styleUrl: './teacher-details.component.scss'
})
export class TeacherDetailsComponent {

  teacher: any;
  state: string = 'in';
   getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }
 teacherId!: string;
    constructor(private  router:Router,private activatedRoute: ActivatedRoute){}
    ngOnInit() {
       this.activatedRoute.params.subscribe(params => {
        this.teacherId = params['teacherId'];
       })
    const teacherStr = localStorage.getItem('selectedTeacher');
    if (teacherStr) {
      this.teacher = JSON.parse(teacherStr);
      if(this.teacher.TeacherUniqueId == this.teacherId)
      {
        console.log(this.teacher)
      }
      else{
        this.router.navigate(['/admin/teachers']);
      }
      console.log(this.teacher);
    } else {
      this.router.navigate(['/admin/teachers']);
    }
  }
}
