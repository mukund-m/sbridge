import { Component, OnInit } from '@angular/core';
import {Quiz} from "../../../models/quiz.model";
import {ApiService} from "../../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {ClientService} from "../../../services/client.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ApiResponse} from "../../../interfaces/api-response";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Question} from "../../../models/question.model";
import {ThemeService} from "../../../services/theme.service";
import {QuizService} from "../../../services/quiz.service";
import {NavigationService} from "../../../services/navigation.service";
import { FirebaseModuleService } from '../../../firebase-services/firebase-module.service';
import { FirebaseQuizService } from '../../../firebase-services/firebase-quiz.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-page-quiz',
  templateUrl: './page-quiz.component.html',
  styleUrls: ['./page-quiz.component.scss']
})
export class PageQuizComponent implements OnInit {
  isEditting: Boolean = false;
  loading: Boolean = false;
  failure: Boolean = false;
  loadingStatus: String = '';
  resultMessage = '';
  resultPercentage: any = 0;
  passedMessage: Boolean = false;
  failedMessage: Boolean = false;
  route: any;
  quiz: Quiz = new Quiz({});
  finalized: Boolean = false;
  totalAnswers: any = 0;
  currentQuestion: any = 0;
  $currentQuestion: BehaviorSubject<Question> = new BehaviorSubject(new Question({}));
  quizSuccess: Boolean = false;
  quizFailure: Boolean = false;
  feedback: string = undefined;
  feedbackClicked: boolean = false;
  feedbackProvided: boolean = false;

  constructor(
    private _APIService: ApiService,
    private _activatedRoute: ActivatedRoute,
    private _route: ActivatedRoute,
    public clientService: ClientService,
    public quizService: QuizService,
    public themeService: ThemeService,
    public sanitizer: DomSanitizer,
    public navigationService: NavigationService,
    private firebaseModuleService: FirebaseModuleService,
    private firebaseQuizService: FirebaseQuizService,
    private authenticationService: AuthenticationService
  ) {
    navigationService.isDashboard = true;
  }

  ngOnInit() {
    this.loadingStatus = 'Loading the quiz...';
    this.loading = true;
    this._route.params.subscribe(params => {
      this.route = params['id'];
      this._route.queryParams.subscribe((queryParams)=> {
        this.firebaseModuleService.getQuiz(queryParams.client, queryParams.module, queryParams.type, queryParams.type_id, this.route )
        .subscribe((quiz) => {
          this.firebaseModuleService.getQuestions(queryParams.client, queryParams.module, queryParams.type, queryParams.type_id, this.route)
          .subscribe((questions) => {
            quiz.questions = questions;
            this.loading = false;
            quiz._id = this.route;
            this.quiz = quiz;

          })
          
        })
      })
    });
  }

  nextQuestion() {
    this.currentQuestion++;
    if (this.currentQuestion === this.quiz.questions.length) {
      this.quiz.loading = true;
      this.loadingStatus = 'Submitting your answers...';
      this.submitQuiz();
    }
  }

  resetQuiz() {
    this.loadingStatus = 'Reloading the quiz...';
    this.loading = true;
    this.quizSuccess = false;
    this.quizFailure = false;
    this.finalized = false;
    this.currentQuestion = 0;
    this._route.params.subscribe(params => {
      this.route = params['id'];
      this._route.queryParams.subscribe((queryParams)=> {
        this.firebaseModuleService.getQuiz(queryParams.client, queryParams.module, queryParams.type, queryParams.type_id, this.route )
        .subscribe((quiz) => {
          this.firebaseModuleService.getQuestions(queryParams.client, queryParams.module, queryParams.type, queryParams.type_id, this.route)
          .subscribe((questions) => {
            quiz.questions = questions;
            this.loading = false;
            quiz._id = this.route;
            this.quiz = quiz;

          })
          
        })
      })
    });
  }

  submitQuiz() {
    this.quizFailure = false;
    this.quizSuccess = false;
    let client = this.clientService.currentClient._id;
    if (this._activatedRoute.queryParams['client']) {
      client = this._activatedRoute.queryParams['client'];
    }
    this._route.queryParams.subscribe((queryParams)=> {
      this.firebaseQuizService.submitQuiz(this.quiz, queryParams.client, queryParams.module,
        queryParams.type, queryParams.type_id).then((result:any)=>{
          this.finalized = true;
          this.totalAnswers = result.correctAnswers;
          this.resultPercentage = result.percentageCorrect;
          this.quiz.loading = false;
          result.validated ? this.quizSuccess = true : this.quizFailure = true;
          this.resultMessage = 'Quiz submitted successfully!!';
        }).catch((error)=>{
          this.finalized = true;
          this.quiz.loading = false;
          this.resultMessage = error;
        })
    })

    
  }

  submitAnswer(answer) {

  }

  sendFeedback() {
    this._route.queryParams.subscribe((queryParams)=> {
      this.firebaseModuleService.addFeedback(queryParams.client, queryParams.module,
        queryParams.type, queryParams.type_id, {
          feedback: this.feedback,
          user_id: this.authenticationService.user._id
        }).then(()=>{
          this.feedbackProvided = true;
        })  
    });
    
  }
}
