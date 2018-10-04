import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {AuthenticationService} from "./authentication.service";
import {ClientService} from "./client.service";

@Injectable()
export class TutorialService {

  constructor(
    private _apiService: ApiService,
    private _authenticationService: AuthenticationService,
    public clientService: ClientService
  ) { }

  newTutorial(tutorial) {
    return this._apiService.newTutorial(tutorial, this._authenticationService.getToken());
  }

  editTutorial(id, body) {
    return this._apiService.editTutorial(id, body, this._authenticationService.getToken());
  }

  removeTutorial(tutorial, client) {
    return this._apiService.removeTutorial(tutorial, client, this._authenticationService.getToken());
  }

}
