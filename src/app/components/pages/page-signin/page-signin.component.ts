import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { ClientService } from '../../../services/client.service';
import { BasePage } from '../../../abstract-classes/base-page';
import { ApiService } from '../../../services/api.service';
import { SigninResponse } from '../../../interfaces/signin-response';
import { NavigationService } from '../../../services/navigation.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-signin',
  templateUrl: './page-signin.component.html',
  styleUrls: ['./page-signin.component.scss']
})
export class PageSigninComponent extends BasePage implements OnInit {
  signinForm: FormGroup;
  submitted: Boolean = false;

  constructor(
    public themeService: ThemeService,
    public navigationService: NavigationService,
    public clientService: ClientService,
    public APIService: ApiService,
    private _authenticationService: AuthenticationService,
    private authService: AuthService,
    private routerService: Router
  ) {
    super();
  }

  ngOnInit() {
    this.navigationService.appLoading = false;
    this.signinForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    if (localStorage.getItem('token')) {
      this.success = true;
      this.resultMessage = 'You seem to be logged in already. We\'re redirecting you to your dashboard.';
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
    }
  }

  submitForm() {

    this.loading = true;
    this.authService.signIn(this.signinForm.value.email, this.signinForm.value.password).then(()=> {
      this.resultMessage = 'Signin success. Redirecting you to your dashboard.';
      this.routerService.navigate(['/dashboard'])
    }).catch(()=> {
      this.resultMessage = 'Error while authenticating';
    })
    ;
  }

}
