import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isloggedIn = false;
  user;

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    /*************** check that user is loggedIn or not ***********************/
    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          console.log('yes')
          this.isloggedIn = true;
          this.getdata(); //if it is logged in then it will get the its data from firestore
        }
        else {
          console.log('not log in')
          this.isloggedIn = false;
        }
      }
    )

  }
  isLoggedIn(): Observable<boolean> {
    return of(this.isloggedIn);
  }
  /* ************************get data from firestore**************************** */
  getdata() {
    /*  this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            console.log(user.uid);
            return this.db.collection('Users').doc(user.uid).valueChanges()
          } else {
            return of(null)
          }
        })
      )*/

    this.afAuth.authState.subscribe(
      user => {
        if (user)
          this.user = this.db.collection('Users').doc(user.uid).valueChanges()
        else {
          return null
        }
      }
    )
  }
  /**************** it will create new user to firebase authentication*********************/
  createUser(value) {
    //this.afAuth.auth.createUserWithEmailAndPassword()  
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
          this.insertData(res.user, value);
        }, err => reject(err))
    })
  }
  /***************************It will store data of user afte successfully creating user***********/
  insertData(user, value) {
    //const userRef: AngularFirestoreDocument<any> = this.db.doc(`Users/${user.uid}`);
    const data: any = {
      uid: user.uid,
      email: user.email,
      firstName: value.firstName,
      lastName: value.lastName,
    }
    //userRef.set(data, { merge: true })
    this.db.collection('Users').doc(user.uid).set(data)
  }
  /**************************It will help for signin user************************* */
  login(user) {
    //this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password);
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(user.username, user.pwd)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }

  logOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        })
    })
  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }
}
