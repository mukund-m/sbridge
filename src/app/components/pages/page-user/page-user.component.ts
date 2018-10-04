import { Component, OnInit } from '@angular/core';

import { ThemeService } from '../../../services/theme.service';
import { UserService } from '../../../services/user.service';
import { AuthenticationService } from '../../../services/authentication.service';

import { BaseSubPage } from '../../../abstract-classes/base-sub-page';

import { User } from '../../../models/user';
import { ClientService } from "../../../services/client.service";
import { Client } from "../../../models/client";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";
import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';

@Component({
  selector: 'app-page-user',
  templateUrl: './page-user.component.html',
  styleUrls: ['./page-user.component.scss']
})
export class PageUserComponent extends BaseSubPage implements OnInit {
  loading: Boolean = true;
  failure: Boolean = false;
  resultMessage: String = '';
  loadingStatus: String = '';

  constructor(
    private _authenticationService: AuthenticationService,
    private _activatedRoute: ActivatedRoute,
    public themeService: ThemeService,
    public userService: UserService,
    public clientService: ClientService,
    public navigationService: NavigationService,
    private firebaseUserService: FirebaseUserService
  ) {
    super();
  }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.loading = true;
        this.loadingStatus = 'Loading User...';

        this.firebaseUserService.getUser(params['id']).subscribe((user: User)=> {
          this.loading = false;
          this.userService.selectedUser = user;
        })
      } else {
        this.failure = true;
        this.resultMessage = 'A user ID is required';
      }
    });
  }
}


