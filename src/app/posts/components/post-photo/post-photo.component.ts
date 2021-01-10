import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fadeInOut } from 'src/app/shared/services/animations';
import { AppService } from 'src/app/shared/services/app.service';
import { PostsService } from 'src/app/shared/services/posts.service';
import { environment } from 'src/environments/environment';

import { Post } from '../../models/post.interface';

/**
 * PostPhotoComponent
 */
@Component({
  selector: 'app-post-photo',
  templateUrl: './post-photo.component.html',
  styleUrls: ['./post-photo.component.scss'],
  animations: [fadeInOut]
})
export class PostPhotoComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Current post index
   */
  currentIndex: number;

  /**
   * Image source loaded validilty
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
   * Post image source
   */
  postSrc = '';

  /**
   * Post image source width
   */
  postSrcWidth = 0;

  /**
   * Post visibility
   */
  @Input() postVisible = false;

  /**
   * Loading state
   */
  stateLoading: boolean;

  /**
   * Screen state
   */
  stateScreen: string;

  /**
   * Display state for tags
   */
  stateTags = environment.state.posts.tags;

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
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private postsService: PostsService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionCurrentIndex();
    this.initSubscriptionRouteParams();
    this.initSubscriptionStateLoading();
    this.initSubscriptionStateScreen();
    this.initSubscriptionTotalPosts();
  }

  /**
   * A lifecycle hook that is called when any data-bound property of a directive changes.
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Load post source
    if (changes.loadSource && changes.loadSource.currentValue) {
      this.setSource();
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
   * Inits subscription on loading state.
   */
  initSubscriptionStateLoading(): void {
    this.postsService.stateLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(stateLoading => {
        this.stateLoading = stateLoading;
      });
  }

  /**
   * Inits subscription on screen state.
   */
  initSubscriptionStateScreen(): void {
    this.appService.stateScreen
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(stateScreen => {
        // Change source url on resize
        if (this.stateScreen !== stateScreen && this.postSrc) {
          if (
            this.postIndex > -1 &&
            this.postIndex < this.totalPosts &&
            (this.postIndex === this.currentIndex - 1 ||
              this.postIndex === this.currentIndex ||
              this.postIndex === this.currentIndex + 1)
          ) {
            this.setSource();
          }
          this.stateScreen = stateScreen;
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
    if (!this.stateLoading) {
      this.postsService.setNextIndex(this.currentIndex + 1);
    }
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
    if (this.currentIndex > 0) {
      this.postsService.setPreviousIndex(this.currentIndex - 1);
    }
  }

  /**
   * Handler on swipe posts.
   * @param $event Swipe event
   */
  onSwipe($event): void {
    if ($event.deltaX > 40) {
      this.onPreviousPost();
    } else if ($event.deltaX < -40) {
      this.onNextPost();
    }
  }

  /**
   * Handler on clicking tag.
   * @param tag Tag
   */
  onTag(tag: string): void {
    this.router.navigate(['tagged', tag]);
  }

  /**
   * Sets photo post url.
   */
  setSource(): void {
    // Set current window width
    // Small devices load bigger images to get a good zoom experience
    const windowWidth = window.innerWidth < 992 ? 992 : window.innerWidth;

    // Get all image urls
    const postSizes = this.post?.photos[0]?.alt_sizes;
    let postSrc;
    let postWidth;

    for (let i = postSizes?.length - 1; i > -1; i--) {
      if (postSizes[i].width >= windowWidth) {
        // Only load a new source if new image is bigger than previous loaded source
        if (postSizes[i].width > this.postSrcWidth) {
          // Set source if image width is bigger than window width
          postSrc = postSizes[i].url;
          postWidth = postSizes[i].width;
          break;
        }
      }
      if (i === 0 && !postSrc) {
        // If no match set biggest possible image width
        postSrc = postSizes[i].url;
        postWidth = postSizes[i].width;
      }
    }
    this.postSrc = postSrc ? postSrc : null;
    this.postSrcWidth = postWidth ? postWidth : null;
  }
}
