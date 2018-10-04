import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Module } from '../models/module';
import { Client } from '../models/client';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { DateService } from './date.service';
import { FirebaseQuizService } from './firebase-quiz.service';
import { FirebaseClientService } from './firebase-client.service';
import { Video } from '../models/video';
import { Tutorial } from '../models/tutorial';
import { Url } from '../models/url';
import { Quiz } from '../models/quiz.model';
import { Question } from '../models/question.model';

@Injectable()
export class FirebaseModuleService {



  constructor(public afs: AngularFirestore,
    private dateService: DateService,
    private quizService: FirebaseQuizService,
    private firebaseClientService: FirebaseClientService,
    private authService: AuthService) {

  }


  /**
   * ADDS
   */

  public addModule(client_id: string, module: Module): Promise<any> {
    let collectionRef = this.afs.collection('clients/' + client_id + '/modules');
    return collectionRef.add(module);
  }

  public deleteModule(client_id: string, module_id: string): Promise<any> {
    let collectionRef = this.afs.collection('clients/' + client_id + '/modules');
    const document: AngularFirestoreDocument<Module> = this.afs.doc('clients/' + client_id + '/modules' + '/' + module_id);
    return document.delete();
  }

  public addTutorial(client_id, module_id, tutorial) {
    let collectionRef = this.afs.collection('clients/' + client_id + '/modules/' + module_id + '/tutorials');
    return collectionRef.add(tutorial);
  }

  public addVideo(client_id, module_id, video) {
    let collectionRef = this.afs.collection('clients/' + client_id + '/modules/' + module_id + '/videos');
    return collectionRef.add(video);
  }

  public addUrls(client_id, module_id, urlObj) {
    let collectionRef = this.afs.collection('clients/' + client_id + '/modules/' + module_id + '/urls');
    return collectionRef.add(urlObj);
  }

  public addQuiz(client_id, module_id, type, type_id, quiz) {
    let newQuiz = {
      loading: quiz.loading,
      parent: quiz.parent,
      passPercentage: quiz.passPercentage,
      slug: quiz.slug,
      title: quiz.title,
      type: quiz.type
    }
    if (type == 'video') {
      type = 'videos';
    }
    if (type == 'url') {
      type = 'urls';
    }
    if (type == 'tutorial') {
      type = 'tutorials';
    }
    let collectionRef = this.afs.collection('clients/' + client_id + '/modules/' + module_id + '/' + type + '/' + type_id + '/quiz');
    return collectionRef.add(newQuiz);
  }

  public addQuestionToQuiz(client_id, module_id, type, type_id, quiz_id, question) {
    if (type == 'video') {
      type = 'videos';
    }
    if (type == 'url') {
      type = 'urls';
    }
    if (type == 'tutorial') {
      type = 'tutorials';
    }

    let newQuiz = {
      content: question.content,
      correctAnswer: question.correctAnswer,
      pointValue: question.pointValue,
      providedAnswer: question.providedAnswer,
      type: question.type,
      _id: question._id,
      options: question.options
    }
    let collectionRef = this.afs.collection('clients/' + client_id + '/modules/' + module_id + '/' + type + '/' + type_id + '/quiz/' + quiz_id + '/questions');
    return collectionRef.add(newQuiz);
  }

  /**
   * GETS
   */

   
  public getModules(client_id): Observable<Module[]> {
    let collection = this.afs.collection('clients/' + client_id + '/modules').snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Module;
        data._id = a.payload.doc.id;
         let videoObservable = this.getVideos(client_id, data._id);
         let tutorialObservable = this.getTutorials(client_id, data._id);
        // let UrlObservable = this.getUrls(client_id, data._id);
        //  const combinedData = Observable.combineLatest(videoObservable, tutorialObservable, UrlObservable, (data1, data2, data3) => {
        //    return { ...{ videos: data1 }, ...{ tutorials: data2 }, ...{ urls: data3 } };
        //  });
        const combinedData = Observable.combineLatest(videoObservable,tutorialObservable, (data1, data2) => {
          return { ...{ videos: data1 },...{ tutorials: data2 }};
        });
         return combinedData.map(subData => Object.assign({}, { ...subData, ...data }));
        //return data;
      })
    })
    return collection.mergeMap(observables => Observable.combineLatest(observables));
   //return collection;
  }

  public getAllModules(): Observable<any> {
    let collection = this.afs.collection('clients').snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Client;
        data._id = a.payload.doc.id;
        let moduleObservable = this.getModules(data._id);

        return moduleObservable.map(clientData => Object.assign({}, { ...{ modules: clientData }, ...data }));

      })
    })
    return collection.mergeMap(observables => Observable.combineLatest(observables));
  }

  public getVideos(client_id, module_id): Observable<Video[]> {
    let collection = this.afs.collection('clients/' + client_id + '/modules/' + module_id + '/videos').snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Video;
        data._id = a.payload.doc.id;
        let quizObservable = this.getQuizzes(client_id, module_id, 'videos', data._id);
        return quizObservable.map(questions => Object.assign({}, { ...{ quiz: questions[0] }, ...data }));

      })
    })
    return collection.mergeMap(observables => Observable.combineLatest(observables));
  }

  public getTutorials(client_id, module_id): Observable<Tutorial[]> {
    let collection = this.afs.collection('clients/' + client_id + '/modules/' + module_id + '/tutorials').snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Tutorial;
        data._id = a.payload.doc.id;
        let quizObservable = this.getQuizzes(client_id, module_id, 'tutorials', data._id);
        return quizObservable.map(questions => Object.assign({}, { ...{ quiz: questions[0] }, ...data }));

      })
    })
    return collection.mergeMap(observables => Observable.combineLatest(observables));
  }

  public getUrls(client_id, module_id): Observable<Url[]> {
    let collection = this.afs.collection('clients/' + client_id + '/modules/' + module_id + '/urls').snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Url;
        data._id = a.payload.doc.id;
        let quizObservable = this.getQuizzes(client_id, module_id, 'urls', data._id);
        return quizObservable.map(questions => Object.assign({}, { ...{ quiz: questions[0] }, ...data }));

      })
    })
    return collection.mergeMap(observables => Observable.combineLatest(observables));
  }

  public getQuizzes(client_id: string, module_id: string, type: string, type_id) {
    let path = 'clients/' + client_id + '/modules/' + module_id + '/' + type + '/' + type_id + '/quiz';
    let collection = this.afs.collection(path).snapshotChanges().map(changes => {
      if(changes.length == 0) {
        
        return Observable.of(undefined);
      }
      return changes.map(a => {
        const data = a.payload.doc.data() as Client;
        data._id = a.payload.doc.id; 
        let questionsObservable = this.getQuestions(client_id, module_id, type, type_id, data._id);

        return questionsObservable.map(questions => Object.assign({}, { ...{ questions: questions }, ...data }));

      })
      
    })
    return collection.mergeMap(observables => Observable.combineLatest(observables));
  }

  public getQuiz(client_id: string, module_id: string, type: string, type_id, quiz_id) {
    let path = 'clients/' + client_id + '/modules/' + module_id + '/' + type + '/' + type_id + '/quiz/'+quiz_id;
    const document: AngularFirestoreDocument<Quiz> = this.afs.doc(path);
    const document$: Observable<Quiz> = document.valueChanges()
    return document$;
  }
  

  public getQuestions(client_id: string, module_id: string, type: string, type_id, quiz_id) {
    let path = 'clients/' + client_id + '/modules/' + module_id + '/' + type + '/' + type_id + '/quiz/' + quiz_id + '/questions';
    let collection = this.afs.collection(path).snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Question;
        data._id = a.payload.doc.id;
        return data;
      })
    })
    return collection;
  }

  /**
   * DELETES
   */

  public deleteVideo(client_id, module_id, video_id): Promise<any> {
    const document: AngularFirestoreDocument<Module> =
      this.afs.doc('clients/' + client_id + '/modules' + '/' + module_id + '/videos/' + video_id);
    return document.delete();
  }

  public deleteTutorial(client_id, module_id, tutorial_id): Promise<any> {
    const document: AngularFirestoreDocument<Module> =
      this.afs.doc('clients/' + client_id + '/modules' + '/' + module_id + '/tutorials/' + tutorial_id);
    return document.delete();
  }


  public deleteUrl(client_id, module_id, url_id): Promise<any> {
    const document: AngularFirestoreDocument<Module> =
      this.afs.doc('clients/' + client_id + '/modules' + '/' + module_id + '/urls/' + url_id);
    return document.delete();
  }
}
