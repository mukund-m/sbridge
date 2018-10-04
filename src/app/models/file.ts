import {Quiz} from "./quiz.model";

export class File {
  _id: any;
  name: String;
  url: String;
  module: any;
  quiz: Quiz;

  constructor(file) {
    file._id ? this._id = file._id : this._id = '';
    file.name ? this.name = file.name : this.name = '';
    file.url ? this.url = file.url : this.url = '';
    file.module ? this.module = file.module : this.module = '';
    if (file.quiz) {
      this.quiz = new Quiz(file.quiz);
    }
  }
}
