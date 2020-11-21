import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Post } from '../../models/post.interface';

/**
 * PostPhotoComponent
 */
@Component({
  selector: 'app-post-photo',
  templateUrl: './post-photo.component.html',
  styleUrls: ['./post-photo.component.scss']
})
export class PostPhotoComponent implements OnChanges {
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
   * PostPhotoComponent constructor.
   */
  constructor() {}

  /**
   * A lifecycle hook that is called when any data-bound property of a directive changes.
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.srcLoaded.currentValue) {
      this.src = this.post.photos[0].original_size.url;
    }
  }
}
