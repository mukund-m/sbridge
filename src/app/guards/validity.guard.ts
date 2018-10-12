import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {ClientService} from '../services/client.service';
import {NavigationService} from '../services/navigation.service';
import { Client } from '../models/client';
import {ApiResponse} from '../interfaces/api-response';
import * as psl from '../../assets/javascripts/psl.min.js';
import {ThemeService} from "../services/theme.service";

@Injectable()
export class ValidityGuard implements CanActivate {
  constructor(
    private _clientService: ClientService,
    private _navigationService: NavigationService,
    private _themeService: ThemeService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return true;
  }
}
