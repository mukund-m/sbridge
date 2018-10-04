import {Module} from './module';
import {Quiz} from "./quiz.model";

export class Video {
  _id: any;
  title: String;
  youtubeId: String;
  module: any;
  featureImage: String;
  quiz: Quiz;

  constructor(video) {
    video._id ? this._id = video._id : this._id = '';
    video.title ? this.title = video.title : this.title = '';
    video.youtubeId ? this.youtubeId = video.youtubeId : this.youtubeId = '';
    video.module ? this.module = video.module : this.module = '';
    video.featureImage ? this.featureImage = video.featureImage : this.featureImage = '';
    if (video.quiz) {
      this.quiz = new Quiz(video.quiz);
    }
  }
}
