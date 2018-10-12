import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { NavigationService } from '../services/navigation.service';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(
    public navigationService: NavigationService,
    public authenticationService: AuthenticationService,
    private _apiService: ApiService,
    private _router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
     this.navigationService.appLoading = true;
     this.navigationService.appLoadingMessage = 'Verifying privileges...';
     return new Promise((resolve, reject)=>{
      this.authService.isLoggedIn().then(()=>{
        this.authService.getCurrentUser().subscribe((users)=>{
          this.navigationService.appLoading = false;
          this.authenticationService.isLoggedIn = true;
          if(users[0].role !== 'administrator' && users[0].role !=='client') {
            this._router.navigate(['dashboard']);
            reject(false)
          }
          if(users[0].role == 'administrator' || users[0].role =='client') {
            resolve(true);
          }
        })
      })
     })
  }
}
