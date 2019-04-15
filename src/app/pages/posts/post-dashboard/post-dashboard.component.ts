import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PostService } from 'src/app/shared/services/post.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UIService } from 'src/app/shared/services/ui.service';
import { IUser } from 'src/app/shared/models/user.interface';
import { IPost } from 'src/app/shared/models/post.interface';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.scss']
})
export class PostDashboardComponent implements OnInit {
  content: string;
  image: string;
  title: string;
  currentUser: IUser = null;
  uploadPercentage: Observable<number>;
  downloadUrl: Observable<string>;

  constructor(
    private postService: PostService,
    private fs: AngularFireStorage,
    private authService: AuthService,
    private uiService: UIService
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  createPost() {
    const postData: IPost = {
      author: this.currentUser.name,
      authorId: this.currentUser.id,
      content: this.content,
      image: this.image,
      published: new Date(),
      title: this.title
    };

    this.postService.create(postData);

    this.uploadPercentage = null;
    this.uiService.showSnackbar('Post was successfully created.', 'snack-success');
  }

  uploadImage(event) {
    const file = event.target.files[0];
    const path = `posts/${file.name}`;
    const ref = this.fs.ref(path);
    const task = this.fs.upload(path, file);

    this.uploadPercentage = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadUrl = ref.getDownloadURL();
        this.downloadUrl.subscribe(url => {
          this.image = url;
        });
      }
    )).subscribe();
  }
}
