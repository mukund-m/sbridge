import {Quiz} from "./quiz.model";

export class Url {
  _id: any;
  title: String;
  url: String;
  module: any;
  quiz: Quiz;

  constructor(url) {
    url._id ? this._id = url._id : this._id = '';
    url.title ? this.title = url.title : this.title = '';
    url.url ? this.url = url.url : this.url = '';
    url.module ? this.module = url.module : this.module = '';
    if (url.quiz) {
      this.quiz = new Quiz(url.quiz);
    }
  }
}
