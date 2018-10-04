import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageDashboardComponent } from '../../components/pages/page-dashboard/page-dashboard.component';
import { PageAdministrationComponent } from '../../components/pages/page-administration/page-administration.component';
import { PageTutorialComponent } from '../../components/pages/page-tutorial/page-tutorial.component';
import { PageQuizComponent } from '../../components/pages/page-quiz/page-quiz.component';
import { PageLibrariesComponent } from '../../components/pages/page-libraries/page-libraries.component';
import { PageUsersComponent } from '../../components/pages/page-users/page-users.component';
import { PageClientsComponent } from '../../components/pages/page-clients/page-clients.component';
import { PageUserComponent } from "../../components/pages/page-user/page-user.component";

import { AdministratorGuard } from '../../guards/administrator.guard';
import { ClientGuard } from '../../guards/client.guard';
import { PageAnalyticsComponent } from "../../components/pages/page-analytics/page-analytics.component";

const routes: Routes = [
  { path: '', component: PageDashboardComponent },
  { path: 'libraries', component: PageLibrariesComponent },
  { path: 'quizzes/:id', component: PageQuizComponent },
  { path: 'tutorials/:id', component: PageTutorialComponent },
  { path: 'administration', component: PageAdministrationComponent, canActivate: [ClientGuard] },
  { path: 'users/:id', component: PageUserComponent },
  { path: 'users', component: PageUsersComponent, canActivate: [ ClientGuard ] },
  { path: 'clients', component: PageClientsComponent, canActivate: [ AdministratorGuard ] },
  { path: 'analytics', component: PageAnalyticsComponent, canActivate: [ ClientGuard ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
