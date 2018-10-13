import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { PageSigninComponent } from './components/pages/page-signin/page-signin.component';
import { PageSignupComponent } from './components/pages/page-signup/page-signup.component';
import { PageResetComponent } from './components/pages/page-reset/page-reset.component';
import { PageLandingComponent } from './components/pages/page-landing/page-landing.component';
import { ElementNavigationComponent } from './components/elements/element-navigation/element-navigation.component';

import { ThemeService } from './services/theme.service';
import { NavigationService } from './services/navigation.service';
import { ClientService } from './services/client.service';
import { AuthenticationService } from './services/authentication.service';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { Page404Component } from "./components/pages/page-404/page-404.component";
import { ValidityGuard } from "./guards/validity.guard";
import { ElementMobileTopMenuComponent } from "./components/elements/element-mobile-top-menu/element-mobile-top-menu.component";
import { ElementSideMenuComponent } from "./components/elements/element-side-menu/element-side-menu.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { firebaseConfig }                             from '../environments/firebase.config';
import { AngularFireAuthModule }                      from 'angularfire2/auth';
import { AngularFirestoreModule }                     from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from './services/auth.service';
import { FirebaseUserService } from './firebase-services/firebase-user.service';
import { FirebaseClientService } from './firebase-services/firebase-client.service';
import { DateService } from './firebase-services/date.service';
import { FirebaseQuizService } from './firebase-services/firebase-quiz.service';
import { FirebaseModuleService } from './firebase-services/firebase-module.service';
import { FirebaseCloudFunctionService } from './firebase-services/firebase-cloud-function.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    PageSigninComponent,
    PageSignupComponent,
    PageResetComponent,
    PageLandingComponent,
    Page404Component,
    ElementNavigationComponent,
    ElementSideMenuComponent,
    ElementMobileTopMenuComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    NgbModule.forRoot(),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  providers: [
    ThemeService,
    NavigationService,
    ClientService,
    AuthenticationService,
    ApiService,
    ValidityGuard,
    AuthService,
    FirebaseUserService,
    FirebaseClientService,
    FirebaseQuizService,
    FirebaseModuleService,
    FirebaseCloudFunctionService,
    DateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
