import { Component, OnDestroy, OnInit } from '@angular/core';
//import { mockedCoursesList, mockedAuthorsList } from '@app/shared/mocks/mock';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesStoreService } from '@app/services/courses-store.service';
import { Course } from '@app/services/courses.service';
import { Author } from '@app/services/courses.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit, OnDestroy {
  // Use the names for the input `course`.
  course: Course = {
    title: "",
    description: "",
    id: "",
    creationDate: new Date(),
    duration: 0,
    authors: []
  };
  authors: Author[] = [];
  private unsubscribe$ = new Subject<void>();
  
  // title:string = "";
  // description:string = "";
  // id:string = "";
  // creationDate:Date = new Date();
  // duration:number = 0;
  // authors:string[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private coursesStoreService: CoursesStoreService) {}

  ngOnInit() {
    let courseId = this.route.snapshot.paramMap.get('id');

    if(courseId) {
      this.coursesStoreService.getCourse(courseId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (course: Course) => {
          this.course = course;
          this.getAuthorsFromIds();
        },
        error: (error) => {
          console.error("Failed to load course.", error);
        }
      });

      this.coursesStoreService.getAllAuthors()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (authors: Author[]) => {
          this.authors = authors;
          this.getAuthorsFromIds();
        },
        error: (error) => {
          console.error("Failed to load authors.", error);
        }
      });
    }

    // let course = mockedCoursesList.find(c => c.id === courseId);

    // if (course) {
    //   this.title = course.title;
    //   this.description = course.description;
    //   this.id = course.id;
    //   this.creationDate = new Date(course.creationDate);
    //   this.duration = course.duration;
    //   this.authors = course.authors.map(authorID => {
    //     const author = mockedAuthorsList.find(author => author.id === authorID);
    //     return author ? author.name : "No author";
    //   });
    // }
  }

  getAuthorsFromIds() {
    if(this.course && this.authors.length) {
      this.course.authors = this.course.authors.map(authorId => {
          let author = this.authors.find(a => a.id === authorId);
          return author ? author.name : "Unknown author";
        });
      }
  }

  goBack() {
    this.router.navigate(['./courses']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}