import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ThemeService } from '../../../services/theme.service';
import { ClientService } from '../../../services/client.service';
import { ApiService } from '../../../services/api.service';

import { BasePage } from '../../../abstract-classes/base-page';

import { ApiResponse } from '../../../interfaces/api-response';
import { ActivatedRoute, Params } from '@angular/router';
import {NavigationService} from "../../../services/navigation.service";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-page-reset',
  templateUrl: './page-reset.component.html',
  styleUrls: ['./page-reset.component.scss']
})
export class PageResetComponent extends BasePage implements OnInit {
  resetInitForm: FormGroup;
  resetForm: FormGroup;
  submitted: Boolean = false;
  verified: Boolean = false;
  isReset: Boolean = false;

  constructor(
    public themeService: ThemeService,
    public clientService: ClientService,
    public navigationService: NavigationService,
    public APIService: ApiService,
    private authService: AuthService,
    private _activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.navigationService.appLoading = false;
    this.resetInitForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.resetForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
    this._activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['reset'] && params['reset'] === '1' && params['token'] && params['id']) {
        this.loadingStatus = 'Validating your credentials...';
        this.loading = true;
        this.APIService.verifyToken(params['id'], params['token'], 'reset').subscribe((verifyResult: ApiResponse) => {
          if (verifyResult) {
            this.loading = false;
            this.verified = true;
          }
        }, verifyError => {
          if (verifyError) {
            this.loading = false;
            this.failure = true;
            this.resultMessage = verifyError.error.message;
          }
        });
      }
    });
  }

  submitResetForm() {
    this._activatedRoute.queryParams.subscribe((params: Params) => {
      if (!params['reset'] || params['reset'] !== '1' || !params['token'] || !params['id']) {
        this.loading = false;
        this.failure = true;
        this.resultMessage = 'We could not verify your credentials';
      } else {
        this.loading = true;
        this.loadingStatus = 'Submitting you new credentials...';
        this.APIService.resetUser(this.clientService.client, params['id'], params['token'], this.resetForm.value).subscribe((resetResult: ApiResponse) => {
          this.loading = false;
          this.success = true;
          this.resultMessage = resetResult.message;
          this.isReset = true;
        }, resetError => {
          if (resetError) {
            this.loading = false;
            this.failure = true;
            this.resultMessage = resetError.error.message;
          }
        });
      }
    });
  }

  submitForm() {
    this.loading = true;
    this.authService.resetPassword(this.resetInitForm.value.email).then(()=>{
      this.loading = false;
      this.success = true;
      this.resultMessage = 'We have send you a password reset mail'
    }).catch((error)=>{
      this.loading = false;
      this.failure = true; 
      this.resultMessage = error;
    })
  }

}
