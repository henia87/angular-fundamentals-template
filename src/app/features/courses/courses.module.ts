import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses.component';
import { CourseListComponent } from './course-list/course-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CourseInfoComponent } from '../course-info/course-info.component';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
    children: [
      {
        path: '',
        component: CourseListComponent
      },
      {
        path: ':id',
        component: CourseInfoComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    CoursesComponent,
    CourseListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    CoursesComponent,
    CourseListComponent
  ]
})
export class CoursesModule { }