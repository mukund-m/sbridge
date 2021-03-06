import { Component, OnInit } from '@angular/core';
import { ThemeService } from "../../../services/theme.service";
import {ClientService} from "../../../services/client.service";
import {AuthenticationService} from "../../../services/authentication.service";

import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-element-side-menu',
  templateUrl: './element-side-menu.component.html',
  styleUrls: ['./element-side-menu.component.scss']
})

export class ElementSideMenuComponent implements OnInit {

  user: User;

  constructor(
    public themeService: ThemeService,
    public clientService: ClientService,
    public authenticationService: AuthenticationService,
    private firebaserUserServie: FirebaseUserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.firebaserUserServie.getCurrentUser().subscribe((users)=> {
      this.user = users[0];
    })
  }

  logout() {
    this.authService.logOut();
  }

}
