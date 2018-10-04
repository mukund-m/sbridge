import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../abstract-classes/base-page';
import { AuthenticationService } from "../../../services/authentication.service";
import { ThemeService } from "../../../services/theme.service";
import {NavigationService} from "../../../services/navigation.service";

@Component({
  selector: 'app-page-administration',
  templateUrl: './page-administration.component.html',
  styleUrls: ['./page-administration.component.scss']
})
export class PageAdministrationComponent extends BasePage implements OnInit {
  isComingSoon: Boolean = false;
  administrativeItems = [
    { title: 'Manage users', icon: 'user-icon', URI: '/dashboard/users', isActive: true, levelRequired: 'client' },
    { title: 'Manage clients', icon: 'client-icon', URI: '/dashboard/clients', isActive: true, levelRequired: 'administrator' },
    { title: 'Manage libraries', icon: 'library-icon', URI: '/dashboard/libraries', isActive: true, levelRequired: 'client' },
    { title: 'Analytics', icon: 'analytics-icon', URI: '/dashboard/analytics', isActive: true, levelRequired: 'client' },
    ];

  constructor(
    private _authenticationService: AuthenticationService,
    public themeService: ThemeService,
    public navigationService: NavigationService
  ) {
    super();
    navigationService.isDashboard = true;
  }

  ngOnInit() {
  }

  canView(administrativeItem) {
    let returnValue = false;
    switch (this._authenticationService.user.role) {
      case 'administrator':
        returnValue = true;
        break;
      case 'client':
        returnValue = administrativeItem.levelRequired === 'client';
        break;
    }
    return returnValue;
  }

  getRole() {
    return this._authenticationService.user.role;
  }

}
