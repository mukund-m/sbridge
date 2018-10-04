import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable()
export class AuthenticationService {
  isLoggedIn: Boolean = false;
  user: User = new User({});

  constructor() { }

  getToken() {
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    }
    this.isLoggedIn = false;
    return null;
  }

  getId() {
    if (localStorage.getItem('id')) {
      return localStorage.getItem('id');
    }
    this.isLoggedIn = false;
    return null;
  }

}
