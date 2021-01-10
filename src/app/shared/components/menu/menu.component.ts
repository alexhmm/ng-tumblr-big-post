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
import { AppService } from '../../services/app.service';
import { PostsService } from '../../services/posts.service';

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
   * Copyright text
   */
  copyright = environment.copyright;

  /**
   * Copyright element
   */
  @ViewChild('copyrightElem') copyrightElem: ElementRef;

  /**
   * Menu bars icon element
   */
  @ViewChild('menuBarsElem') menuBarsElem: ElementRef;

  /**
   * Menu close icon element
   */
  @ViewChild('menuCloseElem') menuCloseElem: ElementRef;

  /**
   * Menu container element
   */
  @ViewChild('menuContainerElem') menuContainerElem: ElementRef;

  /**
   * Menu item element
   */
  @ViewChild('menuIconElem') menuIconElem: ElementRef;

  /**
   * Navigation item elements
   */
  @ViewChildren('navigationItemElem') navigationItemElems!: QueryList<
    ElementRef
  >;

  /**
   * Search element
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
   * Display state for archive menu item
   */
  stateArchive = environment.state.menu.archive;

  /**
   * Menu state
   */
  stateMenu = false;

  /**
   * Toggle menu state
   */
  stateMenuToggle = false;

  /**
   * Theme element
   */
  @ViewChild('themeElem') themeElem: ElementRef;

  constructor(
    private renderer2: Renderer2,
    private router: Router,
    private appService: AppService,
    private postsService: PostsService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {}

  /**
   * Handler on clicking about menu item.
   */
  onClickAbout(): void {
    this.postsService.setTag(null);
    this.onMenuToggle();
  }

  /**
   * Handler on clicking home menu item.
   */
  onClickHome(): void {
    this.postsService.setCurrentIndex(0);
    this.postsService.setTag(null);
    this.onMenuToggle();
  }

  /**
   * Handler to close menu.
   */
  onMenuClose(): void {
    this.stateMenuToggle = true;
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
    this.renderer2.setStyle(this.themeElem.nativeElement, 'opacity', 0);

    // Set menu toggle state to false if menu is closed
    setTimeout(() => {
      this.stateMenuToggle = false;
    }, 500);
  }

  /**
   * Handler to open menu.
   */
  onMenuOpen(): void {
    this.stateMenuToggle = true;
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
      this.renderer2.setStyle(this.themeElem.nativeElement, 'opacity', 1);
      // Set menu toggle state to false if menu is opened
      this.stateMenuToggle = false;
    }, 1000);
  }

  /**
   * Handler to toggle menu.
   */
  onMenuToggle(): void {
    // Only toggle menu if not in toggle state
    if (!this.stateMenuToggle) {
      if (!this.stateMenu) {
        this.onMenuOpen();
      } else {
        this.onMenuClose();
      }
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
    let searchValue = this.searchForm.controls.search.value.toLowerCase();
    if (searchValue.charAt(0) === '#') {
      searchValue = searchValue.substring(1, searchValue.length);
    }

    // Navigate to tagged posts
    this.router.navigate(['tagged', searchValue]);

    // Reset search form
    this.searchForm.controls.search.patchValue('');
  }

  /**
   * Handler on toggling application theme.
   */
  onToggleTheme(): void {
    this.appService.theme === 'light'
      ? this.appService.setTheme('dark')
      : this.appService.setTheme('light');
  }
}
