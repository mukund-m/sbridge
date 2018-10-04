import { Injectable } from '@angular/core';

import { AuthenticationService } from './authentication.service';
import { ApiService } from './api.service';
import { ClientService } from './client.service';

@Injectable()
export class ModuleService {

  constructor(
    private _authenticationService: AuthenticationService,
    private _apiService: ApiService,
    public clientService: ClientService
  ) { }

  getClientModules(page, limit, client) {
    return this._apiService.getClientModules(page, limit, client, this._authenticationService.getToken());
  }

  searchLibraries(page, searchParam) {
    return this._apiService.searchLibraries(page, this.clientService.client, searchParam, this._authenticationService.getToken());
  }

  newModule(body) {
    return this._apiService.newModule(body, this._authenticationService.getToken());
  }

  removeModule(module) {
    return this._apiService.removeModule(module, this.clientService.client, this._authenticationService.getToken());
  }

  getModulesStatistics(page, limit, client) {
    return this._apiService.getModulesStatistics(page, limit, client, this._authenticationService.getToken());
  }
}
