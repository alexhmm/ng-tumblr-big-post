import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as moment from 'moment';

import { fadeInOut } from 'src/app/shared/services/animations';

import { Post } from 'src/app/posts/models/post.interface';
import { PostPhotoComponent } from '../../components/post-photo/post-photo.component';
import { PostsService } from 'src/app/posts/services/posts.service';

/**
 * Displays tumblr posts
 */
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  animations: [fadeInOut]
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

  @ViewChildren('post', { read: ElementRef }) private postsElements: QueryList<
    ElementRef<PostPhotoComponent>
  >;

  /**
   * PostsComponent constructor
   * @param route ActivatedRoute
   * @param postsService PostsService
   */
  constructor(
    private cdref: ChangeDetectorRef,
    private renderer2: Renderer2,
    private route: ActivatedRoute,
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
  }

  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   */
  ngAfterViewInit(): void {
    // Wait for tumblr!?
    setTimeout(() => {
      this.initSubscriptionCurrentIndex();
      this.initSubscriptionPostsElementsChanges();
    }, 1000);
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
    this.postsService.currentIndex
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(currentIndex => {
        this.oldIndex = this.currentIndex;
        this.currentIndex = currentIndex;
        // Check if posts elements are aviable
        if (
          this.postsElements &&
          this.postsElements.length > 0 &&
          this.currentIndex < this.postsElements.length
        ) {
          const postsElementsArray = this.postsElements.toArray();
          // Change components opacity on pagination
          if (this.oldIndex !== this.currentIndex) {
            if (
              this.oldIndex > -1 &&
              this.currentIndex > -1 &&
              postsElementsArray[this.oldIndex] &&
              postsElementsArray[this.currentIndex]
            ) {
              // Fade out old post
              this.renderer2.setStyle(
                postsElementsArray[this.oldIndex].nativeElement,
                'opacity',
                '0'
              );
              this.renderer2.setStyle(
                postsElementsArray[this.currentIndex].nativeElement,
                'opacity',
                '1'
              );
            }
          }
          if (
            !this.oldIndex &&
            this.currentIndex > -1 &&
            postsElementsArray[this.currentIndex]
          ) {
            // Fade in first post
            this.renderer2.setStyle(
              postsElementsArray[this.currentIndex].nativeElement,
              'opacity',
              '1'
            );
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
          // const mapPosts = [];
          // for (const post of posts) {
          //   const mapPost = post;
          //   mapPost.date = moment(post.date.substr(0, 10)).format('LL');
          //   mapPosts.push(mapPost);
          // }
          // this.posts = mapPosts;
          this.posts = posts;
        }
      });
  }

  /**
   * Init subscription on posts elements changes.
   */
  initSubscriptionPostsElementsChanges(): void {
    this.postsElements.changes.subscribe(() => {
      if (this.postsElements.length > 0) {
        if (this.currentIndex > 0) {
          // Get next post on loading / concatting more posts.
          this.postsService.setCurrentIndex(this.currentIndex + 1);
        } else {
          this.postsService.setCurrentIndex(0);
        }
        // Detect changes (avoid ExpressionChangedAfterItHasBeenCheckedError)
        this.cdref.detectChanges();
      }
    });
  }

  /**
   * Subscription on route params.
   */
  initSubscriptionRouteParams(): void {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (params.tag) {
        this.postsService.setTag(params.tag);
      }
      if (Object.keys(params).length === 0 && params.constructor === Object) {
        this.postsService.getPosts(this.postsService.limit, 0, null, null);
      }
      if (params.page && !params.tag) {
        this.postsService.getPosts(
          this.postsService.limit,
          this.postsService.getOffsetByPage(params.page),
          null,
          null
        );
        window.scroll(0, 0);
      }
      if (params.postId) {
        this.postsService.getPosts(
          this.postsService.limit,
          null,
          null,
          params.postId
        );
        window.scroll(0, 0);
      }
      if (params.tag) {
        this.postsService.getPosts(
          this.postsService.limit,
          0,
          params.tag,
          null
        );
        window.scroll(0, 0);
      }
      if (params.tag && params.page) {
        this.postsService.getPosts(
          this.postsService.limit,
          this.postsService.getOffsetByPage(params.page),
          params.tag,
          null
        );
      }

      // Set counter visibility
      if (params.postId) {
        this.postsService.setCounterVisibility(false);
      } else {
        this.postsService.setCounterVisibility(true);
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
    this.postsService.totalPosts
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(totalPosts => {
        this.totalPosts = totalPosts;
      });
  }
}
