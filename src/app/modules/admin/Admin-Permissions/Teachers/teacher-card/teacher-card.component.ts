import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-teacher-card',
  standalone: false,
  templateUrl: './teacher-card.component.html',
  styleUrl: './teacher-card.component.scss'
})
export class TeacherCardComponent {
 @Input() teacher: any;
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() toggle = new EventEmitter<{ teacherId: any; action: string }>();
  @Output() delete = new EventEmitter<number>();
  
ngOnInit(){
  console.log(this.teacher);

}

  onView() {
    this.view.emit(this.teacher);
  }

  onEdit() {
    this.edit.emit(this.teacher);
  }

  onToggle(teacherId:any, action: string) {
    this.toggle.emit({ teacherId, action });
  }

  onDelete() {
    this.delete.emit(this.teacher.TeacherId);
  }
}
