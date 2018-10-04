import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {AuthenticationService} from "./authentication.service";
import {ClientService} from "./client.service";

@Injectable()
export class VideoService {

  constructor(
    private _apiService: ApiService,
    private _authenticationService: AuthenticationService,
    public clientService: ClientService
  ) { }

  newVideo(video) {
    return this._apiService.newVideo(video, this._authenticationService.getToken());
  }

  removeVideo(video, client) {
    return this._apiService.removeVideo(video, client, this._authenticationService.getToken());
  }
}
