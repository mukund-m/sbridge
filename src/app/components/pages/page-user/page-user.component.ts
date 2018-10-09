import { Component, OnInit } from '@angular/core';

import { ThemeService } from '../../../services/theme.service';
import { UserService } from '../../../services/user.service';
import { AuthenticationService } from '../../../services/authentication.service';

import { BaseSubPage } from '../../../abstract-classes/base-sub-page';

import { User } from '../../../models/user';
import { ClientService } from "../../../services/client.service";
import { Client } from "../../../models/client";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";
import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';
import { FirebaseModuleService } from '../../../firebase-services/firebase-module.service';
import { Util } from '../../../utilities/util';
import { View } from '../../../models/views';
import { DateService } from '../../../firebase-services/date.service';

@Component({
  selector: 'app-page-user',
  templateUrl: './page-user.component.html',
  styleUrls: ['./page-user.component.scss']
})
export class PageUserComponent extends BaseSubPage implements OnInit {
  loading: Boolean = true;
  failure: Boolean = false;
  resultMessage: String = '';
  loadingStatus: String = '';

  constructor(
    private _authenticationService: AuthenticationService,
    private _activatedRoute: ActivatedRoute,
    public themeService: ThemeService,
    public userService: UserService,
    public clientService: ClientService,
    public navigationService: NavigationService,
    private firebaseUserService: FirebaseUserService,
    private firebaseModuleService: FirebaseModuleService,
    private dateService: DateService
  ) {
    super();
  }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.loading = true;
        this.loadingStatus = 'Loading User...';

        this.firebaseUserService.getUser(params['id']).subscribe((user: User)=> {
          this.loading = false;
          user.creationDate = this.dateService.transform(user.creationDate);
          this.userService.selectedUser = user;
          let tutorialViews = 0;
          let videoViews = 0;
          this.firebaseModuleService.getAllModules().subscribe((clients)=>{
            for(let client of clients) {
              for(let module of client.modules) {
                module = Util.cleanUpModules(module);
                for(let tutorial of module.tutorials) {
                  if(tutorial.views && tutorial.views[0] != undefined) {
                    for(let view of tutorial.views) {
                      if(view.user_id == params['id']) {
                        tutorialViews = tutorialViews +1;
                      }
                    }
                  }
                }
                for(let video of module.videos) {
                  if(video.views && video.views[0] != undefined) {
                    for(let view of video.views) {
                      if(view.user_id == params['id']) {
                        videoViews = videoViews +1;
                      }
                    }
                  }
                }
              }
            }
            this.userService.selectedUser.tutorialsAttempted = tutorialViews;
            this.userService.selectedUser.videosAttempted = videoViews;
          });
          this.firebaseUserService.getCurrentUserQuizzes(params['id']).subscribe((quizzes)=>{
            this.userService.selectedUser.quizzesCompleted = quizzes.length;
          })
        })
      } else {
        this.failure = true;
        this.resultMessage = 'A user ID is required';
      }
    });
  }
}


