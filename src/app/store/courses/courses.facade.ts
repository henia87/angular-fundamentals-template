import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as CoursesActions from './courses.actions';
import * as CoursesSelectors from './courses.selectors';
import { Course } from '@app/services/courses.service';

@Injectable({
    providedIn: 'root'
})

export class CoursesStateFacade {
    // Add your code here
    public isAllCoursesLoading$ = this.store.pipe(select(CoursesSelectors.isAllCoursesLoadingSelector));
    public isSingleCourseLoading$ = this.store.pipe(select(CoursesSelectors.isSingleCourseLoadingSelector));
    public isSearchingState$ = this.store.pipe(select(CoursesSelectors.isSearchingStateSelector));
    public courses$ = this.store.pipe(select(CoursesSelectors.getCourses));
    public allCourses$ = this.store.pipe(select(CoursesSelectors.getAllCourses));
    public course$ = this.store.pipe(select(CoursesSelectors.getCourse));
    public errorMessage$ = this.store.pipe(select(CoursesSelectors.getErrorMessage));

    constructor(private store: Store) {}

    getAllCourses() {
        this.store.dispatch(CoursesActions.requestAllCourses());
    }

    getSingleCourse(id: string) {
        this.store.dispatch(CoursesActions.requestSingleCourse({ id }));
    }

    getFilteredCourses(searchValue: string) {
        this.store.dispatch(CoursesActions.requestFilteredCourses({ title: searchValue }));
    }

    editCourse(body: Omit<Course, "id" | "creationDate">, id: string) {
        this.store.dispatch(CoursesActions.requestEditCourse({ course: body, id }));
    }

    createCourse(body: Omit<Course, "id" | "creationDate">) {
        this.store.dispatch(CoursesActions.requestCreateCourse({ course: body }));
    }

    deleteCourse(id: string) {
        this.store.dispatch(CoursesActions.requestDeleteCourse({ id }));
    }
}
