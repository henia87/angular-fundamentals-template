import { Component, OnDestroy, OnInit } from '@angular/core';
//import { mockedCoursesList, mockedAuthorsList } from '@app/shared/mocks/mock';
import { Router } from '@angular/router';
import { CoursesStoreService } from '@app/services/courses-store.service';
import { Course } from '@app/services/courses.service';
import { Author } from '@app/services/courses.service';
import { UserStoreService } from '@app/user/services/user-store.service';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy { 
  private unsubscribe$ = new Subject<void>();
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  authors: Author[] = [];
  editable: boolean = false;
  isAdmin: boolean = true;
  searchSubject = new Subject<string>();

  constructor(private router: Router, private coursesStoreService: CoursesStoreService, private userStoreService: UserStoreService) {}

  ngOnInit(): void {
    this.getCourses();
    this.getAuthors();
    this.checkAdmin();

    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(searchTerm => {
        if(searchTerm) {
          return of(this.filterCourses(searchTerm));
        }
        else {
          this.filteredCourses = this.courses;
          return of(this.courses);
        }
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(filteredCourses => {
      this.filteredCourses = filteredCourses;
      this.getAuthorsFromIds();
    });
  }
  
  checkAdmin() {
    if(this.isAdmin) {
      this.editable = true;
    }
  }

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

  getAuthors() {
    this.coursesStoreService.getAllAuthors()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (authors: Author[]) => {
        this.authors = authors;
        this.getAuthorsFromIds();
      },
      error: (error) => {
        alert("Failed to load authors.");
        console.error("Failed to load authors.", error);
      }
    });
  }

  getAuthorsFromIds() {
    if(this.filteredCourses.length && this.authors.length) {
      this.filteredCourses = this.filteredCourses.map((course) => ({
        ...course,
        authors: course.authors.map(authorId => {
          let author = this.authors.find(a => a.id === authorId);
          return author ? author.name : "Unknown author";
        })
      }));
    }
  }

  filterCourses(value: string): Course[] {
    return this.courses.filter(course =>
      course.title.toLowerCase().includes(value.toLowerCase()) ||
      course.description.toLowerCase().includes(value.toLowerCase()) ||
      course.duration.toString() === value ||
      new Date(course.creationDate).toLocaleDateString() === new Date(value).toLocaleDateString()
    );
  }

  onSearch(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  showCourseEvent(courseId: string) {
    this.router.navigate([`/courses/${courseId}`]);
  }

  editCourseEvent(courseId: string) {
    this.router.navigate([`/courses/edit/${courseId}`]);
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

  addCourse() {
    this.router.navigate(["courses/add"]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
