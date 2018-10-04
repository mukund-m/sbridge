import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { NavigationService } from '../services/navigation.service';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(
    public navigationService: NavigationService,
    public authenticationService: AuthenticationService,
    private _apiService: ApiService,
    private _router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // this.navigationService.appLoading = true;
    // this.navigationService.appLoadingMessage = 'Verifying privileges...';
    // this._apiService.verifyToken(localStorage.getItem('id'), localStorage.token, 'signin').subscribe((tokenResult: any) => {
    //   this.navigationService.appLoading = false;
    //   this.authenticationService.isLoggedIn = true;
    //   if (tokenResult.data.token.data.data.role !== 'client' && tokenResult.data.token.data.data.role !== 'administrator') {
    //     this._router.navigate(['dashboard']);
    //     return false;
    //   }
    // }, tokenError => {
    //   this.navigationService.appLoading = false;
    //   localStorage.removeItem('id');
    //   localStorage.removeItem('token');
    //   window.location.href = '/signin?invalid=1';
    //   return false;
    // });
    return true;
  }
}
