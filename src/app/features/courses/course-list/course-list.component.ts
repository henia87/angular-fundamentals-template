import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent {
  trashIcon = faTrashCan;
  pencilIcon = faPencil;
  @Input() courses:any[] = [];
  @Input() editable = false;

  @Output() showCourse = new EventEmitter<any>();
  @Output() editCourse = new EventEmitter<any>();
  @Output() deleteCourse = new EventEmitter<any>();

  showCourseEvent(courseId: string) {
    this.showCourse.emit(courseId);
  }

  editCourseEvent(courseId: string) {
    this.editCourse.emit(courseId);
  }

  deleteCourseEvent(courseId: string) {
    this.deleteCourse.emit(courseId);
  }
}