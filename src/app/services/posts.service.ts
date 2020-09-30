import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  limit = 20;
  postsSrc = new BehaviorSubject<any>(null);
  posts = this.postsSrc.asObservable();

  constructor() {}

  /**
   * Returns calculated offset by page
   * @param page Page
   */
  getOffsetByPage(page: string): number {
    return (parseInt(page, 10) - 1) * this.limit;
  }

  /**
   * Get Tumblr posts
   * @param limit Limit
   * @param offset Offset
   * @param tag Tag
   * @param id Post ID
   */
  getPosts(limit: number, offset: number, tag: string, id: string): void {
    // Get posts
    const httpRequest = new XMLHttpRequest();
    httpRequest.onloadstart = () => {
      // Do something on load start (e.g. spinner start etc.)
    };
    httpRequest.onloadend = () => {
      // Do something on load start (e.g. spinner start etc.)
    };
    // Fill observable if response success
    httpRequest.onreadystatechange = () => {
      if (httpRequest.status === 200 && httpRequest.response) {
        this.postsSrc.next(JSON.parse(httpRequest.response));
      }
    };
    // Define query params
    let queryParams = `${environment.apiUrl}/posts?api_key=${environment.apiKey}&limit=${limit}`;
    // Get posts by a given offset
    if (offset) {
      queryParams = queryParams.concat('&offset=' + offset);
    }
    // Get posts by a given tag
    if (tag) {
      queryParams = queryParams.concat('&tag=' + tag);
    }
    // Get a single post by a given id
    if (id) {
      queryParams = queryParams.concat('&id=' + id + '&notes_info=true');
    }
    // Send request
    httpRequest.open('GET', queryParams);
    httpRequest.send();
  }
}
