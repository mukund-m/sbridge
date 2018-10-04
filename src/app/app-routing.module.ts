import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from './guards/authentication.guard';

import { PageLandingComponent } from './components/pages/page-landing/page-landing.component';
import { PageSigninComponent } from './components/pages/page-signin/page-signin.component';
import { PageSignupComponent } from './components/pages/page-signup/page-signup.component';
import { PageResetComponent } from './components/pages/page-reset/page-reset.component';
import { Page404Component } from "./components/pages/page-404/page-404.component";
import { PageAnalyticsComponent } from "./components/pages/page-analytics/page-analytics.component";
import { ValidityGuard } from "./guards/validity.guard";

const routes: Routes = [
  {path: '', component: PageLandingComponent, canActivate: [ValidityGuard]},
  {path: 'signin', component: PageSigninComponent, canActivate: [ValidityGuard]},
  {path: 'signup', component: PageSignupComponent, canActivate: [ValidityGuard]},
  {path: 'reset', component: PageResetComponent, canActivate: [ValidityGuard]},
  {path: 'dashboard', canActivate: [ValidityGuard, AuthenticationGuard], loadChildren: './modules/dashboard/dashboard.module#DashboardModule'},
  { path: '404', component: Page404Component},
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    AuthenticationGuard,
    PageAnalyticsComponent
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
