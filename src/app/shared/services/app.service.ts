import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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
   * Screen state
   */
  screen: string;

  // Observables
  stateScreenSrc = new BehaviorSubject(null);
  stateScreen = this.stateScreenSrc.asObservable();
  stateWidthSrc = new BehaviorSubject(window.innerWidth);
  stateWidth = this.stateWidthSrc.asObservable();

  unsubscribe$: Subject<any> = new Subject();

  constructor() {}

  /**
   * Sets screen state when window width changes.
   * @param width Window width
   */
  setScreenState(width: number): void {
    if (width < this.sm && this.screen !== 'xs') {
      this.screen = 'xs';
      this.stateScreenSrc.next('xs');
    } else if (width > this.sm - 1 && width < this.md && this.screen !== 'sm') {
      this.screen = 'sm';
      this.stateScreenSrc.next('sm');
    } else if (width > this.md - 1 && width < this.lg && this.screen !== 'md') {
      this.screen = 'md';
      this.stateScreenSrc.next('md');
    } else if (width > this.lg - 1 && width < this.xl && this.screen !== 'lg') {
      this.screen = 'lg';
      this.stateScreenSrc.next('lg');
    } else if (
      width > this.xl - 1 &&
      width < this.fhd &&
      this.screen !== 'xl'
    ) {
      this.screen = 'xl';
      this.stateScreenSrc.next('xl');
    } else if (width > this.fhd - 1 && this.screen !== 'fhd') {
      this.screen = 'fhd';
      this.stateScreenSrc.next('fhd');
    }
  }
}
