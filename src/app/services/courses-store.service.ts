import { Injectable } from '@angular/core';
import { CoursesService } from './courses.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { Course } from './courses.service';
import { Author } from './courses.service';

@Injectable({
    providedIn: 'root'
})
export class CoursesStoreService {
    private isLoading$$ = new BehaviorSubject<boolean>(false);
    private courses$$ = new BehaviorSubject<Course[]>([]);
    public isLoading$ = this.isLoading$$.asObservable();
    public courses$ = this.courses$$.asObservable();

    private authors$$ = new BehaviorSubject<Author[]>([]);
    public authors$ = this.authors$$.asObservable();
    private currentCourse$$ = new BehaviorSubject<Course | null>(null);
    public currentCourse$ = this.currentCourse$$.asObservable();
    private currentAuthor$$ = new BehaviorSubject<Author | null>(null);
    public currentAuthor$ = this.currentAuthor$$.asObservable();

    constructor(private coursesService: CoursesService) {}

    getAll() {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.getAll().pipe(
            tap((courses) => {
                this.courses$$.next(courses);
            }),
            catchError((error) => {
                return throwError(() => new Error(`An error occurred: ${error}`));
            }),
            finalize(() => {
                this.isLoading$$.next(false);
            })
        );
    }

    createCourse(course: Omit<Course, "id" | "creationDate">) { // replace 'any' with the required interface
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.createCourse(course).pipe(
            tap((newCourse) => {
                this.courses$$.next([...this.courses$$.value, newCourse]);
            }),
            catchError((error) => {
                return throwError(() => new Error(`An error occurred: ${error}`));
            }),
            finalize(() => {
                this.isLoading$$.next(false);
            })
        );
    }

    getCourse(id: string) {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.getCourse(id).pipe(
            tap((course) => {
                this.currentCourse$$.next(course);
            }),
            catchError((error) => {
                return throwError(() => new Error(`An error occurred: ${error}`));
            }),
            finalize(() => {
                this.isLoading$$.next(false);
            })
          );
    }

    editCourse(id: string, course: Omit<Course, "id" | "creationDate">) { // replace 'any' with the required interface
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.editCourse(id, course).pipe(
            switchMap(() => {
                return this.getAll();
            }),
            catchError((error) => {
                return throwError(() => new Error(`An error occurred: ${error}`));
            }),
            finalize(() => {
                this.isLoading$$.next(false);
            })
        );
    }

    deleteCourse(id: string) {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.deleteCourse(id).pipe(
            switchMap(() => {
                return this.getAll();
            }),
            catchError((error) => {
                return throwError(() => new Error(`An error occurred: ${error}`));
            }),
            finalize(() => {
                this.isLoading$$.next(false);
            })
        );
    }

    filterCourses(value: string): Observable<Course[]> {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.filterCourses(value).pipe(
            tap((filteredCourses) => {
                this.courses$$.next(filteredCourses);
            }),
            catchError((error) => {
                return throwError(() => new Error(`An error occurred: ${error}`));
            }),
            finalize(() => {
                this.isLoading$$.next(false);
            })
        );
    }

    getAllAuthors() {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.getAllAuthors().pipe(
            tap((authors) => {
                this.authors$$.next(authors);
            }),
            catchError((error) => {
                return throwError(() => new Error(`An error occurred: ${error}`));
            }),
            finalize(() => {
                this.isLoading$$.next(false);
            })
        );
    }

    createAuthor(name: string) {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.createAuthor(name).pipe(
            tap(() => {
                this.getAllAuthors();
            }),
            catchError((error) => {
                return throwError(() => new Error(`An error occurred: ${error}`));
            }),
            finalize(() => {
                this.isLoading$$.next(false);
            })
        );
    }

    getAuthorById(id: string) {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.getAuthorById(id).pipe(
            tap((author) => {
                this.currentAuthor$$.next(author);
            }),
            catchError((error) => {
                return throwError(() => new Error(`An error occurred: ${error}`));
            }),
            finalize(() => {
                this.isLoading$$.next(false);
            })
        );
    }
}