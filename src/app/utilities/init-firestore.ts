import * as firebase from 'firebase';

export class InitFirestore {

  static init() {
    const firestore = firebase.firestore();

    const settings = {timestampsInSnapshots: true};

    firestore.settings(settings);
  }
}
