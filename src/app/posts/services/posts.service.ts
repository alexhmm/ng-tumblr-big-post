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
  currentIndexSrc = new BehaviorSubject<number>(0);
  currentIndex = this.currentIndexSrc.asObservable();
  limit = 20;
  offsetSrc = new BehaviorSubject<number>(null);
  offset = this.offsetSrc.asObservable();
  postsSrc = new BehaviorSubject<any>(null);
  posts = this.postsSrc.asObservable();
  stateLoadingSrc = new BehaviorSubject<boolean>(true);
  stateLoading = this.stateLoadingSrc.asObservable();
  tagSrc = new BehaviorSubject<string>(null);
  tag = this.tagSrc.asObservable();
  titleSrc = new BehaviorSubject<string>(null);
  title = this.titleSrc.asObservable();
  totalPostsSrc = new BehaviorSubject<number>(null);
  totalPosts = this.totalPostsSrc.asObservable();

  /**
   * PostsService constructor.
   */
  constructor() {}

  /**
   * Returns calculated offset by page.
   * @param page Page
   */
  getOffsetByPage(page: string): number {
    return (parseInt(page, 10) - 1) * this.limit;
  }

  /**
   * Returns calculated page by offset.
   * @param offset Offset
   */
  getPageByOffset(offset: number): number {
    return offset / this.limit + 1;
  }

  /**
   * Get Tumblr posts.
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
        // Concat more post items while navigating
        if (this.postsSrc.value && this.postsSrc.value.length > 0) {
          this.postsSrc.next(
            this.postsSrc.value.concat(response.response.posts)
          );
          // Wait to render components
          setTimeout(() => {
            this.currentIndexSrc.next(offset);
          }, 250);
        } else {
          // Init posts
          this.postsSrc.next(response.response.posts);
          this.totalPostsSrc.next(response.response.total_posts);
          this.titleSrc.next(response.response.blog.title);
          this.currentIndexSrc.next(0);
        }
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
   * Sets current index.
   * @param currentIndex Current index
   */
  setCurrentIndex(currentIndex: number): void {
    this.currentIndexSrc.next(currentIndex);
  }

  /**
   * Sets loading state.
   * @param stateLoading State loading
   */
  setStateLoading(stateLoading: boolean): void {
    this.stateLoadingSrc.next(stateLoading);
  }

  /**
   * Sets tag.
   * @param tag Tag
   */
  setTag(tag: string): void {
    this.tagSrc.next(tag);
  }

  /**
   * Sets total posts count.
   * @param totalPosts Total posts
   */
  setTotalPosts(totalPosts: number): void {
    this.totalPostsSrc.next(totalPosts);
  }
}
