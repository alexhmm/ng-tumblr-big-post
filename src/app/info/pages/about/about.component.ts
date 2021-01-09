import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/shared/services/posts.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  /**
   * About
   */
  about = environment.about;

  constructor(private postsService: PostsService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.postsService.setStateCounter(false);
  }
}
