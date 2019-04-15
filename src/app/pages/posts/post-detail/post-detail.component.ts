import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PostService } from 'src/app/shared/services/post.service';
import { IPost } from 'src/app/shared/models/post.interface';
import { UIService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: IPost;
  editMode = false;
  postId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private uiService: UIService
  ) {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.getPost();
  }

  ngOnInit() {
  }

  getPost() {
    this.postService.getPostData(this.postId).subscribe(post => {
      this.post = post;
    });
  }

  updatePost() {
    const formData = {
      title: this.post.title,
      content: this.post.content
    };
    const id = this.route.snapshot.paramMap.get('id');
    this.postService.update(id, formData);
    this.uiService.showSnackbar('Post was successfully updated.', 'snack-success');
    this.editMode = false;
  }

  delete() {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const id = this.route.snapshot.paramMap.get('id');
      this.postService.delete(id);
      this.uiService.showSnackbar('Post was successfully deleted.', 'snack-success');
      this.router.navigate(['/blog']);
    }
  }
}
