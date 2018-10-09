import { Component, OnInit } from '@angular/core';
import { ApiResponse } from "../../../interfaces/api-response";
import { ClientService } from "../../../services/client.service";
import { UserService } from "../../../services/user.service";
import { AuthenticationService } from "../../../services/authentication.service";
import { Client } from "../../../models/client";
import { ModuleService } from "../../../services/module.service";
import { Module } from "../../../models/module";
import { User } from "../../../models/user";
import { ThemeService } from '../../../services/theme.service';
import { Subscription } from "rxjs/Subscription";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FirebaseModuleService } from '../../../firebase-services/firebase-module.service';
import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';
import { FirebaseClientService } from '../../../firebase-services/firebase-client.service';

@Component({
  selector: 'app-page-analytics',
  templateUrl: './page-analytics.component.html',
  styleUrls: ['./page-analytics.component.scss']
})
export class PageAnalyticsComponent implements OnInit {
  clientModulesOffset: any = 0;
  clientModulesLimit: any = 0;
  usersModulesOffset: any = 0;
  usersModulesLimit: any = 20;
  modulesStatisticsOffset: any = 0;
  modulesStatisticsLimit: any = 20;
  usersModulesSearchParam: String = '';
  usersModulesFilter: String = 'firstName';
  clientModules: Module[] = [];
  selectedClient: Client;
  selectedUser: User;
  statistics: any;
  loading: Boolean = false;
  failure: Boolean = false;
  loadingStatus = '';
  resultMessage: String = '';

  canLoadMore: Boolean = false;
  searchParam: String = '';
  page: any = 0;
  limit: any = 12;
  users: Array<User> = [];
  fetchingResults: Boolean = false;
  isSearched: Boolean = false;
  getUsersSubscription: Subscription;
  clients: Array<Client> = [];
  submitted: Boolean = false;
  userForm: FormGroup;

  lineData: any[] = [];

  viewline: any[];

  showXAxisline = true;
  showYAxisline = true;
  gradientline = false;
  showLegendline = true;
  showLegendTitleline = 'Ave Questions';
  showXAxisLabelline = true;
  xAxisLabelline = 'Module';
  showYAxisLabelline = true;
  yAxisLabelline = 'Percentage Acquired';

  colorSchemeline = {
    domain: ['#4097ec', '#9E9E9E']
  };

  autoScaleline = true;

  meanData: any[] = [];


  view1: any[];

  showXAxis1 = true;
  showYAxis1 = true;
  gradient1 = false;
  showLegend1 = true;
  showLegendTitle1 = 'Mean Scores';
  showXAxisLabel1 = true;
  xAxisLabel1 = 'Module';
  showYAxisLabel1 = true;
  yAxisLabel1 = 'Mean Score';

  colorScheme1 = {
    domain: ['#4097ec', '#9E9E9E']
  };

  heatData: any[] = [];


  viewheat: any[];

  showXAxisheat = true;
  showYAxisheat = true;
  gradientheat = false;
  showLegendheat = 'Heat Map';
  showLegendTitleheat = 'Modules Validated'
  showXAxisLabelheat = true;
  xAxisLabelheat = 'Module';
  showYAxisLabelheat = true;
  yAxisLabelheat = 'Pass / Fail / Incomplete';

  colorSchemeheat = {
    domain: ['#9E9E9E', '#4097ec', '#FFF']
  };

  constructor(
    public clientService: ClientService,
    public themeService: ThemeService,
    public userService: UserService,
    public modulesService: ModuleService,
    private firebaseModuleService: FirebaseModuleService,
    private firebaseUserService: FirebaseUserService,
    private firebaseClientService: FirebaseClientService,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getData();
    this.getUsers().then(result => { this.getClients(); });
  }

  onSelect(event: any): void {
    console.log(event);
    for (const user of this.users) {
      if (event.name.split(' ')[0] === user.firstName) {
        this.selectedUser = user;
      }
    }
    this.buildLineData();
    this.buildMeanData();
  }

  getRole() {
    return this._authenticationService.user.role || null;
  }

  getData() {
    this.getClientModules()
      .then(modulesResult => {
        return this.getUsersModules();
      }).then(usersModulesResult => {
        this.buildHeatData();
        return this.getModulesStatistics();
      }).then(modulesStatisticsResult => {
      }).catch(error => {
        this.failure = true;
        this.resultMessage = error.message;
      });
  }

  getClientModules() {
    const client = (this.getRole() === 'administrator' && this.selectedClient) ? this.selectedClient._id : this.clientService.client;

    return new Promise((resolve, reject) => {
      this.loading = true;
      this.loadingStatus = 'Loading Modules...';
      this.firebaseModuleService.getAllModules().subscribe((clients) => {
        this.loading = false;
        this.clientModules = [];
        for (const client of clients) {
          if (client.modules && client.modules[0] == undefined) {
            client.modules = [];
          }
          for (let module of client.modules) {
            this.clientModules.push(module);
          }
        }
        resolve(clients);
      })
    });
    // return new Promise((resolve, reject) => {
    //   this.loading = true;
    //   this.loadingStatus = 'Loading Modules...';
    //   this.modulesService.getClientModules(this.clientModulesOffset, this.clientModulesLimit,  client).subscribe((result: any) => {
    //     this.loading = false;
    //     this.clientModules = [];
    //     for (const module of result.data) {
    //       this.clientModules.push(new Module(module));
    //     }
    //     resolve(result);
    //   }, error => {
    //     reject(error.error.message);
    //   });
    // });
  }

  getUsersModules() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.loadingStatus = 'Loading Users...';
      const client = (this.getRole() === 'administrator' && this.selectedClient) ? this.selectedClient._id : this._authenticationService.user.client_id;
      this.firebaseUserService.getUsersForClientWithQuiz(client).subscribe((users) => {
        this.loading = false;
        this.users = [];
        for (const user of users) {
          this.users.push(user);
        }
        resolve(users);
      })
      // this.userService.getUsersModules(this.usersModulesOffset, this.usersModulesLimit, this.usersModulesSearchParam, client, this.usersModulesFilter)
      //   .subscribe((result: any) => {
      //     this.loading = false;
      //     this.users = [];
      //     for (const user of result.data) {
      //       this.users.push(new User(user));
      //     }
      //     resolve(result);
      //   }, error => {
      //     reject(error);
      //   });
    });
  }

  getModulesStatistics() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.loadingStatus = 'Loading Statistics...';
      for(let module of this.clientModules) {
        let totalValidated = 0;
        let totalGrade = 0;
        for(let user of this.users) {
          if(this.getAverageUserGradeForModule(user, module).isAttempted) {
            totalValidated  = totalValidated+1;
          }
          totalGrade = totalGrade + this.getAverageUserGradeForModule(user, module).avg;
        }
        if(totalValidated != 0) {
          module.meanGrade = Math.ceil(totalGrade / totalValidated);
        }
        module.meanGrade = 0
      }
      this.loading = false;
       this.buildMeanData();
           this.buildLineData();
          resolve();
      // const client = (this.getRole() === 'administrator' && this.selectedClient) ? this.selectedClient._id : this.clientService.client;
      // this.modulesService.getModulesStatistics(this.modulesStatisticsOffset, this.modulesStatisticsLimit, client)
      //   .subscribe((result: any) => {
      //     this.loading = false;
      //     for (const foundModule of result.data) {
      //       for (const module of this.clientModules) {
      //         if (foundModule._id === module._id) {
      //           module.meanGrade = foundModule.meanGrade;
      //         }

      //       }
      //     }
      //     this.buildMeanData();
      //     this.buildLineData();
      //     resolve(result);
      //   }, error => {
      //     reject(error.error);
      //   });
    });
  }

  updateGetUsersWithoutKey() {
    this.isSearched = true;
    this.page = 0;
    this.users = [];
    this.fetchingResults = true;
    this.getUsers().then(result => {
      this.fetchingResults = false;
    });
  }

  getUsers() {
    return new Promise((resolve, reject) => {
      if (this.getUsersSubscription) {
        this.getUsersSubscription.unsubscribe();
      }
      const filterByClient = this.selectedClient ? 'client' : '';
      const client = (this.getRole() === 'administrator' && this.selectedClient) ? this.selectedClient._id : this._authenticationService.user.client_id;
      this.firebaseUserService.getUsersForClientWithQuiz(client).subscribe((users) => {
        this.loading = false;
        this.users = [];
        for (const user of users) {
          this.users.push(user);
        }
        resolve(users);
      })
    });
  }
  getClients() {
    if (this._authenticationService.user.role === 'administrator') {
      this.loading = true;
      this.loadingStatus = 'Fetching Clients...';
      this.firebaseClientService.getAllClients().subscribe((clients) => {
        this.loading = false;

        for (const client of clients) {
          this.clients.push(client);
        }

      })
    } else {
      this.userForm.patchValue({ client: this.clientService.client });
    }
  }

  getUserModuleGrade(module) {
    if (this.selectedUser) {
      return this.getAverageUserGradeForModule(this.selectedUser, module).avg
      
    }
    return 0;
  }

  getUserModuleValidated(user, module) {
    let isAttempted = false;
    let totalValidationGrade = 0;
    let totalQuizzes = 0;
    let userScore = 0;
    let totalUserQuizzes = 0;
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
    if(!module.files) {
      module.files = [];
    }
    for (const video of module.videos) {
      if (video.quiz && video.quiz[0]) {
        video.quiz = video.quiz[0];
        totalQuizzes++;
        totalValidationGrade += video.quiz.passPercentage;
        for (const userQuiz of user.quiz) {
          if (video.quiz && userQuiz.quiz_id && video.quiz._id == (userQuiz.quiz_id)) {
            isAttempted = true;
            if (userQuiz.validated) {
              totalUserQuizzes++;
              userScore += userQuiz.percentageCorrect;
            }
          }
        }
      }
      
    }
    for (const tutorial of module.tutorials) {
      if (tutorial.quiz && tutorial.quiz[0]) {
        tutorial.quiz = tutorial.quiz[0];
        totalQuizzes++;
        totalValidationGrade += tutorial.quiz.passPercentage;
        for (const userQuiz of user.quiz) {
          if (tutorial.quiz && userQuiz.quiz_id && tutorial.quiz._id == (userQuiz.quiz_id)) {
            isAttempted = true;
            if (userQuiz.validated) {
              totalUserQuizzes++;
              userScore += userQuiz.percentageCorrect;
            }
          }
        }
      }
      
    }

    for (const url of module.urls) {
      if (url.quiz && url.quiz[0]) {
        url.quiz = url.quiz[0];
        totalQuizzes++;
        totalValidationGrade += url.quiz.passPercentage;
        for (const userQuiz of user.quiz) {
          if (url.quiz && userQuiz.quiz_id && url.quiz._id == (userQuiz.quiz_id)) {
            isAttempted = true;
            if (userQuiz.validated) {
              totalUserQuizzes++;
              userScore += userQuiz.percentageCorrect;
            }
          }
        }
      }
      
    }
    for (const file of module.files) {
      if (file.quiz && file.quiz[0]) {
        file.quiz = file.quiz[0];
        totalQuizzes++;
        totalValidationGrade += file.quiz.passPercentage;
        for (const userQuiz of user.quiz) {
          if (file.quiz && userQuiz.quiz_id && file.quiz._id == (userQuiz.quiz_id)) {
            isAttempted = true;
            if (userQuiz.validated) {
              totalUserQuizzes++;
              userScore += userQuiz.percentageCorrect;
            }
          }
        }
      }
      
    }
    let averageUserGrade = 0;
    if(totalUserQuizzes != 0) {
      averageUserGrade  = Math.ceil(userScore / totalUserQuizzes);
    }
    const averageValidationGrade = Math.ceil(totalValidationGrade / totalQuizzes);
    let isValidated = false;
    if (averageUserGrade >= averageValidationGrade && averageValidationGrade > 0 && totalQuizzes === totalUserQuizzes) {
      isValidated = true;
    }
    if (isValidated) {
      return 'Complete Passed';
    }
    else if (!isValidated && isAttempted) {
      return 'Complete Failed';
    } else {
      return 'Incomplete / Failed';
    }

  }

  getUserModuleGrades() {
    const returnValue = [];
    for (const module of this.clientModules) {
      const dataPoint = {
        name: module.title,
        value: this.selectedUser ? this.getUserModuleGrade(module) : 0
      };
      returnValue.push(dataPoint);
    }
    return returnValue;
  }

  getModuleGrades() {
    const returnValue = [];
    for (const module of this.clientModules) {
      const dataPoint = {
        name: module.title,
        value: module.meanGrade
      };
      returnValue.push(dataPoint);
    }
    return returnValue;
  }

  buildLineData() {
    this.lineData = [
      {
        name: this.selectedUser ? this.selectedUser.firstName + ' ' + this.selectedUser.lastName : 'User',
        series: this.getUserModuleGrades()
      },
      {
        name: 'Average',
        series: this.getModuleGrades()
      }
    ];
  }

  buildMeanData() {
    const data = [];
    for (const module of this.clientModules) {
      const dataPoint = {
        name: module.title,
        series: [
          {
            name: this.selectedUser ? this.selectedUser.firstName + ' ' + this.selectedUser.lastName : 'User',
            value: this.getUserModuleGrade(module)
          },
          {
            name: 'Average',
            value: module.meanGrade
          }
        ]
      };
      data.push(dataPoint);
    }
    this.meanData = data;
  }

  getUsersValidation(module) {
    const returnValue = [];
    for (const user of this.users) {
      const dataPoint = {
        name: user.firstName + ' ' + user.lastName,
        value: this.getUserModuleValidated(user, module),
        extra: user._id
      };
      returnValue.push(dataPoint);
    }
    return returnValue;
  }

  buildHeatData() {
    const data = [];
    for (const module of this.clientModules) {
      const dataPoint = {
        name: module.title,
        series: this.getUsersValidation(module)
      };
      data.push(dataPoint);
    }
    this.heatData = data;
  }

  getAverageUserGradeForModule(user, module) {
    let isAttempted = false;
    let totalValidationGrade = 0;
    let totalQuizzes = 0;
    let userScore = 0;
    let totalUserQuizzes = 0;
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
    if(!module.files) {
      module.files = [];
    }
    for (const video of module.videos) {
      if (video.quiz && video.quiz[0]) {
        video.quiz = video.quiz[0];
        totalQuizzes++;
        totalValidationGrade += video.quiz.passPercentage;
        for (const userQuiz of user.quiz) {
          if (video.quiz && userQuiz.quiz_id && video.quiz._id == (userQuiz.quiz_id)) {
            isAttempted = true;
            if (userQuiz.validated) {
              totalUserQuizzes++;
              userScore += userQuiz.percentageCorrect;
            }
          }
        }
      }
      
    }
    for (const tutorial of module.tutorials) {
      if (tutorial.quiz && tutorial.quiz[0]) {
        tutorial.quiz = tutorial.quiz[0];
        totalQuizzes++;
        totalValidationGrade += tutorial.quiz.passPercentage;
        for (const userQuiz of user.quiz) {
          if (tutorial.quiz && userQuiz.quiz_id && tutorial.quiz._id == (userQuiz.quiz_id)) {
            isAttempted = true;
            if (userQuiz.validated) {
              totalUserQuizzes++;
              userScore += userQuiz.percentageCorrect;
            }
          }
        }
      }
      
    }

    for (const url of module.urls) {
      if (url.quiz && url.quiz[0]) {
        url.quiz = url.quiz[0];
        totalQuizzes++;
        totalValidationGrade += url.quiz.passPercentage;
        for (const userQuiz of user.quiz) {
          if (url.quiz && userQuiz.quiz_id && url.quiz._id == (userQuiz.quiz_id)) {
            isAttempted = true;
            if (userQuiz.validated) {
              totalUserQuizzes++;
              userScore += userQuiz.percentageCorrect;
            }
          }
        }
      }
      
    }
    for (const file of module.files) {
      if (file.quiz && file.quiz[0]) {
        file.quiz = file.quiz[0];
        totalQuizzes++;
        totalValidationGrade += file.quiz.passPercentage;
        for (const userQuiz of user.quiz) {
          if (file.quiz && userQuiz.quiz_id && file.quiz._id == (userQuiz.quiz_id)) {
            isAttempted = true;
            if (userQuiz.validated) {
              totalUserQuizzes++;
              userScore += userQuiz.percentageCorrect;
            }
          }
        }
      }
      
    }
    let averageUserGrade = 0;
    if(totalUserQuizzes != 0) {
      averageUserGrade  = Math.ceil(userScore / totalUserQuizzes);
    }
     
    return {avg: averageUserGrade, isAttempted: isAttempted};

  }
}
