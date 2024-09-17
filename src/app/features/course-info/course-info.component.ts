import { Component, Input } from '@angular/core';
import { mockedCoursesList, mockedAuthorsList } from '@app/shared/mocks/mock';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent {
  // Use the names for the input `course`.
  @Input() title:string = "";
  @Input() description:string = "";
  @Input() id:string = "";
  @Input() creationDate:Date = new Date();
  @Input() duration:number = 0;
  @Input() authors:string[] = [];

  goBack() {}

  courses: any[] = [];

  ngOnInit() {
    this.courses = mockedCoursesList.map(course => ({
      ...course,
      creationDate: new Date(course.creationDate),
      authors: course.authors.map(authorID => {
        let author = mockedAuthorsList.find(author => author.id === authorID);
        return author ? author.name : "No author";
      })
    }));
  }
}
