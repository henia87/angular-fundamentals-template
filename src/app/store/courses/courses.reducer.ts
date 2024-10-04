import { Action, createReducer, on } from '@ngrx/store';

// Add your code here
import  * as courseActions  from './courses.actions';
import { Course } from '@app/services/courses.service';

export const coursesFeatureKey = 'courses';

export interface CoursesState {
    // Add your code here
    allCourses: Course[],
    course: Course,
    isAllCoursesLoading: boolean,
    isSingleCourseLoading: boolean,
    isSearchState: boolean,
    errorMessage: string | null
}

export const initialState: CoursesState = {
    // Add your code here
    allCourses: [],
    course: {
        title: "",
        description: "",
        duration: 0,
        creationDate: new Date(),
        authors: [],
        id: ""
    },
    isAllCoursesLoading: false,
    isSingleCourseLoading: false,
    isSearchState: false,
    errorMessage: null
};

export const coursesReducer = createReducer(
    initialState,
    on(courseActions.requestAllCourses, state => ({
    ...state,
    isAllCoursesLoading: true,
    errorMessage: ""
    })),
    on(courseActions.requestAllCoursesSuccess, (state, { courses }) => ({
        ...state,
        allCourses: courses,
        isAllCoursesLoading: false,
        errorMessage: null
    })),
    on(courseActions.requestAllCoursesFail, (state, { error }) => ({
        ...state,
        isAllCoursesLoading: false,
        errorMessage: error
    })),

    on(courseActions.requestSingleCourse, (state, { id }) => ({  // What to do with ID?
        ...state,
        isSingleCourseLoading: true,
        errorMessage: null,
        course: {...state.course, id}
    })),
    on(courseActions.requestSingleCourseSuccess, (state, { course }) => ({
        ...state,
        course,
        isSingleCourseLoading: false,
        errorMessage: null
    })),
    on(courseActions.requestSingleCourseFail, (state, { error }) => ({
        ...state,
        isSingleCourseLoading: false,
        errorMessage: error
    })),

    on(courseActions.requestFilteredCourses, (state, { title }) => ({  // What to do with title?
        ...state,
        isSearchState: true,
        errorMessage: null
    })),
    on(courseActions.requestFilteredCoursesSuccess, (state, { courses }) => ({
        ...state,
        allCourses: courses,
        isSearchState: false,
        errorMessage: null
    })),
    on(courseActions.requestFilteredCoursesFail, (state, { error }) => ({
        ...state,
        isSearchState: false,
        errorMessage: error
    })),

    on(courseActions.requestDeleteCourse, (state, { id }) => ({  // What to do with ID?
        ...state,
        isAllCoursesLoading: true,
        course: {...state.course, id},
        allCourses: state.allCourses.filter(course => course.id !== id),  // Do I need this here?
        errorMessage: null,
    })),
    on(courseActions.requestDeleteCourseSuccess, state => ({
        ...state,
        isAllCoursesLoading: false,
        errorMessage: null
    })),
    on(courseActions.requestDeleteCourseFail, (state, { error }) => ({
        ...state,
        isAllCoursesLoading: false,
        errorMessage: error
    })),

    on(courseActions.requestEditCourse, (state, { id, course }) => ({  // What to do with ID and Course here?
        ...state,
        isSingleCourseLoading: true,
        errorMessage: null
    })),
    on(courseActions.requestEditCourseSuccess, (state, { course }) => ({
        ...state,
        allCourses: state.allCourses.map(existingCourse => existingCourse.id === course.id ? course : existingCourse),
        isSingleCourseLoading: false,
        errorMessage: null
    })),
    on(courseActions.requestEditCourseFail, (state, { error }) => ({
        ...state,
        isSingleCourseLoading: false,
        errorMessage: error
    })),

    on(courseActions.requestCreateCourse, (state, { course }) => ({  // What to do with course here?
        ...state,
        isSingleCourseLoading: true,
        errorMessage: null
    })),
    on(courseActions.requestCreateCourseSuccess, (state, { course }) => ({
        ...state,
        allCourses: [...state.allCourses, course],
        isSingleCourseLoading: false,
        errorMessage: null
    })),
    on(courseActions.requestCreateCourseFail, (state, { error }) => ({
        ...state,
        isSingleCourseLoading: false,
        errorMessage: error
    }))
); // Add your code here

export const reducer = (state: CoursesState, action: Action): CoursesState => coursesReducer(state, action);
