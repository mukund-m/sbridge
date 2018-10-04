import { Injectable } from '@angular/core';
import { Timestamp } from '@firebase/firestore-types';
import { DatePipe } from '@angular/common';

@Injectable()
export class DateService {

  pipe: DatePipe = new DatePipe('en-US');
  constructor() { }

  transform(timeStamp: Timestamp) {
    try{
      return this.pipe.transform(timeStamp.toDate(), 'dd-MM-yyyy');
    }catch(ex) {
      return timeStamp;
    }
  }
  transformTime(timeStamp: Timestamp) {
    try{
      return this.pipe.transform(timeStamp.toDate(), 'dd-MM-yyyy hh:mm');
    }catch(ex) {
      return timeStamp;
    }
  }

  createDateFromTimeStamp(timeStamp: Timestamp) {
    try{
      return timeStamp.toDate();
    }catch(ex) {
      return timeStamp;
    } 
  }
}
