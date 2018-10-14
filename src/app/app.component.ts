import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {NavigationService} from "./services/navigation.service";
import {ClientService} from "./services/client.service";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  authCheckDone: boolean = false;
  authenticated = false;
  constructor(
    public authenticationService: AuthenticationService,
    public navigationService: NavigationService,
    public authService: AuthService,
    public clientService: ClientService
  ) {}

  ngOnInit() {
    this.navigationService.appLoading = false;
    this.navigationService.appLoadingMessage = 'Loading...';
    this.authService.isLoggedIn().then((user)=> {
      setTimeout(()=>{
        this.authCheckDone = true;
      }, 1000)
    })
    this.authService.loggedInSubject.subscribe((value)=>{
      this.authenticated = value; 
    })
  }
}
