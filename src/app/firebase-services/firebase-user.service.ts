import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { DateService } from './date.service';
import { FirebaseQuizService } from './firebase-quiz.service';
import { FirebaseClientService } from './firebase-client.service';
import { FirebaseModuleService } from './firebase-module.service';
import { FirebaseCloudFunctionService } from './firebase-cloud-function.service';


@Injectable()
export class FirebaseUserService {

  collectionRef: AngularFirestoreCollection<User> = null;
  items: Observable<User[]>;
  private basePath = '/users'

  constructor(public afs: AngularFirestore,
    private dateService: DateService,
    private quizService: FirebaseQuizService,
    private firebaseClientService: FirebaseClientService,
    private firebaseModuleservice: FirebaseModuleService,
    private firebaseCloudServicee: FirebaseCloudFunctionService,
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
    return new Promise((resolve, reject)=>{
      user.password = this.randomNumbers(6);
      this.firebaseCloudServicee.createUser(user).then((result: any) => {
        if(result.user) {
          user.isActivated = true;
          user.uid = result.user.uid;
         this.collectionRef.add(user).then((result)=>{
          resolve(result);
          }).catch((error)=>{
            reject(error);
          })
         
        }else{
          reject(result.error.message);
        }
      })
    })
    


    
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

  public getUsersForClient(client_id): Observable<any[]> {
    let uid = this.authService.uid;
    let collection = this.afs.collection(this.basePath, ref=>ref.where('client_id', '==', client_id) )
    .snapshotChanges().map(changes => {
      return changes.map( a=> {
        const data = a.payload.doc.data() as User;
        data._id = a.payload.doc.id;
        let clientObservable = this.firebaseClientService.getCurrentClient(data.client_id);
        return clientObservable.map(clientData=> Object.assign({}, { ...{client:clientData}, ...data }));
        
      })
    })
    return collection.mergeMap(observables => Observable.combineLatest(observables));
    
  }

  public getUsersForClientWithQuiz(client_id): Observable<any[]> {
    let uid = this.authService.uid;
    let collection = this.afs.collection(this.basePath, ref=>ref.where('client_id', '==', client_id) )
    .snapshotChanges().map(changes => {
      return changes.map( a=> {
        const data = a.payload.doc.data() as User;
        data._id = a.payload.doc.id;
        let clientObservable = this.firebaseClientService.getCurrentClient(data.client_id);
        let quizObservable = this.getCurrentUserQuizzes(data._id);
        const combinedData = Observable.combineLatest(clientObservable,quizObservable, (data1, data2) => {
          return { ...{ client: data1 },...{ quiz: data2 }};
        });
         return combinedData.map(subData => Object.assign({}, { ...subData, ...data }));
       
      })
    })
    return collection.mergeMap(observables => Observable.combineLatest(observables));
    
  }
  public getCurrentUserQuizzes(userId: string): Observable<any> {
    let uid = this.authService.uid;
    let collection = this.afs.collection(this.basePath+'/'+ userId +'/quizzes').snapshotChanges().map(changes => {
      if(changes.length == 0) {
        return Observable.of(undefined);
      }
      return changes.map( a=> {
        const data: any = a.payload.doc.data();
        data.dateCompleted = this.dateService.transform(data.dateCompleted);
        let quizDataObservable = this.firebaseModuleservice.getQuiz(data.client_id,
          data.module_id, data.type, data.type_id, data.quiz_id);
        //let quizDataObservable = this.quizService.getQuiz(data.quiz_id);
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
