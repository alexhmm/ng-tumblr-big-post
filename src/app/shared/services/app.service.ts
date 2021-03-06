import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

/**
 * Debounce for @HostListener event
 * https://stackoverflow.com/questions/44634992/debounce-hostlistener-event?rq=1
 */
export function debounce(delay: number = 300): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let timeout = null;
    const original = descriptor.value;
    descriptor.value = function (...args: any): void {
      clearTimeout(timeout);
      timeout = setTimeout(() => original.apply(this, args), delay);
    };
    return descriptor;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // Breakpoints
  readonly xs: number = 360;
  readonly sm: number = 576;
  readonly md: number = 768;
  readonly lg: number = 992;
  readonly xl: number = 1200;
  readonly fhd: number = 1920;

  /**
   * Screen state BehaviorSubject
   */
  stateScreenSrc = new BehaviorSubject(null);

  /**
   * Screen state Observable
   */
  stateScreen = this.stateScreenSrc.asObservable();

  /**
   * Theme BehaviorSubject
   */
  themeSrc = new BehaviorSubject(null);

  /**
   * Theme Observable
   */
  theme = this.themeSrc.asObservable();

  /**
   * Window width BehaviorSubject
   */
  widthSrc = new BehaviorSubject(window.innerWidth);

  /**
   * Window width Observable
   */
  width = this.widthSrc.asObservable();

  /**
   * AppService constructor.
   */
  constructor() {
    this.setFavicon();
  }

  /**
   * Sets favicon on app init.
   */
  setFavicon(): void {
    if (environment.favicon && environment.favicon.length > 0) {
      document
        .getElementById('favicon')
        .setAttribute('href', environment.favicon);
    }
  }

  /**
   * Sets screen state when window width changes.
   * @param width Window width
   */
  setScreenState(width: number): void {
    if (width < this.sm && this.stateScreenSrc.value !== 'xs') {
      this.stateScreenSrc.next('xs');
    } else if (
      width > this.sm - 1 &&
      width < this.md &&
      this.stateScreenSrc.value !== 'sm'
    ) {
      this.stateScreenSrc.next('sm');
    } else if (
      width > this.md - 1 &&
      width < this.lg &&
      this.stateScreenSrc.value !== 'md'
    ) {
      this.stateScreenSrc.next('md');
    } else if (
      width > this.lg - 1 &&
      width < this.xl &&
      this.stateScreenSrc.value !== 'lg'
    ) {
      this.stateScreenSrc.next('lg');
    } else if (
      width > this.xl - 1 &&
      width < this.fhd &&
      this.stateScreenSrc.value !== 'xl'
    ) {
      this.stateScreenSrc.next('xl');
    } else if (width > this.fhd - 1 && this.stateScreenSrc.value !== 'fhd') {
      this.stateScreenSrc.next('fhd');
    }
  }

  /**
   * Sets app theme.
   * @param theme App theme
   */
  setTheme(theme: string): void {
    // Set mobile status bar
    if (theme === 'light') {
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute('content', '#fafafa');
      document
        .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
        .setAttribute('content', '#fafafa');
    } else if (theme === 'dark') {
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute('content', '#1f1f1f');
      document
        .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
        .setAttribute('content', '#1f1f1f');
    }
    this.themeSrc.next(theme);
    document.documentElement.setAttribute('theme', theme);
    localStorage.setItem('theme', theme);
  }
}
