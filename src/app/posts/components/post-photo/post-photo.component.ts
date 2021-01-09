import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PostsService } from 'src/app/shared/services/posts.service';

import { Post } from '../../models/post.interface';

/**
 * PostPhotoComponent
 */
@Component({
  selector: 'app-post-photo',
  templateUrl: './post-photo.component.html',
  styleUrls: ['./post-photo.component.scss']
})
export class PostPhotoComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Current post index
   */
  currentIndex: number;

  /**
   * Image source loaded validilty.
   */
  @Input() loadSource: boolean;

  /**
   * Post
   */
  @Input() post: Post;

  /**
   * Post id
   */
  postId: string;

  /**
   * Post index
   */
  @Input() postIndex: number;

  /**
   * Post visibility
   */
  @Input() postVisible = false;

  /**
   * Image source.
   */
  src = '';

  /**
   * Total posts
   */
  totalPosts: number;

  /**
   * Unsubscribe
   */
  unsubscribe$ = new Subject();

  /**
   * PostPhotoComponent constructor.
   */
  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionCurrentIndex();
    this.initSubscriptionRouteParams();
    this.initSubscriptionTotalPosts();
  }

  /**
   * A lifecycle hook that is called when any data-bound property of a directive changes.
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Load post source
    if (changes.loadSource && changes.loadSource.currentValue) {
      this.src = this.post.photos[0].original_size.url;
    }
    // Fade in post
    if (changes.postVisible && changes.postVisible.currentValue) {
      this.postVisible = true;
    } else {
      this.postVisible = false;
    }
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
  initSubscriptionRouteParams(): void {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (params.postId) {
        this.postId = params.postId;
      }
    });
  }

  /**
   * Inits subscription on total posts.
   */
  initSubscriptionTotalPosts(): void {
    this.postsService.totalPosts
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(totalPosts => {
        this.totalPosts = totalPosts;
      });
  }

  /**
   * Handler on setting next post.
   */
  onNextPost(): void {
    this.postsService.setNextIndex(this.currentIndex + 1);
  }

  /**
   * Event when image loading has finished.
   */
  onPostLoaded(): void {
    this.postsService.setPostLoaded(this.postIndex);
  }

  /**
   * Handler on setting previous post.
   */
  onPreviousPost(): void {
    this.postsService.setPreviousIndex(this.currentIndex - 1);
  }
}
