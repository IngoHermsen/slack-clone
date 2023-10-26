import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as auth from 'firebase/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../models/user.class';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  userSpecValues: any;
  noMatchingData: Subject<boolean> = new Subject;
  verificationMailSent: Subject<boolean> = new Subject;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.UpdateUserData(user);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.UpdateUserData(result.user);

        this.afAuth.authState.subscribe((user) => {
          if (user && user.emailVerified) {
            this.router.navigate(['threads']);
          }
        });
      })
      .catch((error) => {

        this.noMatchingData.next(true);
        setTimeout(() => {
          this.noMatchingData.next(false)
        }, 8000)
      });
  }

  // Sign up with email/password
  SignUp(formData: any) {
    return this.afAuth
      .createUserWithEmailAndPassword(formData.email, formData.password)
      .then((result) => {
        this.router.navigate(['auth/login']);
        /* Call the SendVerificationMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(
          result.user,
          formData.firstName,
          formData.lastName,
          formData.initials,
        );
      })
      .catch((error) => {
        window.alert(error.message);
      })
  }

  // Sign in with Google
  GoogleAuth() {

    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['threads']);
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);
        this.UpdateUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Send email verification when new user signs up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.verificationMailSent.next(true)
      });
  }

  
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(
    user: any,
    firstName: string,
    lastName: string,
    initials: string,
  ) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    const userData: User = {
      uid: user.uid,
      firstName: firstName,
      lastName: lastName,
      initials: initials,
      email: user.email,
      displayName: `${firstName} ${lastName}`,
      emailVerified: user.emailVerified,
      userImgUrl: './assets/avatar.png',
    };

    this.userData = userData;
    localStorage.setItem('user', JSON.stringify(userData))

    return userRef.set(userData, {
      merge: true,
    });
  }

  UpdateUserData(
    user: any,
    displayName?: string,
    userImgUrl?: string,
  ) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    userRef.get().subscribe(ref => {
      const userDocData: any = ref.data();      
      const userData: User = {
        uid: user.uid,
        firstName: userDocData.firstName,
        lastName: userDocData.lastName,
        initials: userDocData.initials,
        email: userDocData.email,
        displayName: displayName || userDocData.displayName,
        emailVerified: user.emailVerified,
        userImgUrl: userImgUrl || userDocData.userImgUrl
      };

      this.userData = userData;
      localStorage.setItem('user', JSON.stringify(userData))

      return userRef.set(userData, {
        merge: true,
      });
    })
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {

      localStorage.removeItem('user');
      this.router.navigate(['auth/login']);
    });
  }
}

