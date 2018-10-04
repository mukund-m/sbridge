import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Client } from '../models/client';

@Injectable()
export class FirebaseClientService {

  private basePath = '/clients'
  collectionRef: AngularFirestoreCollection<Client> = null;
  items: Observable<Client[]>;

  constructor(public afs: AngularFirestore) { 
     
      this.afs.firestore.settings({ timestampsInSnapshots: true });
      this.collectionRef = this.afs.collection(this.basePath);
      this.items = this.collectionRef.snapshotChanges().map(changes => {
        return changes.map( a=> {
          const data = a.payload.doc.data() as Client;
          data._id = a.payload.doc.id;
          return data;
        })
      })
    }

    public getAllClients(): Observable<Client[]> {
      let collection = this.afs.collection(this.basePath).snapshotChanges().map(changes => {
        return changes.map( a=> {
          const data = a.payload.doc.data() as Client;
          data._id = a.payload.doc.id;
          return data;
        })
      })
      return collection;
    }
  public getCurrentClient(client_id: string): Observable<Client> {
    const document: AngularFirestoreDocument<Client> = this.afs.doc(this.basePath+'/'+client_id);
    const document$: Observable<Client> = document.valueChanges()
    return document$;
  }

  public addClient(client: Client): Promise<any> {
    return this.collectionRef.add(client);
  }

  public updateClient(fsKey: string, client: Client): Promise<any> {
    const document: AngularFirestoreDocument<Client> = this.afs.doc(this.basePath+'/'+fsKey);
    return document.update(client);
  }

  delete(fskey: string): Promise<any> {
    const document: AngularFirestoreDocument<Client> = this.afs.doc(this.basePath+'/'+fskey);
    return document.delete();
  }
}
