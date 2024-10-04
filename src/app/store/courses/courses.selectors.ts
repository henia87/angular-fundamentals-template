// Add your code here
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CoursesState } from "./courses.reducer"

export const featureCoursesState = createFeatureSelector<CoursesState>("courses");

export const isAllCoursesLoadingSelector = createSelector(
    featureCoursesState,
    (state: CoursesState) => state.isAllCoursesLoading
);

export const isSearchingStateSelector = createSelector(
    featureCoursesState,
    (state: CoursesState) => state.isSearchState
);

export const isSingleCourseLoadingSelector = createSelector(
    featureCoursesState,
    (state: CoursesState) => state.isSingleCourseLoading
);

export const getCourses = createSelector(  // Is this supposed to be filtering?
    featureCoursesState,
    (state: CoursesState) => state.allCourses
);

export const getAllCourses = createSelector(
    featureCoursesState,
    (state: CoursesState) => state.allCourses
);

export const getCourse = createSelector(
    featureCoursesState,
    (state: CoursesState) => state.course
);

export const getErrorMessage = createSelector(
    featureCoursesState,
    (state: CoursesState) => state.errorMessage
);