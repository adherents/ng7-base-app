import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/shared/services/post.service';

import { IPost } from 'src/app/shared/models/post.interface';
import { UIService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Observable<IPost[]>;

  constructor(
    private postService: PostService,
    private uiService: UIService
  ) { }

  ngOnInit() {
    this.posts = this.postService.getPosts();
  }

  delete(id: string) {
    if (window.confirm('Are you sure you want to delete this post?')) {
      this.postService.delete(id);
      this.uiService.showSnackbar('Post was successfully deleted.', 'snack-success');
    }
  }
}
