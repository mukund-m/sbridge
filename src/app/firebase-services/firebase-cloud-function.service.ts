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
}
