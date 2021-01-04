import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppService } from 'src/app/shared/services/app.service';

import { environment } from 'src/environments/environment';

import { Post } from '../models/post.interface';

/**
 * PostsService
 */
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  limit = 20;
  offsetSrc = new BehaviorSubject<number>(null);
  offset = this.offsetSrc.asObservable();
  postsSrc = new BehaviorSubject<Post[]>(null);
  posts = this.postsSrc.asObservable();
  postsLoadedSrc = new BehaviorSubject<boolean[]>(null);
  postsLoaded = this.postsLoadedSrc.asObservable();
  stateLoadingSrc = new BehaviorSubject<boolean>(true);
  stateLoading = this.stateLoadingSrc.asObservable();
  tagSrc = new BehaviorSubject<string>(null);
  tag = this.tagSrc.asObservable();

  /**
   * PostsService constructor.
   */
  constructor(private appService: AppService) {}
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
      // this.setStateLoading(false);
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
        if (
          this.postsSrc.value &&
          this.postsSrc.value.length > 0 &&
          offset > 0
        ) {
          this.postsSrc.next(
            this.postsSrc.getValue().concat(response.response.posts)
          );
          // New added posts are not loaded
          const postsLoaded = this.postsLoadedSrc.value
            ? [...this.postsLoadedSrc.value]
            : [];
          for (let i = 0; i < limit; i++) {
            postsLoaded.push(false);
          }
          this.postsLoadedSrc.next(postsLoaded);
          this.appService.currentIndexSrc.next(offset);
        } else {
          // Init posts
          this.postsSrc.next(response.response.posts);
          this.appService.totalPostsSrc.next(response.response.total_posts);
          this.appService.setTitle(response.response.blog.title);
          const postsLoaded = this.postsLoadedSrc.value
            ? [...this.postsLoadedSrc.value]
            : [];
          for (let i = 0; i < limit; i++) {
            postsLoaded.push(false);
          }
          this.postsLoadedSrc.next(postsLoaded);
          this.appService.currentIndexSrc.next(0);
          this.setStateLoading(false);
        }
      }
    };
    let url = environment.apiUrl + '/posts?api_key=' + environment.apiKey;

    if (limit) {
      url = url.concat('&limit=' + limit);
    }
    if (offset) {
      url = url.concat('&offset=' + offset);
    }
    // Get posts by a given tag
    if (tag) {
      url = url.concat('&tag=' + tag);
    }
    // Get a single post by a given id
    if (id) {
      url = url.concat('&id=' + id + '&notes_info=true');
    }
    // // Define query params
    // let queryParams = `${environment.apiUrl}/posts?api_key=${environment.apiKey}&limit=${limit}`;
    // // Get posts by a given offset
    // if (offset) {
    //   queryParams = queryParams.concat('&offset=' + offset);
    // }
    // // Get posts by a given tag
    // if (tag) {
    //   queryParams = queryParams.concat('&tag=' + tag);
    // }
    // // Get a single post by a given id
    // if (id) {
    //   queryParams = queryParams.concat('&id=' + id + '&notes_info=true');
    // }
    // Send request
    // httpRequest.open('GET', queryParams);
    httpRequest.open('GET', url);
    httpRequest.send();
  }

  /**
   * Sets previous index
   * @param previousIndex Previous index
   */
  setPreviousIndex(previousIndex: number): void {
    if (previousIndex > -1) {
      this.appService.setCurrentIndex(previousIndex);
    }
  }

  /**
   * Sets next index.
   * @param nextIndex Next index
   */
  setNextIndex(nextIndex: number): void {
    if (nextIndex < this.appService.totalPostsSrc.value) {
      if (
        nextIndex === this.postsSrc.value.length &&
        this.postsSrc.value.length < this.appService.totalPostsSrc.value
      ) {
        this.getPosts(
          this.limit,
          this.postsSrc.value.length,
          this.tagSrc.value,
          null
        );
      } else {
        this.appService.setCurrentIndex(nextIndex);
      }
    }
  }

  /**
   * Sets posts.
   * @param posts Posts
   */
  setPosts(posts: Post[]): void {
    this.postsSrc.next(posts);
  }

  /**
   * Sets post loaded.
   * @param index Post index
   */
  setPostLoaded(index: number): void {
    if (
      this.postsLoadedSrc.value &&
      this.postsLoadedSrc.value.hasOwnProperty(index)
    ) {
      this.postsLoadedSrc.value[index] = true;
      this.postsLoadedSrc.next(this.postsLoadedSrc.value);
    }
  }

  /**
   * Sets posts loaded.
   * @param postsLoaded Posts loaded
   */
  setPostsLoaded(postsLoaded: boolean[]): void {
    this.postsLoadedSrc.next(postsLoaded);
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
}
