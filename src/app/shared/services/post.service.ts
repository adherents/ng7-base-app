import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UIService } from './ui.service';

import { IPost } from '../models/post.interface';
import { IUser } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postsCollection: AngularFirestoreCollection<IPost>;
  postDoc: AngularFirestoreDocument<IPost>;
  currentUser: IUser;
  userId: string = null;

  constructor(
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private uiService: UIService
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.postsCollection = this.afStore.collection(`users/${this.userId}/posts`, ref => ref.orderBy('published', 'desc'));
      } else {
        this.userId = null;
      }
    });
  }

  getPosts() {
    return this.postsCollection.snapshotChanges().pipe(map(acttions => {
      return acttions.map(a => {
        const data = a.payload.doc.data() as IPost;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    }));
  }

  getPostData(id: string) {
    if (this.userId == null) {
      this.uiService.showSnackbar('This post does not belongs to you.', 'snack-danger');
      this.router.navigate(['/blog']);
    }
    this.postDoc = this.afStore.doc<IPost>(`users/${this.userId}/posts/${id}`);
    return this.postDoc.valueChanges();
  }

  getPost(id: string) {
    return this.afStore.doc<IPost>(`users/${this.userId}/posts/${id}`);
  }

  create(data: IPost) {
    this.postsCollection.add(data);
  }

  delete(id: string) {
    return this.getPost(id).delete();
  }

  update(id: string, formData) {
    return this.getPost(id).update(formData);
  }
}
