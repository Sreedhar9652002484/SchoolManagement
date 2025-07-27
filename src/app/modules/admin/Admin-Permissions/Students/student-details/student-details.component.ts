import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-student-details',
  standalone: false,
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.scss'
})
export class StudentDetailsComponent {
  student:any;
  studentId!: string;
  constructor(private  router:Router,private activatedRoute: ActivatedRoute){}

  ngOnInit() {
     this.activatedRoute.params.subscribe(params => {
      this.studentId = params['studentId'];
     })
  const studentStr = localStorage.getItem('selectedStudent');
  if (studentStr) {
    debugger
    this.student = JSON.parse(studentStr);
    if(this.student.StudentUniqueId == this.studentId)
    {

    }
    else{
      this.router.navigate(['/admin/students']);
    }
    console.log(this.student);
  } else {
    this.router.navigate(['/admin/students']);
  }
}
}
  

// @Input() student = {
//     // photoUrl: '/assets/default-profile.jpg', // default image path
//     // name: 'Jane Doe',
//     // occupation: 'Computer',
//     // email: 'janedoe@gmail.com',
//     // phone: '+123 456 789',
//     // address: 'E104, Dharti-2, Chandlodia Ahmedabad',
//     // fullName: 'Johnathan Deo',
//     // mobile: '(123) 456 7890',
//     // emailId: 'johnathan@admin.com',
//     // location: 'London',
//     // description1: `Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, 
//     //               imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.`,
//     // description2: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
//     //               standard dummy text ever since the 1500s.`,
//     // description3: `It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently 
//     //               with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
//   };
