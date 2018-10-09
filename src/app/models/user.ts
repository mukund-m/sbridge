import {Client} from './client';
import {Module} from "./module";


export class User {
  _id: any;
  slug: String;
  points: any;
  level: any;
  email: String;
  role: String;
  firstName: String;
  lastName: String;
  profileImage: String;
  client_id: string;
  quizzesCompleted: Number;
  tutorialsAttempted: Number;
  videosAttempted: Number;
  creationDate: any;
  isActivated:  boolean;
  password: string;
  quizzes: any;
  modules: any[] = [];

  constructor(user) {
    user._id ? this._id = user._id : this._id = null;
    user.profileImage ? this.profileImage = user.profileImage : this.profileImage = '/assets/images/default-profile.jpg';
    user.slug ? this.slug = user.slug : this.slug = '';
    user.firstName ? this.firstName = user.firstName : this.firstName = 'First';
    user.lastName ? this.lastName = user.lastName : this.lastName = 'Last';
    user.points ? this.points = user.points : this.points = 0;
    user.level ? this.level = user.level : this.level = 0;
    user.role ? this.role = user.role : this.role = '';
    user.email ? this.email = user.email : this.email = '';
    user.creationDate ? this.creationDate = new Date(user.creationDate) : this.creationDate = null;
   // user.client_id ? this.client_id = new Client(user.client) : this.client_id = null;
    this.quizzesCompleted = user.quizzesCompleted || 0;
    this.tutorialsAttempted = user.tutorialsAttempted || 0;
    this.videosAttempted = user.videosAttempted || 0;
    this.modules = user.modules || [];

  }

  sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }
}
