import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserStoreService {
    private name$$ = new BehaviorSubject<string>("");
    private isAdmin$$ = new BehaviorSubject<boolean>(false);
    public name$ = this.name$$.asObservable();
    public isAdmin$ = this.isAdmin$$.asObservable();

    constructor(private userService: UserService) {}

    getUser(): Observable<void> {
        // Add your code here
        return this.userService.getUser().pipe(
            tap(user => {
                if(user) {
                    this.name$$.next(user.name);
                    this.isAdmin$$.next(user.email === "admin@example.com" && user.password === "admin123");
                }
            }),
            map(() => void 0)
        );
    }

    get isAdmin() {
        // Add your code here. Get isAdmin$$ value
        return this.isAdmin$$.getValue();
    }

    set isAdmin(value: boolean) {
        // Add your code here. Change isAdmin$$ value
        this.isAdmin$$.next(value);
    }
}