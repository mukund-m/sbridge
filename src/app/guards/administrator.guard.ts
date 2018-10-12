import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {NavigationService} from "../services/navigation.service";
import {ApiService} from "../services/api.service";
import {AuthenticationService} from "../services/authentication.service";
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdministratorGuard implements CanActivate {
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
          if(users[0].role !== 'administrator') {
            this._router.navigate(['dashboard']);
            reject(false)
          }
          if(users[0].role == 'administrator') {
            resolve(true);
          }
        })
      })
     })
      
    // this._apiService.verifyToken(localStorage.getItem('id'), localStorage.token, 'signin').subscribe((tokenResult: any) => {
    //   this.navigationService.appLoading = false;
    //   this.authenticationService.isLoggedIn = true;
    //   if (tokenResult.data.token.data.data.role !== 'administrator') {
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
  }
}
