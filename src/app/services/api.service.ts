import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { SigninResponse } from '../interfaces/signin-response';
import { ApiResponse } from '../interfaces/api-response';
import {environment} from "../../environments/environment";
import {Params} from "@angular/router";

@Injectable()
export class ApiService {
  APIUrl: String = environment.apiUrl;

  constructor(
    private _http: HttpClient
  ) {
  }

  signinUser(client, data) {
    const options = {
      headers: new HttpHeaders()
    };
    const body = {
      client: client,
      email: data.email,
      password: data.password
    };
    options.headers.set('Content-Type', 'application/json');
    return this._http.post<SigninResponse>(this.APIUrl + '/users/authenticate', body, options);
  }

  resetInit(client, data) {
    const options = {
      headers: new HttpHeaders()
    };
    const body = {
      client: client,
      email: data.email,
    };
    options.headers.set('Content-Type', 'application/json');
    return this._http.post<ApiResponse>(this.APIUrl + '/users/reset', body, options);
  }

  verifyToken(user, token, type) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    const tokenType = type ? '?type=' + type : '';
    return this._http.get<ApiResponse>(this.APIUrl + '/users/' + user + '/authenticate' + tokenType, options);
  }

  resetUser(client, user, token, data) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    const body = {
      client: client,
      password: data.password,
      confirmPassword: data.confirmPassword
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/users/' + user + '/reset', body, options);
  }

  newUser(client, data) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    };
    const body = {
      client: client,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/users', body, options);
  }

  removeUser(user, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.delete<ApiResponse>(this.APIUrl + '/users/' + user + '?client=' + client, options);
  }

  getUser(client, user, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/users/' + user + '?client=' + client, options);
  }

  getUserHistory(client, user, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/users/' + user + '/history?client=' + client, options);
  }

  getUsers(page, limit, searchParam, client, filter, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
      params: new HttpParams()
        .set('offset', page)
        .set('client', client)
        .set('limit', limit)
        .set('s', searchParam)
        .set('filter', filter)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/users', options);
  }

  getUsersModules(page, limit, searchParam, client, filter, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
      params: new HttpParams()
        .set('offset', page)
        .set('client', client)
        .set('limit', limit)
        .set('s', searchParam)
        .set('filter', filter)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/users/modules', options);
  }

  inviteUser(body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/clients/' + body.client + '/invite', body, options);
  }

  searchLibraries(page, client, searchParam, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/libraries/search?s=' + searchParam + '&client=' + client + '&offset=' + page, options);
  }

  activateUser(client, user, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    const body = {
      client: client,
    };
    return this._http.patch<ApiResponse>(this.APIUrl + '/users/' + user + '/activate', body, options);
  }

  submitAnswer(question, client, quiz, token, answer) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    const body = {
      client: client,
      answer: answer,
      quiz: quiz
    };
    return this._http.patch<ApiResponse>(this.APIUrl + '/questions/' + question, body, options);
  }

  getModule(module, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/modules/' + module + '?client=' + client, options);
  }

  newTutorial(body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/tutorials', body, options);
  }

  editTutorial(id, body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
    };
    return this._http.patch<ApiResponse>(this.APIUrl + '/tutorials/' + id, body, options);
  }

  removeTutorial(tutorial, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.delete<ApiResponse>(this.APIUrl + '/tutorials/' + tutorial + '?client=' + client, options);
  }

  newVideo(body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/videos', body, options);
  }

  removeVideo(video, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.delete<ApiResponse>(this.APIUrl + '/videos/' + video + '?client=' + client, options);
  }

  newFile(body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/files', body, options);
  }

  removeFile(file, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.delete<ApiResponse>(this.APIUrl + '/files/' + file + '?client=' + client, options);
  }

  newUrl(body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/urls', body, options);
  }

  removeUrl(url, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.delete<ApiResponse>(this.APIUrl + '/urls/' + url + '?client=' + client, options);
  }

  newModule(body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/modules', body, options);
  }

  removeModule(module, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.delete<ApiResponse>(this.APIUrl + '/modules/' + module + '?client=' + client, options);
  }

  newQuiz(body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/quizzes', body, options);
  }

  newView(parent, module, type, token) {
    const body = {
      parent: parent._id,
      module: module._id,
      client: module.client._id,
      type: type
    };
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/views/', body, options);
  }

  updateQuiz(quiz, module, token) {
    console.log(quiz);
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
      params: new HttpParams()
        .set('client', module.client._id)
        .set('module', module._id)
        .set('type', quiz.type)
        .set('parent', quiz.parent)
    };
    return this._http.patch<ApiResponse>(this.APIUrl + '/quizzes/' + quiz._id, quiz, options);
  }

  submitQuiz(body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/quizzes/' + body.quiz._id, body, options);
  }

  removeQuiz(quiz, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
      params: new HttpParams()
        .set('client', client)
        .set('parent', quiz.parent)
        .set('type', quiz.type)
    };
    return this._http.delete<ApiResponse>(this.APIUrl + '/quizzes/' + quiz._id, options);
  }

  getWhatsNew(client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/clients/' + client + '/whats-new', options);
  }

  getLeaders(client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/clients/' + client + '/leaders', options);
  }

  getStatistics(client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/clients/' + client + '/statistics', options);
  }

  getQuiz(quiz, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/quizzes/' + quiz + '?client=' + client, options);
  }

  getTutorial(tutorial, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/tutorials/' + tutorial + '?client=' + client, options);
  }

  getClientModules(page, limit, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/clients/' + client + '/modules?offset=' + page, options);
  }

  getModulesStatistics(offset, limit, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
      params: new HttpParams()
        .set('offset', offset)
        .set('limit', limit)
        .set('client', client)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/modules/statistics', options);
  }

  verifyClient(client) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/clients/' + client + '/verify', options);
  }

  getClients(page, limit, searchParam, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/clients?offset=' + page + '&limit=' + limit + '&s=' + searchParam, options);
  }

  getClientVideos(client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/clients/' + client + '/videos', options);
  }

  getClientTutorials(client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.get<ApiResponse>(this.APIUrl + '/clients/' + client + '/tutorials', options);
  }

  newClient(body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.post<ApiResponse>(this.APIUrl + '/clients', body, options);
  }

  newNewsMessage(news, client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.patch<ApiResponse>(this.APIUrl + '/clients/' + client + '/news', {news: news}, options);
  }

  updateClient(id, body, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
    };
    return this._http.patch<ApiResponse>(this.APIUrl + '/clients/' + id, body, options);
  }

  removeClient(client, token) {
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    };
    return this._http.delete<ApiResponse>(this.APIUrl + '/clients/' + client, options);
  }

}
