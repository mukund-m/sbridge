import { Component, OnInit } from '@angular/core';
import {ClientService} from "../../../services/client.service";
import {ApiResponse} from "../../../interfaces/api-response";
import {ThemeService} from "../../../services/theme.service";

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
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingStatus = 'Fetching statistics...'
    this.clientService.getStatistics().subscribe((result: ApiResponse) => {
      console.log(result);
      this.loading = false;
      this.statistics = result.data;
    }, error => {
      this.loading = false;
      this.failure = true;
      this.resultMessage = error.error.message;
    });
  }

}
