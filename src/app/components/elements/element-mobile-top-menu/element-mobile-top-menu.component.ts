import { Component, OnInit } from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-element-mobile-top-menu',
  templateUrl: './element-mobile-top-menu.component.html',
  styleUrls: ['./element-mobile-top-menu.component.scss']
})
export class ElementMobileTopMenuComponent implements OnInit {
  isToggled: Boolean = false;

  constructor(
    public themeService: ThemeService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logOut()
    
  }

}
