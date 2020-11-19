import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PostsService } from 'src/app/posts/services/posts.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit, OnDestroy {
  /**
   * Blog title
   */
  title: string;

  /**
   * Unsubscribe
   */
  unsubscribe$ = new Subject();

  constructor(private postsService: PostsService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionPosts();
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Inits subscription on posts. Formats date.
   */
  initSubscriptionPosts(): void {
    this.postsService.posts
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(posts => {
        if (posts) {
          this.title = posts.response.blog.title;
        }
      });
  }
}
