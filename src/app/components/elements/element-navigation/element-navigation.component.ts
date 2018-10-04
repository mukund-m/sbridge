import { Component, OnInit } from '@angular/core';

import { ThemeService } from '../../../services/theme.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-element-navigation',
  templateUrl: './element-navigation.component.html',
  styleUrls: ['./element-navigation.component.scss']
})
export class ElementNavigationComponent implements OnInit {

  constructor(
    public themeService: ThemeService,
    public navigationService: NavigationService
  ) { }

  ngOnInit() {
  }

}
