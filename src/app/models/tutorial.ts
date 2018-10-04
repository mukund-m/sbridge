import {Module} from './module';
import {Quiz} from "./quiz.model";

export class Tutorial {
  _id: any;
  slug: String;
  title: String;
  featureImage: String;
  heroImage: String;
  content: String;
  quiz: Quiz;
  module: any;

  constructor(tutorial) {
    tutorial._id ? this._id = tutorial._id : this._id = '';
    tutorial.title ? this.title = tutorial.title : this.title = '';
    tutorial.slug ? this.slug = tutorial.slug : this.slug = '';
    tutorial.content ? this.content = tutorial.content : this.content = '';
    tutorial.featureImage ? this.featureImage = tutorial.featureImage : this.featureImage = '/assets/images/default-tutorial-image.png';
    tutorial.heroImage ? this.heroImage = tutorial.heroImage : this.featureImage = null;
    tutorial.module ? this.module = tutorial.module : this.module = '';
    if (tutorial.quiz) {
      this.quiz = new Quiz(tutorial.quiz);
    }
  }
}
