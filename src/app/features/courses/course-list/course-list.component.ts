import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent {
  @Input() courses:any[] = [];
  @Input() editable = true;

  @Output() showCourse = new EventEmitter<any>();
  @Output() editCourse = new EventEmitter<any>();
  @Output() deleteCourse = new EventEmitter<any>();

  showCourseEvent(course: any) {
    this.showCourse.emit(course);
  }

  editCourseEvent(course: any) {
    this.editCourse.emit(course);
  }

  deleteCourseEvent(course: any) {
    this.deleteCourse.emit(course);
  }
}