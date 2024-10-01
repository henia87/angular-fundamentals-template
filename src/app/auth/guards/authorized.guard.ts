import { Injectable } from '@angular/core';
import { CanLoad, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthorizedGuard implements CanLoad {
    // Add your code here

    constructor(private authService: AuthService, private router: Router) {}

    canLoad(): boolean | UrlTree {
        return this.authService.isAuthorised ? true : this.router.parseUrl("/login");
    }
}