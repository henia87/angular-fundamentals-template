import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SessionStorageService } from './session-storage.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private isAuthorized$$ = new BehaviorSubject<boolean>(false);
    public isAuthorized$: Observable<boolean> = this.isAuthorized$$.asObservable();
    private baseURL: string = "http://localhost:4000";

    constructor(private http: HttpClient, private sessionStorage: SessionStorageService) {}
    
    login(user: User): Observable<LoginRes> { // replace 'any' with the required interface
        // Add your code here
        return this.http.post<LoginRes>(`${this.baseURL}/login`, user).pipe(
            tap((response: LoginRes) => {
                if (response.successful) {
                    this.sessionStorage.setToken(response.result);
                    this.isAuthorized$$.next(true);
                }
            })
        );
    }

    logout(): void {
        // Add your code here
        this.sessionStorage.deleteToken();
        this.isAuthorized$$.next(false);
        /*
        const clearValues = () => {
            this.sessionStorage.deleteToken();
            this.isAuthorized = false;
            this.userStorageService.getUser().subscribe();
        }

        return this.http.delete(`${this.baseURL}/logout`).pipe(
            next: clearValues,
            error: clearValues
        )
        */
    }

    register(user: User): Observable<User> { // replace 'any' with the required interface
        // Add your code here
        return this.http.post<User>(`${this.baseURL}/register`, user);
    }

    get isAuthorised(): boolean {
        // Add your code here. Get isAuthorized$$ value
        return this.isAuthorized$$.getValue();
        //return this.sessionStorage.getToken() !== null;
    }

    set isAuthorised(value: boolean) {
        // Add your code here. Change isAuthorized$$ value
        this.isAuthorized$$.next(value);
    }

    getLoginUrl() {
        // Add your code here
        return `${this.baseURL}/login`;
    }
}

export interface LoginRes {
    successful: boolean;
    result: string;
    user: {
        email: string;
        name: string | null;
    }
}

export interface RegisterRes {
    successful: boolean;
    errors?: string[];
    result?: string;
}

export interface User {
    name?: string,
    email: string,
    password: string
}