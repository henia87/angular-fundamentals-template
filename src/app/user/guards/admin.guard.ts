import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { UserStoreService } from '../services/user-store.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    // Add your code here

    constructor(private router: Router, private userStoreService: UserStoreService) {}

    canActivate(): boolean | UrlTree {
        return this.userStoreService.isAdmin ? true : this.router.parseUrl("/courses");
    }
}
