import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { UIService } from './ui.service';
import { IUser } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<IUser | null>;
  userData: any;

  constructor(
    private router: Router,
    private uiService: UIService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', null);
      }
    });
    this.currentUser = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.doc<IUser>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }));
  }

  signup(name: string, email: string, phone: string, password: string) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const userRef: AngularFirestoreDocument<IUser> = this.db.doc(`users/${user.user.uid}`);
        const updatedUser = {
          id: user.user.uid,
          email: user.user.email,
          name,
          phone,
          // tslint:disable-next-line:max-line-length
          photoUrl: 'https://firebasestorage.googleapis.com/v0/b/ng7-base-app.appspot.com/o/default_profile_pic.jpg?alt=media&token=cdde33a8-7142-4ea5-a00d-fb956844fd78'
        };
        userRef.set(updatedUser);
        this.uiService.loadingStateChanged.next(false);
        this.router.navigate(['/login']);
        this.uiService.showSnackbar('You have been successfully registered.', 'snack-success');
      })
      .catch(error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, 'snack-danger');
      });
  }

  login(email: string, password: string) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar('You have been successfully logged in.', 'snack-success');
      })
      .catch(error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, 'snack-danger');
      });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.uiService.showSnackbar('You have been logged out.', 'snack-success');
    });
  }
}
