import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {AuthenticationService} from "./authentication.service";
import {ClientService} from "./client.service";

@Injectable()
export class UrlService {

  constructor(
    private _apiService: ApiService,
    private _authenticationService: AuthenticationService,
    public clientService: ClientService
  ) { }

  newUrl(url) {
    return this._apiService.newUrl(url, this._authenticationService.getToken());
  }

  removeUrl(url, client) {
    return this._apiService.removeUrl(url, client, this._authenticationService.getToken());
  }

}
