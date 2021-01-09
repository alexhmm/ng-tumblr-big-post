import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  /**
   * About
   */
  about = environment.about;

  /**
   * Archive menu item visibility
   */
  archive = environment.archive;

  /**
   * Copyright text
   */
  copyright = environment.copyright;

  /**
   * Copyright
   */
  @ViewChild('copyrightElem') copyrightElem: ElementRef;

  /**
   * Menu bars icon
   */
  @ViewChild('menuBarsElem') menuBarsElem: ElementRef;

  /**
   * Menu close icon
   */
  @ViewChild('menuCloseElem') menuCloseElem: ElementRef;

  /**
   * Menu container
   */
  @ViewChild('menuContainerElem') menuContainerElem: ElementRef;

  /**
   * Menu item
   */
  @ViewChild('menuIconElem') menuIconElem: ElementRef;

  /**
   * Navigation items
   */
  @ViewChildren('navigationItemElem') navigationItemElems!: QueryList<
    ElementRef
  >;

  /**
   * Search
   */
  @ViewChild('searchElem') searchElem: ElementRef;

  /**
   * Social links
   */
  @ViewChild('socialElem') socialElem: ElementRef;

  /**
   * SearchForm FormGroup
   */
  searchForm: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required])
  });

  /**
   * Social media
   */
  social = environment.social;

  /**
   * Menu state
   */
  stateMenu = false;

  constructor(private renderer2: Renderer2, private router: Router) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {}

  /**
   * Handler to close menu.
   */
  onMenuClose(): void {
    this.stateMenu = false;

    // Animate container
    this.renderer2.setStyle(
      this.menuContainerElem.nativeElement,
      'transform',
      'translateX(100%)'
    );

    // Animate menu icon
    this.renderer2.setStyle(
      this.menuIconElem.nativeElement.children[0].children[0],
      'transform',
      'rotate(0deg) translateY(-150%)'
    );
    this.renderer2.setStyle(
      this.menuIconElem.nativeElement.children[0].children[1],
      'transform',
      'rotate(0deg) translateY(150%)'
    );

    // Animate navigation items
    const navigationItems = this.navigationItemElems.toArray();
    for (const navigationItem of navigationItems) {
      this.renderer2.setStyle(
        navigationItem.nativeElement,
        'transform',
        'translateX(100%)'
      );
      this.renderer2.setStyle(navigationItem.nativeElement, 'opacity', 0);
    }

    // Unset opacity of search input and info elements
    this.renderer2.setStyle(this.searchElem.nativeElement, 'opacity', 0);
    this.renderer2.setStyle(this.copyrightElem.nativeElement, 'opacity', 0);
    this.renderer2.setStyle(this.socialElem.nativeElement, 'opacity', 0);
  }

  /**
   * Handler to open menu.
   */
  onMenuOpen(): void {
    this.stateMenu = true;

    // Animate container
    this.renderer2.setStyle(
      this.menuContainerElem.nativeElement,
      'transform',
      'translateX(0)'
    );

    // Animate menu icon
    this.renderer2.setStyle(
      this.menuIconElem.nativeElement.children[0].children[0],
      'transform',
      'rotate(45deg) translateY(0%)'
    );
    this.renderer2.setStyle(
      this.menuIconElem.nativeElement.children[0].children[1],
      'transform',
      'rotate(-45deg) translateY(0%)'
    );

    // Animate navigation items
    const navigationItems = this.navigationItemElems.toArray();
    setTimeout(() => {
      for (let i = 0; i < navigationItems.length; i++) {
        setTimeout(() => {
          this.renderer2.setStyle(
            navigationItems[i].nativeElement,
            'transform',
            'translateX(0)'
          );
          this.renderer2.setStyle(
            navigationItems[i].nativeElement,
            'opacity',
            1
          );
        }, (i + 1) * 350);
      }
    }, 250);

    // Fade in search input and info elements
    setTimeout(() => {
      this.renderer2.setStyle(this.copyrightElem.nativeElement, 'opacity', 0.5);
      this.renderer2.setStyle(this.searchElem.nativeElement, 'opacity', 1);
      this.renderer2.setStyle(this.socialElem.nativeElement, 'opacity', 1);
    }, 1000);
  }

  /**
   * Handler to toggle menu.
   */
  onMenuToggle(): void {
    if (!this.stateMenu) {
      this.onMenuOpen();
    } else {
      this.onMenuClose();
    }
  }

  /**
   * Handler on search.
   */
  onSearch(): void {
    this.onMenuClose();
    // Remove input focus (closes mobile keyboard)
    this.searchElem.nativeElement.children[0].blur();

    // Check search value for # on first character. If so remove
    let searchValue = this.searchForm.controls.search.value;
    if (searchValue.charAt(0) === '#') {
      searchValue = searchValue.substring(1, searchValue.length);
    }

    // Navigate to tagged posts
    this.router.navigate(['tagged', searchValue]);

    // Reset search form
    this.searchForm.controls.search.patchValue('');
  }
}
