import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { NavigationService } from '../../../services/navigation.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-landing',
  templateUrl: './page-landing.component.html',
  styleUrls: ['./page-landing.component.scss']
})
export class PageLandingComponent implements OnInit {

  constructor(
    public themeService: ThemeService,
    public navigationService: NavigationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.navigationService.appLoading = false;
    this.authService.isLoggedIn().then((user)=>{
      if(user) {
        this.router.navigate(['/dashboard'])
      }
      
    })
  }

}
