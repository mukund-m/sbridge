import { Injectable } from '@angular/core';
import { Client } from '../models/client';
import {ApiService} from "./api.service";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class ClientService {
  client: any;
  clients: Array<Client> = [];
  selectedClient: Client = new Client({});
  currentClient: Client = new Client({});

  constructor(
    private _apiService: ApiService,
    private _authenticationService: AuthenticationService
  ) {
    this.client = location.host.split('.')[0];
  }

  getClients(offset, limit, searchParam) {
    return this._apiService.getClients(offset, limit, searchParam, this._authenticationService.getToken());
  }

  getWhatsNew() {
    return this._apiService.getWhatsNew(this.currentClient._id, this._authenticationService.getToken());
  }

  getLeaders() {
    return this._apiService.getLeaders(this.currentClient._id, this._authenticationService.getToken());
  }

  verifyClient(client) {
    return this._apiService.verifyClient(client);
  }

  newClient(client) {
    return this._apiService.newClient(client, this._authenticationService.getToken());
  }

  updateClient(id, client) {
    return this._apiService.updateClient(id, client, this._authenticationService.getToken());
  }

  removeClient(client) {
    return this._apiService.removeClient(client, this._authenticationService.getToken());
  }

  getStatistics() {
    return this._apiService.getStatistics(this.currentClient._id, this._authenticationService.getToken());
  }

  newNewsMessage() {
    return this._apiService.newNewsMessage(this.currentClient.news, this.currentClient._id, this._authenticationService.getToken());
  }

}
