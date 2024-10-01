import { Component, OnInit } from '@angular/core';
//import { mockedCoursesList, mockedAuthorsList } from '@app/shared/mocks/mock';
import { Router } from '@angular/router';
import { CoursesStoreService } from '@app/services/courses-store.service';
import { Course } from '@app/services/courses.service';
import { Author } from '@app/services/courses.service';
import { UserStoreService } from '@app/user/services/user-store.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit { 
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  authors: Author[] = [];
  editable: boolean = false;
  isAdmin: boolean = true;

  constructor(private router: Router, private coursesStoreService: CoursesStoreService, private userStoreService: UserStoreService) {}

  ngOnInit(): void {
    this.getCourses();
    this.getAuthors();
    this.checkAdmin();
  }
  
  checkAdmin() {
    if(this.isAdmin) {
      this.editable = true;
    }
  }

  getCourses() {
    this.coursesStoreService.getAll().subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
        this.filteredCourses = courses;
        this.getAuthorsFromIds();
      },
      error: (error) => {
        console.error("Failed to load courses.", error);
      }
    });
  }

  getAuthors() {
    this.coursesStoreService.getAllAuthors().subscribe({
      next: (authors: Author[]) => {
        this.authors = authors;
        this.getAuthorsFromIds();
      },
      error: (error) => {
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

  // checkAdminStatus() {
  //   this.userStoreService.getUser().subscribe({
  //     next: () => {
  //       this.userStoreService.isAdmin$.subscribe(isAdmin => {
  //         this.isAdmin = isAdmin;
  //       });
  //     },
  //     error: (error) => {
  //       console.error("An error occurred.", error);
  //     }
  //   });
  // }

  onSearch(searchTerm: string) {
    if(searchTerm) {
      this.coursesStoreService.filterCourses(searchTerm).subscribe({
        next: (filteredCourses) => {
          this.filteredCourses = filteredCourses;
          this.getAuthorsFromIds();
        },
        error: (error) => {
          console.error("An error occurred.", error);
        }
      });
    }
    else {
      this.filteredCourses = this.courses;
      this.getAuthorsFromIds();
    }
  }

  showCourseEvent(courseId: string) {
    this.router.navigate([`/courses/${courseId}`]);
  }

  editCourseEvent(courseId: string) {
    this.router.navigate([`/courses/edit/${courseId}`]);
  }

  deleteCourseEvent(courseId: string) {
    this.coursesStoreService.deleteCourse(courseId).subscribe({
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
}
