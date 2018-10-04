import { Component, OnInit } from '@angular/core';
import {User} from "../../../models/user";
import {ClientService} from "../../../services/client.service";
import {ApiResponse} from "../../../interfaces/api-response";
import {ThemeService} from "../../../services/theme.service";

@Component({
  selector: 'app-element-leaderboard',
  templateUrl: './element-leaderboard.component.html',
  styleUrls: ['./element-leaderboard.component.scss']
})
export class ElementLeaderboardComponent implements OnInit {
  leaders: Array<User> = [];
  loading: Boolean = false;
  failure: Boolean = false;
  loadingStatus: String = '';
  resultMessage: String = '';

  constructor(
    private clientService: ClientService,
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingStatus = 'Fetching leaderboard...';
    this.clientService.getLeaders().subscribe((result: ApiResponse) => {
      this.loading = false;
      this.leaders = result.data || [];
    }, error => {
      this.loading = false;
      this.failure = true;
      this.resultMessage = error.error.message;
    });
  }

  maskEmail(email) {

  }

}
