import {PointHistory} from "./pointHistory.model";

export class PointHistoryDate {
  dateString: String = 'Today';
  pointHistory: Array<PointHistory> = [];

  constructor(date: Date) {
    this.generateDate(date);
  }

  generateDate(date: Date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (date.getTime() <= new Date().getTime() - 86400) {
      this.dateString = 'Today';
    } else if (date.getTime() <= new Date().getTime() - 604800) {
      this.dateString = 'Last 7 Days';
    } else {
      this.dateString = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }
  }

  addPointHistory(pointHistory) {
    this.pointHistory.push(new PointHistory(pointHistory));
  }
}
