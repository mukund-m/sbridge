import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ClientService} from "../../../services/client.service";
import {Tutorial} from "../../../models/tutorial";
import {ApiResponse} from "../../../interfaces/api-response";
import {ThemeService} from "../../../services/theme.service";
import {NavigationService} from "../../../services/navigation.service";
import { FirebaseModuleService } from '../../../firebase-services/firebase-module.service';

@Component({
  selector: 'app-page-tutorial',
  templateUrl: './page-tutorial.component.html',
  styleUrls: ['./page-tutorial.component.scss']
})
export class PageTutorialComponent implements OnInit {
  loading: Boolean = false;
  failure: Boolean = false;
  loadingStatus: String = '';
  resultMessage = '';
  route: any;
  tutorial: Tutorial;

  constructor(
    private _APIService: ApiService,
    private _route: ActivatedRoute,
    public clientService: ClientService,
    public themeService: ThemeService,
    private firebaseModuleService: FirebaseModuleService,
    navigationService: NavigationService
  ) {
    navigationService.isDashboard = true;
  }

  ngOnInit() { 
    this.loading = true;
    this.loadingStatus = 'Loading Tutorial...';
    this._route.params.subscribe(params => {
      this.route = params['id'];
      this._route.queryParams.subscribe((queryParams)=> {
        let client_id = queryParams.client;
        let module_id = queryParams.module;
        this.firebaseModuleService.getTutorial(client_id,module_id,this.route).subscribe((data)=>{
          this.loading = false;
          this.tutorial = data;
        })
      })
    });
  }

  transformContent(content) {
    return content
      .innerHTML.replace('[paragraph]', '<p>')
      .replace('[/paragraph]', '</p>');
  }
}
