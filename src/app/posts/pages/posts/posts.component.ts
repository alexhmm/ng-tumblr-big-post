import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as moment from 'moment';

import { PostsService } from 'src/app/posts/services/posts.service';
import { Post } from 'src/app/posts/models/post.interface';

/**
 * Displays tumblr posts
 */
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
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
   * Active DOM posts
   */
  postsActive: Post[] = [];

  /**
   * Loading state
   */
  stateLoading: boolean;

  /**
   * Tag
   */
  tag: string;

  /**
   * Unsubscribe
   */
  unsubscribe$ = new Subject();

  /**
   * PostsComponent constructor
   * @param route ActivatedRoute
   * @param postsService PostsService
   */
  constructor(
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
          const mapPosts = [];
          for (const post of posts.response.posts) {
            const mapPost = post;
            mapPost.date = moment(post.date.substr(0, 10)).format('LL');
            mapPosts.push(mapPost);
          }
          this.posts = mapPosts;
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
        this.postsService.getPosts(this.postsService.limit, null, null, null);
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
          null,
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
}
