import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { fadeInOut } from '../../services/animations';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  animations: [fadeInOut]
})
export class LogoComponent implements OnInit {
  /**
   * Blog title
   */
  title: string;

  constructor(private postsService: PostsService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionTitle();
  }

  /**
   * Inits subscription on posts. Formats date.
   */
  initSubscriptionTitle(): void {
    this.postsService.title.pipe(take(2)).subscribe(title => {
      if (title) {
        this.title = title;
      }
    });
  }

  /**
   * Handler on clicking logo.
   */
  onHome(): void {
    this.postsService.setTag(null);
    this.postsService.setPosts(null);
    this.postsService.getPosts(this.postsService.limit, 0, null, null);
  }
}
