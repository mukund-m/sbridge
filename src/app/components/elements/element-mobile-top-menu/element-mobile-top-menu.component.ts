import { Component, OnInit } from '@angular/core';
import {ThemeService} from "../../../services/theme.service";

@Component({
  selector: 'app-element-mobile-top-menu',
  templateUrl: './element-mobile-top-menu.component.html',
  styleUrls: ['./element-mobile-top-menu.component.scss']
})
export class ElementMobileTopMenuComponent implements OnInit {
  isToggled: Boolean = false;

  constructor(
    public themeService: ThemeService
  ) { }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    window.location.href = '/signin';
  }

}
