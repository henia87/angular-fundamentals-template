import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NotAuthorizedGuard implements CanActivate {
    // Add your code here

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean | UrlTree {
        return !this.authService.isAuthorised ? true : this.router.parseUrl("/courses");
    }
}