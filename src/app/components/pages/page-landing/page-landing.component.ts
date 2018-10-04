import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-page-landing',
  templateUrl: './page-landing.component.html',
  styleUrls: ['./page-landing.component.scss']
})
export class PageLandingComponent implements OnInit {

  constructor(
    public themeService: ThemeService,
    public navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.navigationService.appLoading = false;
  }

}
