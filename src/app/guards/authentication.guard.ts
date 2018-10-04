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
      
    // this.navigationService.appLoading = true;
    // this.navigationService.appLoadingMessage = 'Checking your credentials...';
    // if (!localStorage.getItem('id') || !localStorage.getItem('token')) {
    //   this.navigationService.appLoading = false;
    //   localStorage.removeItem('id');
    //   localStorage.removeItem('token');
    //   window.location.href = '/signin?invalid=1';
    //   return false;
    // }
    // this._apiService.verifyToken(localStorage.getItem('id'), localStorage.token, 'signin').subscribe((signinResult: any) => {
    //   this.authenticationService.user.role = signinResult.data.token.data.data.role;
    //   this.navigationService.appLoading = false;
    //   this.authenticationService.isLoggedIn = true;
    // }, signinError => {
    //   this.navigationService.appLoading = false;
    //   localStorage.removeItem('id');
    //   localStorage.removeItem('token');
    //   window.location.href = '/signin?invalid=1';
    //   return false;
    // });
    return true;
  }
}
