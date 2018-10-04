import { first, map }                   from 'rxjs/operators';
import { Injectable }                   from '@angular/core';
import { Observable,  ReplaySubject }   from 'rxjs';
import { Router }                       from '@angular/router';

import { AngularFireAuth }              from 'angularfire2/auth';
import { AngularFirestore }             from 'angularfire2/firestore';
import { auth }                         from 'firebase/app';
import { InitFirestore } from '../utilities/init-firestore';
import { AuthenticationService } from './authentication.service';
import { User } from '../models/user';
import { Client } from '../models/client';
import { FirebaseUserService } from '../firebase-services/firebase-user.service';
import { FirebaseClientService } from '../firebase-services/firebase-client.service';

@Injectable()
export class AuthService {

  public authenticated: boolean = false;
  public currentUser: User;
  public currentClient: Client;
  public uid: string = null;
  constructor(private afAuth:               AngularFireAuth,
              private afs:                  AngularFirestore,
              private authenticationService: AuthenticationService,
              private firebaseClientService: FirebaseClientService,
              private router:               Router) {
    InitFirestore.init()

  }

  
  isLoggedIn() {
    let promise: Promise<any> = this.afAuth.authState.pipe(first()).toPromise();
    promise.then((user)=> {
      this.uid = user.uid;
      this.authenticationService.isLoggedIn = true;
      this.authenticated = true;

      this.getCurrentUser().subscribe((users: User[]) => {
        this.currentUser = users[0];
        this.authenticationService.user = this.currentUser;
        this.firebaseClientService.getCurrentClient(this.currentUser.client_id).subscribe((client)=> {
          this.currentClient =client;
        })
      })
    })
    return promise;
  }


  

  signIn(email: string, password: string):  Promise<any> {
   let  promise: Promise<any> =  this.afAuth.auth.signInWithEmailAndPassword(email, password)
    this.getCurrentUser().subscribe((users: User[]) => {
      this.currentUser = users[0];
      this.authenticationService.user = this.currentUser;
      this.firebaseClientService.getCurrentClient(this.currentUser.client_id).subscribe((client)=> {
        this.currentClient =client;
      })
    })
   promise.then((user)=> {
     console.log(user);
     this.uid = user.user.uid;
     this.authenticationService.isLoggedIn = true;
    this.authenticated = true;
   }).catch(()=> {
    this.authenticated = false;
   })
   return promise;
  }

  loginWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }

  logOut() {
    this.afAuth.auth.signOut()
          .then(() => {
            this.authenticated = false;
             this.router.navigate(['/login']);
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
    let collection = this.afs.collection('/users' , ref=> ref.where('uid','==', uid)).snapshotChanges().map(changes => {
      return changes.map( a=> {
        const data = a.payload.doc.data() as User;
        data._id = a.payload.doc.id;
        return data;
      })
    })
    return collection;
  }

  
}
