import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('auth_key')) {
            // logged in so return true
            return true;
        }        
        // not logged in so redirect to login page with the return url
        console.log('You must be logged in');
        this.router.navigate(['/admin']);
        return false;
    }
}