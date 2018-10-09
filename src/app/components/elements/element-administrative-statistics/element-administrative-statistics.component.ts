import { Component, OnInit } from '@angular/core';
import {ClientService} from "../../../services/client.service";
import {ApiResponse} from "../../../interfaces/api-response";
import {ThemeService} from "../../../services/theme.service";
import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';
import { FirebaseQuizService } from '../../../firebase-services/firebase-quiz.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { User } from '../../../models/user';
import { FirebaseModuleService } from '../../../firebase-services/firebase-module.service';
import { Module } from '../../../models/module';

@Component({
  selector: 'app-element-administrative-statistics',
  templateUrl: './element-administrative-statistics.component.html',
  styleUrls: ['./element-administrative-statistics.component.scss']
})
export class ElementAdministrativeStatisticsComponent implements OnInit {
  statistics: any;
  loading: Boolean = false;
  failure: Boolean = false;
  loadingStatus = '';
  resultMessage: String = '';

  constructor(
    public clientService: ClientService,
    public themeService: ThemeService,
    private firebaseUserService: FirebaseUserService,
    private firebaseQuizService: FirebaseQuizService,
    private firebaseModuleService: FirebaseModuleService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingStatus = 'Fetching statistics...'
    this.getStatistics()
    // this.clientService.getStatistics().subscribe((result: ApiResponse) => {
    //   console.log(result);
    //   this.loading = false;
    //   this.statistics = result.data;
    // }, error => {
    //   this.loading = false;
    //   this.failure = true;
    //   this.resultMessage = error.error.message;
    // });
  }

  getStatistics() {
    this.statistics = {};
    let currentUser = this.authenticationService.user;
    if(currentUser.role == 'administrator') {
      this.firebaseUserService.getUsers().subscribe((users)=>{
        this.statistics.usersCount = users.length;
        let quizCount = 0;
        for(let user of users) {
          this.firebaseUserService.getCurrentUserQuizzes(user._id).subscribe((quizzes)=>{
            quizCount = quizCount + quizzes.length;
            this.statistics.completedQuizCount = quizCount;
          })
        }
        this.loading = false;
      })
      this.firebaseModuleService.getAllModules().subscribe((clients)=>{
        let modCount = 0;
        let mostViewedVideoCount = 0;
        let mostViewdVideo;
        let mostViewedTutorialCount = 0;
        let mostViewdTutorial;
        for(let client of clients) {
          modCount = modCount + client.modules.length;
          for(let module of client.modules) {
            if(module.tutorials) {
              if(module.tutorials.length>0 && module.tutorials[0] == undefined) {
                module.tutorials = [];
              }
            }
            if(module.videos) {
              if(module.videos.length>0 && module.videos[0] == undefined) {
                module.videos = [];
              }
            }
            if(module.urls) {
              if(module.urls.length>0 && module.urls[0] == undefined) {
                module.urls = [];
              }
            }
            for(let video of module.videos) {
              if(video.views.length > mostViewedVideoCount) {
                mostViewedVideoCount = video.views.length;
                mostViewdVideo = video;
              }
            }
            for(let video of module.tutorials) {
              if(video.views.length > mostViewedTutorialCount) {
                mostViewedTutorialCount = video.views.length;
                mostViewdTutorial = video;
              }
            }
          }
        }
        this.statistics.mostPopularVideo = mostViewdVideo;
        this.statistics.mostPopularTutorial = mostViewdTutorial;
        this.statistics.modulesCount = modCount;
      })
    } else if(currentUser.role == 'client') {
      this.firebaseUserService.getUsersForClient(currentUser.client_id).subscribe((users: User[])=>{
        this.statistics.usersCount = users.length;
        let quizCount = 0;
        for(let user of users) {
          this.firebaseUserService.getCurrentUserQuizzes(user._id).subscribe((quizzes)=>{
            quizCount = quizCount + quizzes.length;
            this.statistics.completedQuizCount = quizCount;
          })
        }
        this.loading = false;
      })
      
      this.firebaseQuizService.getLeaderBoard(currentUser.client_id).subscribe((leaders=>{
        this.statistics.userHighestScore = leaders[0];
      }))
      this.firebaseModuleService.getJustModules(currentUser.client_id).subscribe((modules)=>{
        this.statistics.modulesCount = modules.length;
      })
    }
    
    
  }

}
