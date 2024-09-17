import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses.component';
import { CourseListComponent } from './course-list/course-list.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    CoursesComponent,
    CourseListComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CoursesComponent,
    CourseListComponent
  ]
})
export class CoursesModule { }
