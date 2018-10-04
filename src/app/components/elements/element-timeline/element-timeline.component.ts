import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ApiResponse} from "../../../interfaces/api-response";
import {AuthenticationService} from "../../../services/authentication.service";
import {ThemeService} from "../../../services/theme.service";
import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-element-timeline',
  templateUrl: './element-timeline.component.html',
  styleUrls: ['./element-timeline.component.scss']
})
export class ElementTimelineComponent implements OnInit {
  @Input() userId: any;
  items: Array<any> = [];
  loading: Boolean = false;
  failure: Boolean = false;
  resultMessage: String = '';
  loadingStatus: String = '';

  constructor(
    public userService: UserService,
    public authenticationService: AuthenticationService,
    public themeService: ThemeService,
    public firebaseUserService: FirebaseUserService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingStatus = 'Fetching timeline...';
    
    this.firebaseUserService.getCurrentUser().subscribe((users: User[])=> {
      this.firebaseUserService.getCurrentUserQuizzes(users[0]._id).subscribe((quizzes: any[])=> {
        this.loading = false;
        if(quizzes) {
          for (const quiz of quizzes) {
            quiz.type = 'quiz';
            this.items.push(quiz);
          }
          this.items.sort((a, b) => a.dateCompleted > b.dateCompleted ? 0 : 1);
        }
      })
    })
    

    // this.userService.getUserHistory(this.userId).subscribe((result: ApiResponse) => {
    //   console.log(result);
    //   this.loading = false;
    //   if (result.data.quizzes) {
    //     for (const quiz of result.data.quizzes) {
    //       quiz.type = 'quiz';
    //       this.items.push(quiz);
    //     }
    //     this.items.sort((a, b) => a.dateCompleted > b.dateCompleted ? 0 : 1);
    //   }
    // }, error => {
    //   this.loading = false;
    //   this.failure = true;
    //   this.resultMessage = error.error.message;
    // });
  }

}
