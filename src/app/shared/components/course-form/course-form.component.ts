import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup,
  Validators, FormArray, FormControl
} from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoursesStoreService } from '@app/services/courses-store.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  // Use the names `title`, `description`, `author`, 'authors' (for authors list), `duration` for the form controls.
  courseId: string | null = null;
  submitted = false;
  trashIcon = faTrashCan;
  addAuthorIcon = faPlus;

  constructor(public fb: FormBuilder, public library: FaIconLibrary, private router: Router, private route: ActivatedRoute, private coursesStoreService: CoursesStoreService) {
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
    this.courseId = this.route.snapshot.paramMap.get("id");

    if(this.courseId) {
      this.coursesStoreService.getCourse(this.courseId).subscribe((courseData) => {
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
        this.coursesStoreService.editCourse(this.courseId, courseData).subscribe(() => {
          alert("Course edited.");
          this.router.navigate(["/courses"]);
        });
      }
      else {
        this.coursesStoreService.createCourse(courseData).subscribe(() => {
          alert("Course created.");
          this.router.navigate(["/courses"]);
        });
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
    this.router.navigate(['/courses'])
  }
}

export function latinLettersAndNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let latinLettersAndNumberRegex = /^[A-Za-z0-9]+$/;
    let valid = latinLettersAndNumberRegex.test(control.value);
    return valid ? null : { invalidChars: true };
  }
}