import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';

/**
 * PostsService
 */
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  limit = 10;
  offsetSrc = new BehaviorSubject<number>(null);
  offset = this.offsetSrc.asObservable();
  postsSrc = new BehaviorSubject<any>(null);
  posts = this.postsSrc.asObservable();
  stateLoadingSrc = new BehaviorSubject<boolean>(true);
  stateLoading = this.stateLoadingSrc.asObservable();
  tagSrc = new BehaviorSubject<string>(null);
  tag = this.tagSrc.asObservable();
  totalPostsSrc = new BehaviorSubject<number>(null);
  totalPosts = this.totalPostsSrc.asObservable();

  /**
   * PostsService constructor.
   */
  constructor() {}

  /**
   * Returns calculated offset by page
   * @param page Page
   */
  getOffsetByPage(page: string): number {
    return (parseInt(page, 10) - 1) * this.limit;
  }

  /**
   * Returns calculated page by offset
   * @param offset Offset
   */
  getPageByOffset(offset: number): number {
    return offset / this.limit + 1;
  }

  /**
   * Get Tumblr posts
   * @param limit Limit
   * @param offset Offset
   * @param tag Tag
   * @param id Post ID
   */
  getPosts(limit: number, offset: number, tag: string, id: string): void {
    this.offsetSrc.next(offset);
    // Get posts
    const httpRequest = new XMLHttpRequest();
    httpRequest.onloadstart = () => {
      // Do something on load start (e.g. spinner start etc.)
      this.setStateLoading(true);
    };
    httpRequest.onloadend = () => {
      // Do something on load start (e.g. spinner start etc.)
      this.setStateLoading(false);
    };
    // Fill observable if response success
    httpRequest.onreadystatechange = () => {
      if (
        httpRequest.status === 200 &&
        httpRequest.readyState === 4 &&
        httpRequest.response
      ) {
        const response = JSON.parse(httpRequest.response);
        this.postsSrc.next(response);
        this.totalPostsSrc.next(response.response.total_posts);
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

  /**
   * Sets loading state
   * @param stateLoading State loading
   */
  setStateLoading(stateLoading: boolean): void {
    this.stateLoadingSrc.next(stateLoading);
  }

  /**
   * Sets tag
   * @param tag Tag
   */
  setTag(tag: string): void {
    this.tagSrc.next(tag);
  }

  /**
   * Sets total posts
   * @param totalPosts Total posts
   */
  setTotalPosts(totalPosts: number): void {
    this.totalPostsSrc.next(totalPosts);
  }
}
