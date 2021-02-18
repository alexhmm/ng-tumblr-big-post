import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { fadeInOut } from '../../services/animations';
import { AppService } from '../../services/app.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  animations: [fadeInOut]
})
export class LogoComponent implements OnInit, OnDestroy {
  /**
   * Application logo URL
   */
  logo: string;

  /**
   * Blog title
   */
  title: string;

  /**
   * Unsubscribe
   */
  unsubscribe$ = new Subject();

  constructor(
    private appService: AppService,
    private postsService: PostsService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionTheme();
    this.initSubscriptionTitle();
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Inits subscription on app theme.
   */
  initSubscriptionTheme(): void {
    this.appService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(theme => {
        if (
          theme === 'light' &&
          environment?.logo?.light &&
          environment.logo.light !== ''
        ) {
          this.logo = environment.logo.light;
        } else if (
          theme === 'dark' &&
          environment?.logo?.dark &&
          environment.logo.dark !== ''
        ) {
          this.logo = environment.logo.dark;
        }
      });
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
    this.postsService.setTotalPosts(null);
    this.postsService.setTag(null);
    this.postsService.setPosts(null);
    this.postsService.getPosts(this.postsService.limit, 0, null, null);
  }
}
