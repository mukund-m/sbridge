import {User} from "./user";
import {Question} from "./question.model";

export class PointHistory {
  _id: any;
  pointType: String;
  dateCreated: Date;
  question: Question;
  pointValue: Number;

  constructor(pointHistory) {
    this._id = pointHistory._id || null;
    this.pointType = pointHistory.pointType || 'question';
    this.dateCreated = new Date(pointHistory.dateCreated) || new Date();
    this.question = new Question(pointHistory.question);
    this.pointValue = pointHistory.pointValue || 0;
  }
}
