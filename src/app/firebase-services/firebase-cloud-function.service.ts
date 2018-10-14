import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import {HttpParams} from "@angular/common/http";

@Injectable()
export class FirebaseCloudFunctionService {

  private baseUrl: string = 'https://us-central1-skillbridge-dev.cloudfunctions.net/skillbridge';
  constructor(private http: HttpClient,
    private afAuth: AngularFireAuth) { }

  public createUser(userDetails) {
    return new Promise((resolve, reject)=>{
      
      this.afAuth.idToken.subscribe((idToken)=>{ 
        const headers = new HttpHeaders({'Authorization':'Bearer ' + idToken});
        return this.http.post(this.baseUrl + '/createUser',userDetails, {headers}).subscribe((result)=>{
          resolve(result);
        })
      })
    })
  }
    public disableUser(uid) {
      return new Promise((resolve, reject)=>{
        
        this.afAuth.idToken.subscribe((idToken)=>{ 
          const headers = new HttpHeaders({'Authorization':'Bearer ' + idToken});
          return this.http.post(this.baseUrl + '/deActivate',{uid: uid}, {headers}).subscribe((result)=>{
            resolve(result);
          })
        })
      })
  }

  public deleteUser(id) {
    return new Promise((resolve, reject)=>{
      
      this.afAuth.idToken.subscribe((idToken)=>{ 
        const headers = new HttpHeaders({'Authorization':'Bearer ' + idToken});
        return this.http.post(this.baseUrl + '/deleteUser',{id: id}, {headers}).subscribe((result)=>{
          resolve(result);
        })
      })
    })
}

public deleteClientUsers(client_id) {
  return new Promise((resolve, reject)=>{
    
    this.afAuth.idToken.subscribe((idToken)=>{ 
      const headers = new HttpHeaders({'Authorization':'Bearer ' + idToken});
      return this.http.post(this.baseUrl + '/deleteClientsers',{client_id: client_id}, {headers}).subscribe((result)=>{
        resolve(result);
      })
    })
  })
}

  public uploadUsers(uploadObj) {
    return new Promise((resolve, reject)=>{
      
      this.afAuth.idToken.subscribe((idToken)=>{ 
        const headers = new HttpHeaders({'Authorization':'Bearer ' + idToken});
        return this.http.post(this.baseUrl + '/createUsers',uploadObj, {headers}).subscribe((result)=>{
          resolve(result);
        })
      })
    })
  
}
}
