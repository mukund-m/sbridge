import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { ClientService } from '../../../services/client.service';
import {BasePage} from "../../../abstract-classes/base-page";
import {ApiService} from "../../../services/api.service";
import {ApiResponse} from "../../../interfaces/api-response";
import {ActivatedRoute, Params} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";

@Component({
  selector: 'app-page-signup',
  templateUrl: './page-signup.component.html',
  styleUrls: ['./page-signup.component.scss']
})
export class PageSignupComponent extends BasePage implements OnInit {
  signupForm: FormGroup;
  submitted: Boolean = false;
  activate: Boolean = false;

  constructor(
    public themeService: ThemeService,
    public navigationService: NavigationService,
    public clientService: ClientService,
    public APIService: ApiService,
    private _activatedRoute: ActivatedRoute
  ) {
    super();
  }


  validateConfirmPassword(ac: AbstractControl) {
    const password = ac.get('password').value;
    const confirmPassword = ac.get('confirmPassword').value;
    if (password !== confirmPassword) {
      ac.get('confirmPassword').setErrors( {ConfirmPassword: true} );
    } else {
      return null;
    }
  }

  ngOnInit() {
    this.navigationService.appLoading = false;
    this.signupForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, this.validateConfirmPassword);
    this._activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['activate'] && params['activate'] === '1' && params['token'] && params['id']) {
        this.loadingStatus = 'Validating your credentials...';
        this.loading = true;
        this.APIService.activateUser(this.clientService.client, params['id'], params['token']).subscribe((activateResult: ApiResponse) => {
          if (activateResult) {
            this.loading = false;
            this.success = true;
            this.resultMessage = 'Account activated successfully. Sign in to continue.';
          }
        }, activateError => {
          if (activateError) {
            this.loading = false;
            this.failure = true;
            this.resultMessage = activateError.error.message;
          }
        });
      }
    });
  }


  submitForm() {
    this.loading = true;
    this.APIService.newUser(this.clientService.client, this.signupForm.value).subscribe((signupResult: ApiResponse) => {
      this.loading = false;
      this.success = true;
      this.resultMessage = 'Account created successfully. Check your email to continue.';
    }, signupError => {
      if (signupError) {
        this.loading = false;
        this.failure = true;
        this.resultMessage = signupError.error.message;
      }
    });
  }
}
