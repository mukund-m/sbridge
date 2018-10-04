import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Client } from '../models/client';
import { Quiz } from '../models/quiz.model';


@Injectable()
export class FirebaseQuizService {

  constructor(public afs: AngularFirestore,
    private authService: AuthService) { }

  private basePath = '/quizzes'

  public getQuiz(quiz_id: string): Observable<Quiz> {
    
    const document: AngularFirestoreDocument<Quiz> = this.afs.doc(this.basePath+'/'+quiz_id);
    const document$: Observable<Quiz> = document.valueChanges()
    return document$;
    
  }
}
