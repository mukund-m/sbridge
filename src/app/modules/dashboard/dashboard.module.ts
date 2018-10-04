import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ColorPickerModule } from 'ngx-color-picker';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { UserService } from '../../services/user.service';
import { ModuleService } from '../../services/module.service';
import { TutorialService } from '../../services/tutorial.service';
import { VideoService } from '../../services/video.service';
import { UrlService } from '../../services/url.service';
import { FileService} from '../../services/file.service';
import { QuizService } from '../../services/quiz.service';

import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AdministratorGuard } from '../../guards/administrator.guard';
import { ClientGuard } from '../../guards/client.guard';

import { TransformTutorialContentPipe } from '../../pipes/transform-tutorial-content.pipe';

import { PageDashboardComponent } from '../../components/pages/page-dashboard/page-dashboard.component';
import { PageAdministrationComponent } from '../../components/pages/page-administration/page-administration.component';
import { PageTutorialComponent } from '../../components/pages/page-tutorial/page-tutorial.component';
import { PageQuizComponent } from '../../components/pages/page-quiz/page-quiz.component';
import { PageClientsComponent } from '../../components/pages/page-clients/page-clients.component';
import { PageUsersComponent } from '../../components/pages/page-users/page-users.component';
import { PageLibrariesComponent } from '../../components/pages/page-libraries/page-libraries.component';
import { PageUserComponent } from '../../components/pages/page-user/page-user.component';
import { PageAnalyticsComponent } from '../../components/pages/page-analytics/page-analytics.component';

import { ElementWhatsNewComponent } from '../../components/elements/element-whats-new/element-whats-new.component';
import { ElementLeaderboardComponent } from '../../components/elements/element-leaderboard/element-leaderboard.component';
import { ElementTimelineComponent } from '../../components/elements/element-timeline/element-timeline.component';
import { ElementNewsflashComponent } from '../../components/elements/element-newsflash/element-newsflash.component';
import { ElementAdministrativeStatisticsComponent } from '../../components/elements/element-administrative-statistics/element-administrative-statistics.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    NgbModule.forRoot(),
    NgxChartsModule
  ],
  declarations: [
    PageDashboardComponent,
    PageAdministrationComponent,
    PageLibrariesComponent,
    PageQuizComponent,
    PageTutorialComponent,
    PageClientsComponent,
    PageUsersComponent,
    PageUserComponent,
    PageAnalyticsComponent,
    TransformTutorialContentPipe,
    ElementWhatsNewComponent,
    ElementLeaderboardComponent,
    ElementTimelineComponent,
    ElementNewsflashComponent,
    ElementAdministrativeStatisticsComponent,
  ],
  providers: [
    UserService,
    ModuleService,
    TutorialService,
    VideoService,
    UrlService,
    FileService,
    QuizService,
    AuthenticationGuard,
    AdministratorGuard,
    ClientGuard
  ]
})
export class DashboardModule { }
