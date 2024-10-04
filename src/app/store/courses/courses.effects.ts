import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { CoursesService } from '@app/services/courses.service';
import * as CoursesActions from './courses.actions';
import { Router } from '@angular/router';
import { CoursesStateFacade } from './courses.facade';

@Injectable()
export class CoursesEffects {
    constructor(private actions$: Actions, private coursesService: CoursesService, private router: Router, private coursesStateFacade: CoursesStateFacade) {}

    // Add your code here
    getAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CoursesActions.requestAllCourses),
            mergeMap(() => this.coursesService.getAll().pipe(
                map(courses => CoursesActions.requestAllCoursesSuccess({ courses })),
                catchError(error => of(CoursesActions.requestAllCoursesFail({ error })))
            ),
            )
        )
    );

    filteredCourses$ = createEffect(() => 
        this.actions$.pipe(
            ofType(CoursesActions.requestFilteredCourses),
            mergeMap(({ title }) => 
                this.coursesStateFacade.allCourses$.pipe(
                    map(courses => {
                        let filteredCourses = courses.filter(course => 
                            course.title.toLowerCase().includes(title.toLowerCase())
                        );
                        return CoursesActions.requestFilteredCoursesSuccess({ courses: filteredCourses });
                    })
                )
            )
        )
    );

    getSpecificCourse$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CoursesActions.requestSingleCourse),
            mergeMap(action => this.coursesService.getCourse(action.id).pipe(
                map(course => CoursesActions.requestSingleCourseSuccess({ course })),
                catchError(error => of(CoursesActions.requestSingleCourseFail({ error })))
            )
            )
        )
    );

    deleteCourse$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CoursesActions.requestDeleteCourse),
            mergeMap(action => this.coursesService.deleteCourse(action.id).pipe(
                map(() => CoursesActions.requestDeleteCourseSuccess()),
                catchError(error => of(CoursesActions.requestDeleteCourseFail({ error })))
            )
            )
        )
    );

    editCourse$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CoursesActions.requestEditCourse),
            mergeMap(action => this.coursesService.editCourse(action.id, action.course).pipe(
                map(course => CoursesActions.requestEditCourseSuccess({ course })),
                catchError(error => of(CoursesActions.requestDeleteCourseFail({ error })))
            )
            )
        )
    );

    createCourse$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CoursesActions.requestCreateCourse),
            mergeMap(action => this.coursesService.createCourse(action.course).pipe(
                map(course => CoursesActions.requestCreateCourseSuccess({ course })),
                catchError(error => of(CoursesActions.requestCreateCourseFail({ error })))
            )
            )
        )
    );

    redirectToTheCoursesPage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                CoursesActions.requestCreateCourseSuccess,
                CoursesActions.requestEditCourseSuccess,
                CoursesActions.requestSingleCourseFail
            ),
            tap(() => this.router.navigate(["/courses"]))
        ),
        { dispatch: false }
    );
}
