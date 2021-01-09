import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { fadeInOut } from '../../services/animations';
import { PostsService } from '../../services/posts.service';

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
   * Counter state
   */
  stateCounter: boolean;

  /**
   * Posts tag
   */
  tag: string;

  /**
   * Totol posts count
   */
  totalPosts: number;

  /**
   * Unsubscribe
   */
  unsubscribe$ = new Subject();

  constructor(private router: Router, private postsService: PostsService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionStateCounter();
    this.initSubscriptionCurrentIndex();
    this.initSubscriptionTag();
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
  initSubscriptionStateCounter(): void {
    this.postsService.stateCounter
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(stateCounter => {
        this.stateCounter = stateCounter;
      });
  }

  /**
   * Inits subscription on posts tag.
   */
  initSubscriptionTag(): void {
    this.postsService.tag.pipe(takeUntil(this.unsubscribe$)).subscribe(tag => {
      this.tag = tag;
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
   * Handler on removing tag.
   */
  onHome(): void {
    this.router.navigate(['']);
    this.postsService.setTag(null);
  }
}
