import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class QuizService {

  constructor(
    private _apiService: ApiService,
    private _authenticationService: AuthenticationService
  ) { }

  newQuiz(body, client) {
    body.client = client;
    return this._apiService.newQuiz(body, this._authenticationService.getToken());
  }

  updateQuiz(quiz, module) {
    return this._apiService.updateQuiz(quiz, module, this._authenticationService.getToken());
  }

  submitQuiz(quiz, client) {
    const body = {
      client: client,
      quiz: quiz
    };
    return this._apiService.submitQuiz(body, this._authenticationService.getToken());
  }

  removeQuiz(quiz, client) {
    return this._apiService.removeQuiz(quiz, client, this._authenticationService.getToken());
  }
}
