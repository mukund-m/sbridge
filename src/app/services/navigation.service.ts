import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {ApiService} from "./api.service";

@Injectable()
export class NavigationService {
  appLoading: Boolean = false;
  appLoadingMessage: String = 'Loading...';
  isNavigationMenuToggled: Boolean = false;
  isDashboard: Boolean = false;

  constructor(
    private _authenticationService: AuthenticationService,
    private _apiService: ApiService
  ) { }

  getClient() {

  }

  newView(parent, module, type) {
    return this._apiService.newView(parent, module, type, this._authenticationService.getToken());
  }

}
