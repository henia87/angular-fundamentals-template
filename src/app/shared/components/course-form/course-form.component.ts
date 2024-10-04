import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup,
  Validators, FormArray, FormControl
} from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoursesStoreService } from '@app/services/courses-store.service';
import { Author } from '@app/services/courses.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CoursesStateFacade } from '@app/store/courses/courses.facade';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit, OnDestroy {
  courseForm!: FormGroup;
  // Use the names `title`, `description`, `author`, 'authors' (for authors list), `duration` for the form controls.
  courseId: string | null = null;
  submitted = false;
  trashIcon = faTrashCan;
  addAuthorIcon = faPlus;
  private unsubscribe$ = new Subject<void>();
  isSingleLoading$!: Observable<boolean>;
  authorList: Author[] = [];

  constructor(public fb: FormBuilder, public library: FaIconLibrary, private router: Router, private route: ActivatedRoute, private coursesStoreService: CoursesStoreService, private coursesStateFacade: CoursesStateFacade) {
    library.addIconPacks(fas);
    this.buildForm();
  }

  buildForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      author: ['', [Validators.minLength(2), latinLettersAndNumber()]],
      authors: this.fb.array([]),
      courseAuthors: this.fb.array([]),
      duration: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.isSingleLoading$ = this.coursesStateFacade.isSingleCourseLoading$;
    
    this.courseId = this.route.snapshot.paramMap.get("id");

    this.getAllAuthors().subscribe(() => {
      if(this.courseId) {
        this.coursesStateFacade.getSingleCourse(this.courseId);
  
        this.coursesStateFacade.course$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((courseData) => {
              this.courseForm.patchValue({
                title: courseData.title,
                description: courseData.description,
                duration: courseData.duration
              });
              this.mapAuthors(courseData.authors);
          });
      }
    });

    this.coursesStateFacade.errorMessage$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(errorMessage => {
        if(errorMessage) {
            alert(`An error occurred: ${errorMessage}`);
        }
    });
  }

  mapAuthors(authorIds: string[]): void {
    this.authors.clear();
    
    authorIds.forEach((authorId) => {
      let author = this.authorList.find((a) => a.id === authorId);
      this.authors.push(this.fb.control(author ? author.name : "Unknown author"));
    });
  }

  getAllAuthors(): Observable<Author[]> {
      return this.coursesStoreService.getAllAuthors().pipe(
        tap({
            next: (authors: Author[]) => {
                this.authorList = authors;
            },
            error: (error) => {
                alert("Failed to load authors.");
                console.error("Failed to load authors.", error);
            }
        })
    );
  }

  get title() {
    return this.courseForm.get("title")!;
  }

  get description() {
    return this.courseForm.get("description")!;
  }

  get author() {
    return this.courseForm.get("author")!;
  }

  get authors() {
    return this.courseForm.get("authors") as FormArray;
  }

  get courseAuthors() {
    return this.courseForm.get("courseAuthors") as FormArray;
  }

  get duration() {
    return this.courseForm.get("duration")!;
  }

  onSubmit() {
    this.submitted = true;
    
    if(this.courseForm.valid) {
      let courseData = this.courseForm.value;     
      if(this.courseId) {
        this.coursesStateFacade.editCourse(courseData, this.courseId);
        alert("Course edited.");
      }
      else {
        this.coursesStateFacade.createCourse(courseData);
        alert("Course created.");
      }
    }
  }

  createAuthor() {
    if(this.author.valid) {
      let newAuthor = this.fb.control(this.author.value);
      this.authors.push(newAuthor);
      this.author.reset();
    }
  }

  addAuthor(index: number) {
    let authorToMove = this.authors.at(index);
    this.courseAuthors.push(authorToMove);
    this.authors.removeAt(index);
  }

  removeAuthor(index: number) {
    let authorToRemove = this.courseAuthors.at(index);
    this.authors.push(authorToRemove);
    this.courseAuthors.removeAt(index);
  }

  deleteAuthor(index: number) {
    this.authors.removeAt(index);
  }

  goBack() {
    this.router.navigate(['/courses']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

export function latinLettersAndNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let latinLettersAndNumberRegex = /^[A-Za-z0-9]+$/;
    let valid = latinLettersAndNumberRegex.test(control.value);
    return valid ? null : { invalidChars: true };
  }
}

/*
Methods from task 4:
  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get("id");
        if(this.courseId) {
      this.coursesStoreService.getCourse(this.courseId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((courseData) => {
        this.courseForm.patchValue({
          title: courseData.title,
          description: courseData.description,
          duration: courseData.duration
        });
        courseData.authors.forEach((author: string) => {
          this.authors.push(this.fb.control(author));
        });
      });
    }
  }

    onSubmit() {
      this.submitted = true;
    if(this.courseForm.valid) {
      let courseData = this.courseForm.value;
      if(this.courseId) {
        this.coursesStoreService.editCourse(this.courseId, courseData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          alert("Course edited.");
          this.router.navigate(["/courses"]);
        });
      }
      else {
        this.coursesStoreService.createCourse(courseData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          alert("Course created.");
          this.router.navigate(["/courses"]);
        });
      }
    }
    }
*/