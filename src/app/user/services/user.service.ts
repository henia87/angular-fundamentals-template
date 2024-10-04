import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { SessionStorageService } from '@app/auth/services/session-storage.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {}
    
    getUser(): Observable<{ name: string; email: string; password: string }> {
        // Add your code here
        let token = this.sessionStorageService.getToken();
        let headers;

        if(token) {
            headers = new HttpHeaders({Authorization: `${token}`});
        }

        return this.http.get<{name: string, email: string, password: string}>("http://localhost:4000/users/me", { headers }).pipe(
            catchError((error) => {
                console.error("An error occurred.", error);
                return throwError(() => new Error(error));
            })
        );
    }
}