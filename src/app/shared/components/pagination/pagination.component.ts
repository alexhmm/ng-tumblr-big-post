import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostsService } from 'src/app/posts/services/posts.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy {
  /**
   * Current post index
   */
  currentIndex: number;

  /**
   * Posts
   */
  posts: any;

  /**
   * Totol posts count
   */
  totalPosts: number;

  /**
   * Unsubscribe
   */
  unsubscribe$ = new Subject();

  constructor(private postsService: PostsService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionCurrentIndex();
    this.initSubscriptionPosts();
    this.initSubscriptionTotalPosts();
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Inits subscription on current index.
   */
  initSubscriptionCurrentIndex(): void {
    this.postsService.currentIndex
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(currentIndex => {
        this.currentIndex = currentIndex;
      });
  }

  /**
   * Inits subscription on posts. Formats date.
   */
  initSubscriptionPosts(): void {
    this.postsService.posts
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(posts => {
        if (posts) {
          this.posts = [...posts];
        }
      });
  }

  /**
   * Inits subscription on total posts count.
   */
  initSubscriptionTotalPosts(): void {
    this.postsService.totalPosts
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(totalPosts => {
        this.totalPosts = totalPosts;
      });
  }

  /**
   * Handler on previous post.
   */
  onPreviousPost(): void {
    if (this.currentIndex - 1 > -1) {
      this.postsService.setCurrentIndex(this.currentIndex - 1);
      // if (this.currentIndex - 1)
    }
  }

  /**
   * Handler on next post.
   */
  onNextPost(): void {
    // this.postsService.setPostNext(true);
    if (this.currentIndex + 1 < this.totalPosts) {
      // this.postsService.setCurrentIndex(this.currentIndex + 1);
      if (
        this.currentIndex + 1 === this.posts.length &&
        this.posts.length < this.totalPosts
      ) {
        this.postsService.getPosts(20, this.posts.length, null, null);
      } else {
        this.postsService.setCurrentIndex(this.currentIndex + 1);
      }
    }
  }
}
