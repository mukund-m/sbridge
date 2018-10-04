import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ClientService} from "../../../services/client.service";
import {Tutorial} from "../../../models/tutorial";
import {ApiResponse} from "../../../interfaces/api-response";
import {ThemeService} from "../../../services/theme.service";
import {NavigationService} from "../../../services/navigation.service";

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
    navigationService: NavigationService
  ) {
    navigationService.isDashboard = true;
  }

  ngOnInit() {
    this.loading = true;
    this.loadingStatus = 'Loading Tutorial...';
    this._route.params.subscribe(params => {
      this.route = params['id'];
      this._APIService.getTutorial(this.route, this.clientService.client, localStorage.getItem('token')).subscribe((tutorialsResult: ApiResponse) => {
        this.loading = false;
        this.tutorial = new Tutorial(tutorialsResult.data);
      }, error => {
        if (error) {
          this.loading = false;
          this.failure = true;
          this.resultMessage = error.error.message;
        }
      });
    });
  }

  transformContent(content) {
    return content
      .innerHTML.replace('[paragraph]', '<p>')
      .replace('[/paragraph]', '</p>');
  }
}
