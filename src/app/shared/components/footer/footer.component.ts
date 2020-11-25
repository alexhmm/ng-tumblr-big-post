import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { fadeInOut } from '../../services/animations';

import { PostsService } from 'src/app/posts/services/posts.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  animations: [fadeInOut]
})
export class FooterComponent implements OnInit, OnDestroy {
  /**
   * Copyright text
   */
  copyright = environment.copyright;

  /**
   * Current post index
   */
  currentIndex: number;

  /**
   * Totol posts count
   */
  totalPosts: number;

  /**
   * Unsubscribe
   */
  unsubscribe$ = new Subject();

  /**
   * Visible container
   */
  visibility: boolean;

  constructor(private postsService: PostsService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionCounterVisibility();
    this.initSubscriptionCurrentIndex();
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
   * Subscription on route params.
   */
  initSubscriptionCounterVisibility(): void {
    this.postsService.counterVisibilitySrc
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(visibility => {
        this.visibility = visibility;
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
}
