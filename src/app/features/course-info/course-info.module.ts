import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseInfoComponent } from './course-info.component';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  {path: 'courses/:id', component: CourseInfoComponent}
];

@NgModule({
  declarations: [
    CourseInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    CourseInfoComponent,
    RouterModule
  ]
})
export class CourseInfoModule { }
