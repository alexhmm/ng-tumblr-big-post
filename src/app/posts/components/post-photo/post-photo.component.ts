import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'app-post-photo',
  templateUrl: './post-photo.component.html',
  styleUrls: ['./post-photo.component.scss']
})
export class PostPhotoComponent implements OnInit {
  @Input() post: any;

  constructor() {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {}
}
