import { Component, OnDestroy, OnInit } from '@angular/core';
//import { mockedCoursesList, mockedAuthorsList } from '@app/shared/mocks/mock';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesStoreService } from '@app/services/courses-store.service';
import { Course } from '@app/services/courses.service';
import { Author } from '@app/services/courses.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CoursesStateFacade } from '@app/store/courses/courses.facade';

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
  isSingleLoading$!: Observable<boolean>;
  
  constructor(private route: ActivatedRoute, private router: Router, private coursesStoreService: CoursesStoreService, private coursesStateFacade: CoursesStateFacade) {}

  ngOnInit() {
    this.isSingleLoading$ = this.coursesStateFacade.isSingleCourseLoading$;
    
    let courseId = this.route.snapshot.paramMap.get('id');

    this.getAllAuthors().subscribe(() => {
      if(courseId) {
        this.coursesStateFacade.getSingleCourse(courseId);

        this.coursesStateFacade.course$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((course: Course) => {
            this.course = course;
            this.getAuthorsFromIds();
          });
      }
    });
  }

  getAuthorsFromIds() {
    if(this.course && this.authors.length) {
      let authorNames = this.course.authors.map(authorId => {
        let author = this.authors.find(a => a.id === authorId);
        return author ? author.name : "Unknown author";
      });
      this.course = {
        ...this.course,
        authors: authorNames
      };
    }
  }

  getAllAuthors(): Observable<Author[]> {
    return this.coursesStoreService.getAllAuthors().pipe(
      tap({
          next: (authors: Author[]) => {
              this.authors = authors;
          },
          error: (error) => {
              alert("Failed to load authors.");
              console.error("Failed to load authors.", error);
          }
      })
  );
}

  goBack() {
    this.router.navigate(['./courses']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

/*
Methods from task 4:

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

Methods/data from previous tasks:

    title:string = "";
    description:string = "";
    id:string = "";
    creationDate:Date = new Date();
    duration:number = 0;
    authors:string[] = [];

    let course = mockedCoursesList.find(c => c.id === courseId);

    if (course) {
      this.title = course.title;
      this.description = course.description;
      this.id = course.id;
      this.creationDate = new Date(course.creationDate);
      this.duration = course.duration;
      this.authors = course.authors.map(authorID => {
        const author = mockedAuthorsList.find(author => author.id === authorID);
        return author ? author.name : "No author";
      });
    }


*/