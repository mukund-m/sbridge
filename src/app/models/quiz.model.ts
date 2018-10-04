import { Question } from './question.model';

export class Quiz {
  _id: any;
  slug: String;
  type: String;
  parent: any;
  title: String;
  passPercentage: Number;
  questions: Array<Question> = [];
  loading: Boolean = false;

  constructor(quiz) {
    quiz._id ? this._id = quiz._id : null;
    quiz.slug ? this.slug = quiz.slug : this.slug = null;
    quiz.title ? this.title = quiz.title : this.title = null;
    quiz.type ? this.type = quiz.type : null;
    this.passPercentage = quiz.passPercentage || '';
    if (quiz.questions) {
      for (const question of quiz.questions) {
        this.questions.push(new Question(question));
      }
    } else {
      this.questions.push(new Question({}));
    }
  }
}
