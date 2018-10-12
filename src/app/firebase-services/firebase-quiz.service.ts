import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Client } from '../models/client';
import { Quiz } from '../models/quiz.model';
import { FirebaseUserService } from './firebase-user.service';


@Injectable()
export class FirebaseQuizService {

  constructor(public afs: AngularFirestore,
    private authService: AuthService ) { }

  private basePath = '/quizzes'

 

  public submitQuiz(quiz, client_id, module_id, type, type_id) {
    return new Promise((resolve, reject) => {
      let subscription = this.authService.getCurrentUser().subscribe((users) => {
        subscription.unsubscribe();
        if(users[0]) {
          let correctAnswers = 0;
          let pointScore = 0;
          let totalScore = 0;
          let extraPoints = 0;
          let validated = false;
          let path = '/users/'+users[0]._id+'/quizzes';
          for (const question of quiz.questions) {
            totalScore += question.pointScore;
            if (question.providedAnswer && question.correctAnswer === question.providedAnswer) {
                correctAnswers++;
                pointScore += question.pointValue;
            }
        }
        if ((correctAnswers / quiz.questions.length * 100) >= quiz.passPercentage) {
          validated = true;
        }
        subscription = this.getUserQuiz(quiz._id, users[0]._id).subscribe((prevQuizzes) => {
          subscription.unsubscribe();
          if(prevQuizzes && prevQuizzes[0]) {
            let userQuizResult = prevQuizzes[0];
            extraPoints = pointScore > userQuizResult.pointScore ? pointScore - userQuizResult.pointScore : 0;
            pointScore = pointScore > userQuizResult.pointScore ? pointScore : userQuizResult.pointScore;
            const newScore = userQuizResult.pointScore;
            userQuizResult.correctAnswers = correctAnswers;
            userQuizResult.percentageCorrect =  correctAnswers / quiz.questions.length * 100;
            userQuizResult.validated = validated;
            userQuizResult.pointScore = pointScore;
            userQuizResult.dateCompleted = Date.now();
            if(users[0].role != 'administrator' && users[0].role != 'client') {
              this.updateUserQuiz(userQuizResult, users[0]._id, userQuizResult._id).then(()=>{
                let user = users[0];
                if(!user.points) {
                  user.points = 0;
                }
                user.points = user.points + extraPoints;
                const document: AngularFirestoreDocument<User> = this.afs.doc('users'+'/'+users[0]._id);
                document.update(user).then(()=>{
                  resolve(userQuizResult);
                }).catch((error)=>{
                  reject(error);
                })
                
              }).catch((error)=>{
                reject(error);
              })
            } else {
              resolve(userQuizResult);
            }
            
          } else {
            const userQuizObject = {
              user: users[0]._id,
              quiz_id: quiz._id,
              correctAnswers: correctAnswers,
              percentageCorrect: correctAnswers / quiz.questions.length * 100,
              validated: validated,
              pointScore: pointScore,
              dateCompleted: Date.now(),
              client_id: client_id,
              module_id: module_id,
              type: type,
              type_id: type_id
          };
          if(users[0].role != 'administrator' && users[0].role != 'client') {
            this.addToUserQuiz(userQuizObject, users[0]._id).then(()=>{
              let user = users[0];
              if(!user.points) {
                user.points = 0;
              }
                user.points = user.points + pointScore;
                const document: AngularFirestoreDocument<User> = this.afs.doc('users'+'/'+users[0]._id);
                document.update(user).then(()=>{
                  resolve(userQuizObject);
                }).catch((error)=>{
                  reject(error);
                })
                
            }).catch((error)=>{
              reject(error);
            })
          }else {
            resolve(userQuizObject);
          }
          
          }
        })
        }
      })
    });
    
  }

  public getUserQuiz(quiz_id, user_id) {
    let path = '/users/'+user_id+'/quizzes';
    let collection = this.afs.collection(path , ref=> ref.where('quiz_id','==', quiz_id)).snapshotChanges().map(changes => {
      return changes.map( a=> {
        const data = a.payload.doc.data() as any;
        data._id = a.payload.doc.id;
        return data;
      })
    })
    return collection;
  }

  public addToUserQuiz(userQuiz, user_id) {
    let path = '/users/'+user_id+'/quizzes';

    let collectionRef = this.afs.collection(path);
    return collectionRef.add(userQuiz);
  }

  public getLeaderBoard(client_id: string) {
    let collection = this.afs.collection('users', ref=>ref.where('client_id', '==', client_id).orderBy('points', 'desc' ).limit(10)
     ).snapshotChanges().map(changes => {
      return changes.map( a=> {
        const data = a.payload.doc.data() as User;
        data._id = a.payload.doc.id;
        return data;
      })
    });
    return collection;
  }

  public updateUserQuiz(userQuiz, user_id, user_quiz_id) {
    let path = '/users/'+user_id+'/quizzes/'+user_quiz_id;
    const document: AngularFirestoreDocument<User> = this.afs.doc(path);
    return document.update(userQuiz);
  }

}
