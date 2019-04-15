import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';

import { IUser } from 'src/app/shared/models/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UIService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  currentUser: IUser = null;
  isLoading = true;
  avatarLoaded = false;
  downloadUrl: Observable<string>;
  uploadPercentage: Observable<number>;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private fs: AngularFireStorage,
    private db: AngularFirestore,
    private location: Location,
    private uiService: UIService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.isLoading = false;
        this.avatarLoaded = false;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  uploadImage(event) {
    const file = event.target.files[0];
    const filePath = `avatars/${file.name}_${this.currentUser.id}`;
    const task = this.fs.upload(filePath, file);
    const ref = this.fs.ref(filePath);

    this.uploadPercentage = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
       ref.getDownloadURL().subscribe(url => {
         this.downloadUrl = url;
         this.avatarLoaded = true;
       });
     })
    ).subscribe();
  }

  onSubmit() {
    let photo;
    if (this.downloadUrl) {
      photo = this.downloadUrl;
      this.uploadPercentage = null;
    } else {
      photo = this.currentUser.photoUrl;
    }

    const user = Object.assign({}, this.currentUser, {photoUrl: photo});
    const userRef: AngularFirestoreDocument<IUser> = this.db.doc(`users/${user.id}`);
    userRef.set(user);
    this.uiService.showSnackbar('Your profile was successfully updated!', 'snack-success');
    this.location.back();
  }
}
