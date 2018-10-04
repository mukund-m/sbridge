export class Question {
  _id: any;
  content: String;
  type: String;
  options: Array<String> = [];
  correctAnswer: any;
  providedAnswer: any = '';
  pointValue: Number;

  constructor(question) {
    this._id = question._id || null;
    this.content = question.content || '';
    this.type = question.type || '';
    this.correctAnswer = question.correctAnswer || '';
    this.pointValue = question.pointValue || null;
    this.options = question.options || null;
  }
}
