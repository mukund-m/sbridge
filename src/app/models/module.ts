import { Tutorial } from './tutorial';
import { Video } from './video';
import { Quiz } from './quiz.model';
import {Client} from "./client";
import {Url} from "./url";
import {File} from "./file";

export class Module {
  _id: any;
  client: Client;
  slug: String;
  title: String;
  featureImage: String;
  tutorials: Array<Tutorial> = [];
  videos: Array<Video> = [];
  urls: Array<Url> = [];
  files: Array<File> = [];
  quizzes: Array<Quiz> = [];
  isExpanded: Boolean = false;
  isValidated: Boolean = false;
  validationGrade: Number = 0;
  meanGrade: Number = 0;
  createdAt: any;

  constructor(module) {
    this.isValidated = module.isValidated;
    this.meanGrade = module.meanGrade || 0;
    module._id ? this._id = module._id : this._id = '';
    module.slug ? this.slug = module.slug : this.slug = '';
    module.title ? this.title = module.title : this.title = '';
    module.featureImage ? this.featureImage = module.featureImage : this.featureImage = '/assets/images/default-module-image.jpg';
    if (module.client) {
      if (module.client instanceof Client) {
        this.client = new Client(module.client);
      } else {
        this.client = module.client;
      }
    }
    if (module.tutorials && module.tutorials.length) {
      for (const tutorial of module.tutorials) {
        this.tutorials.push(new Tutorial(tutorial));
      }
    }
    if (module.urls && module.urls.length) {
      for (const url of module.urls) {
        this.urls.push(new Url(url));
      }
    }
    if (module.files && module.files.length) {
      for (const file of module.files) {
        this.files.push(new File(file));
      }
    }
    if (module.videos && module.videos.length) {
      for (const video of module.videos) {
        this.videos.push(new Video(video));
      }
    }
    if (module.quizzes && module.quizzes.length) {
      for (const quiz of module.quizzes) {
        this.quizzes.push(new Quiz(quiz));
      }
    }
  }
}
