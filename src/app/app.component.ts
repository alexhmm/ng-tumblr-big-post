import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { AppService, debounce } from './shared/services/app.service';

import { PostsService } from './shared/services/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  clientX: number;
  clientY: number;

  /**
   * Key used
   */
  keyUsed = false;

  /**
   * Mousewheel used
   */
  mousewheelUsed = false;

  /**
   * HostListener on window resize
   * @param event Window resize event
   */
  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event): void {
    this.appService.setScreenState(window.innerWidth);
  }

  constructor(
    private renderer2: Renderer2,
    private appService: AppService,
    private postsService: PostsService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.appService.setTheme('light');
    this.onKeyUse();
    this.onMousewheelUse();
  }

  /**
   * Listener on wheel use.
   */
  onMousewheelUse(): void {
    this.renderer2.listen('document', 'wheel', event => {
      if (!this.keyUsed && !this.mousewheelUsed) {
        this.mousewheelUsed = true;
        if (event.deltaY > 0) {
          this.postsService.setNextIndex(
            this.postsService.currentIndexSrc.value + 1
          );
        } else if (event.deltaY < 0) {
          this.postsService.setPreviousIndex(
            this.postsService.currentIndexSrc.value - 1
          );
        }
        // Wait for photo swap
        setTimeout(() => {
          this.mousewheelUsed = false;
        }, 250);
      }
    });
  }

  /**
   * Listener on key use.
   */
  onKeyUse(): void {
    this.renderer2.listen('document', 'keyup', event => {
      if (!this.keyUsed && !this.mousewheelUsed) {
        this.keyUsed = true;
        if (event.keyCode === 37) {
          this.postsService.setPreviousIndex(
            this.postsService.currentIndexSrc.value - 1
          );
        } else if (event.keyCode === 39) {
          this.postsService.setNextIndex(
            this.postsService.currentIndexSrc.value + 1
          );
        }
        // Wait for photo swap
        setTimeout(() => {
          this.keyUsed = false;
        }, 250);
      }
    });
  }
}
