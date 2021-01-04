import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppService } from 'src/app/shared/services/app.service';

import { Post } from 'src/app/posts/models/post.interface';
import { PostsService } from 'src/app/posts/services/posts.service';

/**
 * Displays tumblr posts
 */
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Current post index
   */
  currentIndex: number;

  /**
   * Old post index
   */
  oldIndex: number;

  /**
   * Offset
   */
  offset: number;

  /**
   * Post ID
   */
  postId: string;

  /**
   * All posts
   */
  posts: Post[] = [];

  /**
   * Posts loaded
   */
  postsLoaded: boolean[] = [];

  /**
   * Loading state
   */
  stateLoading: boolean;

  /**
   * Tag
   */
  tag: string;

  /**
   * Posts count
   */
  totalPosts: number;

  /**
   * Unsubscribe
   */
  unsubscribe$ = new Subject();

  /**
   * PostsComponent constructor
   * @param route ActivatedRoute
   * @param appService AppService
   * @param postsService PostsService
   */
  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private postsService: PostsService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionPosts();
    this.initSubscriptionStateLoading();
    this.initSubscriptionRouteParams();
    this.initSubscriptionTotalPosts();
    this.initSubscriptionPostsLoadedCurrentIndex();
  }

  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSubscriptionCurrentIndex();
    }, 500);
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Inits subscription on current index
   */
  initSubscriptionCurrentIndex(): void {
    this.appService.currentIndex
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(currentIndex => {
        this.oldIndex = this.currentIndex;
        this.currentIndex = currentIndex;
      });
  }

  /**
   * Subscription on posts loaded and current index.
   */
  initSubscriptionPostsLoadedCurrentIndex(): void {
    combineLatest(this.postsService.postsLoaded, this.appService.currentIndex)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(postsLoadedCurrentIndex => {
        // Check if current index is loaded
        if (
          postsLoadedCurrentIndex &&
          postsLoadedCurrentIndex[0] &&
          postsLoadedCurrentIndex[1] > -1 &&
          postsLoadedCurrentIndex[0].hasOwnProperty(postsLoadedCurrentIndex[1])
        ) {
          this.postsLoaded = postsLoadedCurrentIndex[0];
          // If current index is loaded unset loading state (fade out spinner)
          if (postsLoadedCurrentIndex[0][postsLoadedCurrentIndex[1]]) {
            this.postsService.setStateLoading(false);
          }
        }
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
          this.posts = posts;
        }
      });
  }

  /**
   * Subscription on route params.
   */
  initSubscriptionRouteParams(): void {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (params.tag) {
        // Sets tag on search
        this.postsService.setTag(params.tag);
      }
      if (Object.keys(params).length === 0 && params.constructor === Object) {
        // Get initial posts on no params
        this.postsService.getPosts(this.postsService.limit, 0, null, null);
      }
      if (params.page && !params.tag) {
        // Get posts by page
        this.postsService.getPosts(
          this.postsService.limit,
          this.postsService.getOffsetByPage(params.page),
          null,
          null
        );
        window.scroll(0, 0);
      }
      if (params.postId) {
        // Get single post
        this.postsService.getPosts(
          this.postsService.limit,
          null,
          null,
          params.postId
        );
        window.scroll(0, 0);
      }
      if (params.tag) {
        // Get tagged posts
        this.postsService.getPosts(
          this.postsService.limit,
          0,
          params.tag,
          null
        );
        window.scroll(0, 0);
      }
      if (params.tag && params.page) {
        // Get tagged posts by page
        this.postsService.getPosts(
          this.postsService.limit,
          this.postsService.getOffsetByPage(params.page),
          params.tag,
          null
        );
      }

      // Set counter visibility on single posts
      if (params.postId) {
        this.appService.setStateCounter(false);
      } else {
        this.appService.setStateCounter(true);
      }
    });
  }

  /**
   * Inits subscription on loading state.
   */
  initSubscriptionStateLoading(): void {
    this.postsService.stateLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(stateLoading => (this.stateLoading = stateLoading));
  }

  /**
   * Inits subscription on total posts count.
   */
  initSubscriptionTotalPosts(): void {
    this.appService.totalPosts
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(totalPosts => {
        this.totalPosts = totalPosts;
      });
  }
}
