import { Component, OnDestroy, OnInit } from '@angular/core';
//import { mockedCoursesList, mockedAuthorsList } from '@app/shared/mocks/mock';
import { Router } from '@angular/router';
import { CoursesStoreService } from '@app/services/courses-store.service';
import { Course } from '@app/services/courses.service';
import { Author } from '@app/services/courses.service';
import { UserStoreService } from '@app/user/services/user-store.service';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { CoursesStateFacade } from '@app/store/courses/courses.facade';
import { getErrorMessage } from '@app/store/courses/courses.selectors';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy { 
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  authors: Author[] = [];
  editable: boolean = false;
  isAdmin: boolean = true;
  private unsubscribe$ = new Subject<void>();
  isAllLoading$!: Observable<boolean>;

  lastSearchTerm: string | null = null;

  constructor(private router: Router, private coursesStoreService: CoursesStoreService, private userStoreService: UserStoreService, private coursesStateFacade: CoursesStateFacade) {}

  ngOnInit(): void {
    this.getAuthors();
    this.coursesStateFacade.getAllCourses();
    this.isAllLoading$ = this.coursesStateFacade.isAllCoursesLoading$;
    this.getCourses();
    this.checkAdmin();

    this.coursesStateFacade.errorMessage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(errorMessage => {
          if(errorMessage) {
            alert(`An error occurred: ${errorMessage}`);
          }
      });
  }

  getCourses() {
    this.coursesStateFacade.allCourses$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
          next: (courses: Course[]) => {
            this.courses = this.getAuthorsFromIds(courses);  
          },
          error: (error) => {
              alert(`Failed to load courses due to an error: ${error}`);
              console.error("Failed to load courses.", error);
          }
      });
  }

  getFilteredCourses(searchTerm: string) {
    this.coursesStateFacade.getFilteredCourses(searchTerm);

    this.coursesStateFacade.courses$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (courses: Course[]) => {
        this.filteredCourses = this.getAuthorsFromIds(courses);
      },
      error: (error) => {
        alert("Search failed.");
        console.error("Search failed.", error);
      }  
    });
  }

  onSearch(searchTerm: string) {
    if (this.lastSearchTerm !== searchTerm) {
      of(searchTerm).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
     ).subscribe(debouncedSearchTerm => {
        this.getFilteredCourses(debouncedSearchTerm);
        this.lastSearchTerm = debouncedSearchTerm;
      });  
    }
}

  checkAdmin() {
    if(this.isAdmin) {
      this.editable = true;
    }
  }

  getAuthors() {
    this.coursesStoreService.getAllAuthors()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (authors: Author[]) => {
        this.authors = authors;
        this.courses = this.getAuthorsFromIds(this.courses);
        this.filteredCourses = this.getAuthorsFromIds(this.filteredCourses);
      },
      error: (error) => {
        alert("Failed to load authors.");
        console.error("Failed to load authors.", error);
      }
    });
  }

  getAuthorsFromIds(courses: Course[]): Course[] {
    return courses.map((course) => ({
      ...course,
      authors: course.authors.map(authorId => {
          let author = this.authors.find(a => a.id === authorId);
          return author ? author.name : "Unknown author";
      })
    }));
  }

  showCourseEvent(courseId: string) {
    this.router.navigate([`/courses/${courseId}`]);
  }

  editCourseEvent(courseId: string) {
    this.router.navigate([`/courses/edit/${courseId}`]);
  }

  deleteCourseEvent(courseId: string) {
    this.coursesStateFacade.deleteCourse(courseId);
  }

  addCourse() {
    this.router.navigate(["courses/add"]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

/*
Task 4 methods:

  getCourses() {
    this.coursesStoreService.getAll()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
        this.filteredCourses = courses;
        this.getAuthorsFromIds();
      },
      error: (error) => {
        alert("Failed to load courses.");
        console.error("Failed to load courses.", error);
      }
    });
  }

  filterCourses(value: string): Course[] {
    return this.courses.filter(course =>
      course.title.toLowerCase().includes(value.toLowerCase()) ||
      course.description.toLowerCase().includes(value.toLowerCase()) ||
      course.duration.toString() === value ||
      new Date(course.creationDate).toLocaleDateString() === new Date(value).toLocaleDateString()
    );
  }

    deleteCourseEvent(courseId: string) {
    this.coursesStoreService.deleteCourse(courseId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: () => {
        this.getCourses();
        alert(`Course with ${courseId} deleted successfully.`);
      },
      error: (error) => {
        alert(`Failed to delete course.`);
      }
    });
  }

*/