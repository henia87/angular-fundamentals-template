import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionStorageService } from '../services/session-storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    // Add your code here
    
    constructor(private router: Router, private authService: AuthService, private sessionStorageService: SessionStorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.sessionStorageService.getToken();
        let clonedReq = req;

        if(token) {
            clonedReq = req.clone({
                setHeaders: { Authorization: `${token}` }
            });
        }
        
        return next.handle(clonedReq).pipe(
            catchError(err => {
                if(err.status === 401) {
                    this.authService.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(() => err);
            })
        );
    }
}