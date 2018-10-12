import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NavigationService } from '../services/navigation.service';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    public navigationService: NavigationService,
    public authenticationService: AuthenticationService,
    private _apiService: ApiService,
    private authService: AuthService
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.navigationService.appLoading = true;
      this.navigationService.appLoadingMessage = 'Checking your credentials...';
      return new Promise((resolve, reject)=>{
        this.authService.isLoggedIn().then((user)=>{
          if(user) {
            this.navigationService.appLoading = false;
            resolve(true);
          } else {
            this.navigationService.appLoading = false;
            window.location.href = '/signin?invalid=1';
            reject();
          }
        })
      })
     
  }
}
