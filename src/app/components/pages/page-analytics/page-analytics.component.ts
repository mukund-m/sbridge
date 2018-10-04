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
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
    domain: ['#4097ec','#9E9E9E']
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
    domain: ['#4097ec','#9E9E9E']
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
      this.modulesService.getClientModules(this.clientModulesOffset, this.clientModulesLimit,  client).subscribe((result: any) => {
        this.loading = false;
        this.clientModules = [];
        for (const module of result.data) {
          this.clientModules.push(new Module(module));
        }
        resolve(result);
      }, error => {
        reject(error.error.message);
      });
    });
  }

  getUsersModules() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.loadingStatus = 'Loading Users...';
      const client = (this.getRole() === 'administrator' && this.selectedClient) ? this.selectedClient._id : this.clientService.client;
      this.userService.getUsersModules(this.usersModulesOffset, this.usersModulesLimit, this.usersModulesSearchParam, client, this.usersModulesFilter)
        .subscribe((result: any) => {
          this.loading = false;
          this.users = [];
          for (const user of result.data) {
            this.users.push(new User(user));
          }
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  getModulesStatistics() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.loadingStatus = 'Loading Statistics...';
      const client = (this.getRole() === 'administrator' && this.selectedClient) ? this.selectedClient._id : this.clientService.client;
      this.modulesService.getModulesStatistics(this.modulesStatisticsOffset, this.modulesStatisticsLimit, client)
        .subscribe((result: any) => {
          this.loading = false;
          for (const foundModule of result.data) {
            for (const module of this.clientModules) {
              if (foundModule._id === module._id) {
                module.meanGrade = foundModule.meanGrade;
              }

            }
          }
          this.buildMeanData();
          this.buildLineData();
          resolve(result);
        }, error => {
          reject(error.error);
        });
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
      const client = (this.getRole() === 'administrator' && this.selectedClient) ? this.selectedClient._id : this.clientService.client;
      this.getUsersSubscription = this.userService.getUsers(this.page, this.limit, this.searchParam, client, filterByClient).subscribe( (result: ApiResponse) => {
        this.loading = false;
        result.data.length === this.limit ? this.canLoadMore = true : this.canLoadMore = false;
        this.page += result.data.length;
        for (const user of result.data) {
          this.users.push(new User(user));
        }
        resolve();
      }, error => {
        reject(error);
        this.failure = true;
        this.loading = false;
        this.resultMessage = error.error.message;
      });
    });
  }
  getClients() {
    if (this._authenticationService.user.role === 'administrator') {
      this.loading = true;
      this.loadingStatus = 'Fetching Clients...';
      this.clientService.getClients(0, 100, '').subscribe((result: ApiResponse) => {
        this.loading = false;
        if (result.status === 200) {
          for (const client of result.data) {
            this.clients.push(new Client(client));
          }
        }
      }, error => {
        this.loading = false;
        this.failure = true;
        this.resultMessage = error.error.message;
      });
    } else {
      this.userForm.patchValue({client: this.clientService.client});
    }
  }

  getUserModuleGrade(module) {
    if (this.selectedUser) {
      for (const userModule of this.selectedUser.modules) {
        if (userModule.module._id === module._id) {
          return userModule.validationGrade;
        }
      }
    }
    return 0;
  }

  getUserModuleValidated(user, module) {
    console.log(module.title, module._id);
    for (const userModule of user.modules) {
      console.log(userModule.module._id);
      if (userModule.module._id === module._id) {
        console.log('meh');
        if (userModule.isValidated === true) {
          return 'Complete Passed';
        } else if (userModule.isValidated === false) {
          return 'Complete Failed';
        }
      }
    }
    return 'Incomplete / Failed';
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
        name: this.selectedUser ? this.selectedUser.firstName + ' ' + this.selectedUser.lastName: 'User',
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
}
