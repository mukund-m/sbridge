import { Component, OnInit } from '@angular/core';

import { ThemeService } from '../../../services/theme.service';
import { UserService } from '../../../services/user.service';
import { AuthenticationService } from '../../../services/authentication.service';

import { BaseSubPage } from '../../../abstract-classes/base-sub-page';

import { User } from '../../../models/user';
import { ClientService } from "../../../services/client.service";
import { Client } from "../../../models/client";
import {NavigationService} from "../../../services/navigation.service";
import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';
import { FirebaseClientService } from '../../../firebase-services/firebase-client.service';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent extends BaseSubPage implements OnInit {
  loading: Boolean = true;
  failure: Boolean = false;
  resultMessage: String = '';
  loadingStatus: String = '';

  constructor(
    public _authenticationService: AuthenticationService,
    public themeService: ThemeService,
    public userService: UserService,
    public clientService: ClientService,
    public navigationService: NavigationService,
    private firebaseUserService: FirebaseUserService,
    private firebaseClientService: FirebaseClientService
  ) {
    super();
    navigationService.isDashboard = true;
  }

  ngOnInit() { 
    this.loading = true;
    this.loadingStatus = 'Loading Dashboard...';
    this.firebaseUserService.getCurrentUser().subscribe((users:User[]) => {
      this.loading = false;
      this._authenticationService.user = users[0];
      this.firebaseClientService.getCurrentClient(this._authenticationService.user.client_id).subscribe((data)=> {
        this.clientService.currentClient = data;
      })
    });
    
    // this.userService.getUser(this._authenticationService.getId()).subscribe((result: any) => {
    //   this.loading = false;

    //   this._authenticationService.user = new User(result.data);
    //   this.clientService.currentClient = new Client(result.data.client);
    // }, error => {
    //   this.loading = false;
    //   this.failure = true;
    //   this.resultMessage = error.error.message;
    // });
  }

  getId() {
    return this._authenticationService.user._id;
  }

  getRole() {
    return this._authenticationService.user.role;
  }
}
