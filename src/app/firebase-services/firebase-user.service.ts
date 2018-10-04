import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { DateService } from './date.service';
import { FirebaseQuizService } from './firebase-quiz.service';
import { FirebaseClientService } from './firebase-client.service';

@Injectable()
export class FirebaseUserService {

  collectionRef: AngularFirestoreCollection<User> = null;
  items: Observable<User[]>;
  private basePath = '/users'

  constructor(public afs: AngularFirestore,
    private dateService: DateService,
    private quizService: FirebaseQuizService,
    private firebaseClientService: FirebaseClientService,
    private authService: AuthService) {
      this.collectionRef = this.afs.collection(this.basePath);
      this.items = this.collectionRef.snapshotChanges().map(changes => {
        return changes.map( a=> {
          const data = a.payload.doc.data() as User;
          data._id = a.payload.doc.id;
          return data;
        })
      })
     }


  public getCurrentUser(): Observable<User[]> {
    console.log('sabd')
    let uid = this.authService.uid;
    let collection = this.afs.collection(this.basePath , ref=> ref.where('uid','==', uid)).snapshotChanges().map(changes => {
      return changes.map( a=> {
        const data = a.payload.doc.data() as User;
        data._id = a.payload.doc.id;
        return data;
      })
    })
    return collection;
  }

  public addUser(user): Promise<any> {
    user.password = this.randomNumbers(4);
    user.isActivated = true;
    return this.collectionRef.add(user);
  }

  public getUser(user_id: string): Observable<User> {
    const document: AngularFirestoreDocument<User> = this.afs.doc(this.basePath+'/'+user_id);
    const document$: Observable<User> = document.valueChanges()
    return document$;
  }

  public update(fsKey: string, user): Promise<any> {
    const document: AngularFirestoreDocument<User> = this.afs.doc(this.basePath+'/'+fsKey);
    return document.update(user);
  }


  public delete(fskey: string): Promise<any> {
    const document: AngularFirestoreDocument<User> = this.afs.doc(this.basePath+'/'+fskey);
    return document.delete();
  }

  public getUsers(): Observable<any[]> {
    console.log('sabd')
    let uid = this.authService.uid;
    let collection = this.afs.collection(this.basePath ).snapshotChanges().map(changes => {
      return changes.map( a=> {
        const data = a.payload.doc.data() as User;
        data._id = a.payload.doc.id;
        let clientObservable = this.firebaseClientService.getCurrentClient(data.client_id);
        return clientObservable.map(clientData=> Object.assign({}, { ...{client:clientData}, ...data }));
        
      })
    })
    return collection.mergeMap(observables => Observable.combineLatest(observables));
    
  }

  public getCurrentUserQuizzes(userId: string): Observable<any> {
    let uid = this.authService.uid;
    let collection = this.afs.collection(this.basePath+'/'+ userId +'/quizzes').snapshotChanges().map(changes => {
      return changes.map( a=> {
        const data: any = a.payload.doc.data();
        data.dateCompleted = this.dateService.transform(data.dateCompleted);
        let quizDataObservable = this.quizService.getQuiz(data.quiz_id);
        return quizDataObservable.map(quizData=> Object.assign({}, { ...{quiz:quizData}, ...data }));
      })
    })
    return collection.mergeMap(observables => Observable.combineLatest(observables));
  }

  private randomNumbers = (length) => {
    let chars = "0123456789";
    let randomstring = '';
    for (let i = 0; i < length; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }
}
