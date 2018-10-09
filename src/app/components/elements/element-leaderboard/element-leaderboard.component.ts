import { Component, OnInit } from '@angular/core';
import {User} from "../../../models/user";
import {ClientService} from "../../../services/client.service";
import {ApiResponse} from "../../../interfaces/api-response";
import {ThemeService} from "../../../services/theme.service";
import { FirebaseQuizService } from '../../../firebase-services/firebase-quiz.service';
import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';

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
    public themeService: ThemeService,
    private firebaseQuizService: FirebaseQuizService,
    private firebaseUserService: FirebaseUserService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingStatus = 'Fetching leaderboard...';
    this.firebaseUserService.getCurrentUser().subscribe((users)=>{
      this.firebaseQuizService.getLeaderBoard(users[0].client_id).subscribe((leaders)=>{
        for(let leader of leaders) {
          leader.email = leader.email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c);
        }
        this.loading = false;
        this.leaders = leaders;
      })
    })
    
  }

  maskEmail(email) {

  }

}
