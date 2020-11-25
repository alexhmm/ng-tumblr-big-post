import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Post } from '../../models/post.interface';
import { PostsService } from '../../services/posts.service';

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
   * Post
   */
  @Input() post: Post;

  /**
   * Image source.
   */
  src = '';

  /**
   * Image source loaded validilty.
   */
  @Input() srcLoaded: boolean;

  /**
   * Unsubscribe
   */
  unsubscribe$ = new Subject();

  /**
   * PostPhotoComponent constructor.
   */
  constructor(private postsService: PostsService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionCurrentIndex();
  }

  /**
   * A lifecycle hook that is called when any data-bound property of a directive changes.
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.srcLoaded.currentValue) {
      this.src = this.post.photos[0].original_size.url;
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

  onNextPost(): void {
    this.postsService.setNextIndex(this.currentIndex + 1);
  }

  onPreviousPost(): void {
    this.postsService.setPreviousIndex(this.currentIndex - 1);
  }
}
