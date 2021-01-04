import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * AppService
 */
@Injectable({
  providedIn: 'root'
})
export class AppService {
  currentIndexSrc = new BehaviorSubject<number>(null);
  currentIndex = this.currentIndexSrc.asObservable();
  stateCounterSrc = new BehaviorSubject<boolean>(false);
  stateCounter = this.stateCounterSrc.asObservable();
  titleSrc = new BehaviorSubject<string>(null);
  title = this.titleSrc.asObservable();
  totalPostsSrc = new BehaviorSubject<number>(null);
  totalPosts = this.totalPostsSrc.asObservable();

  /**
   * AppService constructor.
   */
  constructor() {}

  /**
   * Sets current index.
   * @param currentIndex Current index
   */
  setCurrentIndex(currentIndex: number): void {
    this.currentIndexSrc.next(currentIndex);
  }

  /**
   * Sets counter state.
   * @param stateCounter Counter state
   */
  setStateCounter(stateCounter: boolean): void {
    this.stateCounterSrc.next(stateCounter);
  }

  /**
   * Sets application title.
   * @param title Title
   */
  setTitle(title: string): void {
    this.titleSrc.next(title);
  }

  /**
   * Sets total posts count.
   * @param totalPosts Total posts
   */
  setTotalPosts(totalPosts: number): void {
    this.totalPostsSrc.next(totalPosts);
  }
}
