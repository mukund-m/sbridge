import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';
import { ApiService } from './api.service';
import { ClientService } from './client.service';
import { AuthService } from './auth.service';
import { FirebaseUserService } from '../firebase-services/firebase-user.service';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  selectedUser: User =  new User({});

  constructor(
    private _authenicationService: AuthenticationService,
    private _APIService: ApiService,
    public clientService: ClientService,
    private userService: FirebaseUserService
  ) { }

  getUser(user) {
    return this._APIService.getUser(this.clientService.client, user, this._authenicationService.getToken());
  
  }

  getuser() {
    
  }

  getUserHistory(user) {
    return this._APIService.getUserHistory(this.clientService.client, user, this._authenicationService.getToken());
  }

  getUsers(page, limit, searchParam, client, filter) {
    return this._APIService.getUsers(page, limit, searchParam, client, filter, this._authenicationService.getToken());
  }

  inviteUser(body) {
    return this._APIService.inviteUser(body, this._authenicationService.getToken());
  }

  removeUser(user) {
    return this._APIService.removeUser(user, this.clientService.client, this._authenicationService.getToken());
  }

  getUsersModules(page, limit, searchParam, client, filter) {
    return this._APIService.getUsersModules(page, limit, searchParam, client, filter, this._authenicationService.getToken());
  }

}
