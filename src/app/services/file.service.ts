import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {AuthenticationService} from "./authentication.service";
import {ClientService} from "./client.service";

@Injectable()
export class FileService {

  constructor(
    private _apiService: ApiService,
    private _authenticationService: AuthenticationService,
    public clientService: ClientService
  ) { }

  newFile(file) {
    return this._apiService.newFile(file, this._authenticationService.getToken());
  }

  removeFile(file, client) {
    return this._apiService.removeFile(file, client, this._authenticationService.getToken());
  }

}
