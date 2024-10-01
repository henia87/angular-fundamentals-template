import { Injectable } from '@angular/core';
import { CoursesService } from './courses.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
                this.isLoading$$.next(false);
            }),
            catchError((error) => {
                console.error("An error occurred.", error);
                this.isLoading$$.next(false);
                return throwError(() => new Error(error));
            })
        );
    }

    createCourse(course: Omit<Course, "id" | "creationDate">) { // replace 'any' with the required interface
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.createCourse(course).pipe(
            tap(() => {
                this.getAll();
                this.isLoading$$.next(false);
            }),
            catchError((error) => {
                console.error("An error occurred.", error);
                this.isLoading$$.next(false);
                return throwError(() => new Error(error));
            })
        );
    }

    getCourse(id: string) {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.getCourse(id).pipe(
            tap((course) => {
                this.currentCourse$$.next(course);
                this.isLoading$$.next(false);
            }),
            catchError((error) => {
                console.error("An error occurred.", error);
                this.isLoading$$.next(false);
                return throwError(() => new Error(error));
            })
          );
    }

    editCourse(id: string, course: Omit<Course, "id" | "creationDate">) { // replace 'any' with the required interface
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.editCourse(id, course).pipe(
            tap(() => {
                this.getAll();
                this.isLoading$$.next(false);
            }),
            catchError((error) => {
                console.error("An error occurred.", error);
                this.isLoading$$.next(false);
                return throwError(() => new Error(error));
            })
        );
    }

    deleteCourse(id: string) {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.deleteCourse(id).pipe(
            tap(() => {
                this.getAll();
                this.isLoading$$.next(false);
            }),
            catchError((error) => {
                console.error("An error occurred.", error);
                this.isLoading$$.next(false);
                return throwError(() => new Error(error));
            })
        );
    }

    filterCourses(value: string) {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.filterCourses(value).pipe(
            tap((filteredCourses) => {
                this.courses$$.next(filteredCourses);
                this.isLoading$$.next(false);
            }),
            catchError((error) => {
                console.error("An error occurred.", error);
                this.isLoading$$.next(false);
                return throwError(() => new Error(error));
            })
        );
    }

    getAllAuthors() {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.getAllAuthors().pipe(
            tap((authors) => {
                this.authors$$.next(authors);
                this.isLoading$$.next(false);
            }),
            catchError((error) => {
                console.error("An error occurred.", error);
                this.isLoading$$.next(false);
                return throwError(() => new Error(error));
            })
        );
    }

    createAuthor(name: string) {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.createAuthor(name).pipe(
            tap(() => {
                this.getAllAuthors();
                this.isLoading$$.next(false);
            }),
            catchError((error) => {
                console.error("An error occurred.", error);
                this.isLoading$$.next(false);
                return throwError(() => new Error(error));
            })
        );
    }

    getAuthorById(id: string) {
        // Add your code here
        this.isLoading$$.next(true);
        return this.coursesService.getAuthorById(id).pipe(
            tap((author) => {
                this.currentAuthor$$.next(author);
                this.isLoading$$.next(false);
            }),
            catchError((error) => {
                console.error("An error occurred.", error);
                this.isLoading$$.next(false);
                return throwError(() => new Error(error));
            })
        );
    }

    searchCourse(query: string) {
        this.isLoading$$.next(true);
        return this.coursesService.getAll().pipe(
            tap((courses) => {
                let searchedCourses = courses.filter(course =>
                    course.title.includes(query) ||
                    course.description.includes(query) ||
                    course.duration.toString() === query ||
                    course.creationDate.toString() === query
                );
                this.courses$$.next(searchedCourses);
                this.isLoading$$.next(false);
            }),
            catchError((error) => {
                console.error("An error occurred.", error);
                this.isLoading$$.next(false);
                return throwError(() => new Error(error));
            })
        );
    }
}