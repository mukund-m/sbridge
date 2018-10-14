import { first, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { auth, UserInfo } from 'firebase/app';
import { InitFirestore } from '../utilities/init-firestore';
import { AuthenticationService } from './authentication.service';
import { User } from '../models/user';
import { Client } from '../models/client';
import { FirebaseUserService } from '../firebase-services/firebase-user.service';
import { FirebaseClientService } from '../firebase-services/firebase-client.service';
import { ThemeService } from './theme.service';

@Injectable()
export class AuthService {

  public authenticated: boolean = false;
  public currentUser: User;
  public currentClient: Client;
  public uid: string = null;
  public  loggedInSubject: Subject<boolean> = new Subject()

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private authenticationService: AuthenticationService,
    private firebaseClientService: FirebaseClientService,
    private router: Router) {
    InitFirestore.init()
      this.afAuth.auth.onAuthStateChanged(user=>{
        this.verifyLogin(user);
      })
  }


  isLoggedIn() {
    let promise: Promise<any> = this.afAuth.authState.pipe(first()).toPromise();
    promise.then((user) => {
      
    })
    return promise;
  }




  signIn(email: string, password: string): Promise<any> {
    let promise: Promise<any> = this.afAuth.auth.signInWithEmailAndPassword(email, password)
    promise.then((user) => {
     
    }).catch((error) => {
      console.log(error);
    })
    return promise;
  }

  verifyLogin(user) {
    if(user) {
      if(user.emailVerified) {
        this.uid = user.uid;
        this.authenticationService.isLoggedIn = true;
        this.authenticated = true;
        this.getCurrentUser().subscribe((users: User[]) => {
          this.currentUser = users[0];
          this.authenticationService.user = this.currentUser;
          this.loggedInSubject.next(true);
          this.firebaseClientService.getCurrentClient(this.currentUser.client_id).subscribe((client) => {
            this.currentClient = client;
            this.authenticationService.client = client;
           // this.themeservice.initialize(client);
          })
        })
      }else {
        user.sendEmailVerification();
        this.logOut();
      }
    } else{

      this.authenticated = false;
      this.uid = undefined;
      this.authenticationService.isLoggedIn = true;
    }
  }
  loginWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }

  logOut() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.authenticated = false;
        this.uid = undefined;
        this.loggedInSubject.next(false);
        this.authenticationService.isLoggedIn = false;
        window.location.href = '/signin';
      });
  }


  signUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }



  updatePassword(newPassWord: string) {
    if (this.afAuth.auth.currentUser) {
      return this.afAuth.auth.currentUser.updatePassword(newPassWord);
    }
  }

  sendPasswordResetEmail(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  getCurrentUser(): Observable<User[]> {
    console.log('sabd')
    let uid = this.uid;
    let collection = this.afs.collection('/users', ref => ref.where('uid', '==', uid)).snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as User;
        data._id = a.payload.doc.id;
        return data;
      })
    })
    return collection;
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
  }


}
