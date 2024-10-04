import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class CoursesService {
    private baseURL = "http://localhost:4000";
    
    constructor(private http: HttpClient) {}
    
    getAll(): Observable<Course[]> {
        // Add your code here
        return this.http.get<{successful: boolean, result: Course[]}>(`${this.baseURL}/courses/all`).pipe(
            map(response => response.result)
        );
    }

    createCourse(course: Omit<Course, "id" | "creationDate">): Observable<Course> { // replace 'any' with the required interface
        // Add your code here
        return this.http.post<{successful: boolean, result: Course}>(`${this.baseURL}/courses/add`, course).pipe(
            map(response => response.result)
        );
    }

    editCourse(id: string, course: Omit<Course, "id" | "creationDate">): Observable<Course> { // replace 'any' with the required interface
        // Add your code here
        return this.http.put<{ successful: boolean, result: Course }>(`${this.baseURL}/courses/${id}`, course).pipe(
            map(response => response.result)
        );   
    }

    getCourse(id: string): Observable<Course> {
        // Add your code here
        return this.http.get<{successful: boolean, result: Course}>(`${this.baseURL}/courses/${id}`).pipe(
            map(response => response.result)
        );
    }

    deleteCourse(id: string) {
        // Add your code here
        return this.http.delete(`${this.baseURL}/courses/${id}`);
    }

    filterCourses(value: string): Observable<Course[]> {
        let params = new HttpParams().set('searchTerm', value.trim());
        
        return this.http.get<{successful: boolean, result: Course[]}>(`${this.baseURL}/courses/all`, { params }).pipe(
            map(response => response.result)
        );
    }

    getAllAuthors(): Observable<Author[]> {
        // Add your code here
        return this.http.get<{successful: boolean, result: Author[]}>(`${this.baseURL}/authors/all`).pipe(
            map(response => response.result)
        );
    }

    createAuthor(name: string) {
        // Add your code here
        return this.http.post(`${this.baseURL}/authors/add`, { name });
    }

    getAuthorById(id: string): Observable<Author> {
        // Add your code here
        return this.http.get<{successful: boolean, result: Author}>(`${this.baseURL}/authors/${id}`).pipe(
            map(response => response.result)
        );
    }
}

export interface Course {
    title: string,
    description: string,
    creationDate: Date,
    duration: number,
    authors: string[],
    id: string
}

export interface Author {
    name: string,
    id: string
}