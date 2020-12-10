import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild
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
   * Copyright text
   */
  copyright = environment.copyright;

  /**
   * Menu bars icon
   */
  @ViewChild('menuBars') menuBars: ElementRef;

  /**
   * Menu close icon
   */
  @ViewChild('menuClose') menuClose: ElementRef;

  /**
   * Menu container
   */
  @ViewChild('menuContainer') menuContainer: ElementRef;

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
   * Handler on closing menu.
   */
  onMenuClose(): void {
    if (this.stateMenu) {
      this.stateMenu = false;
      this.renderer2.setStyle(this.menuClose.nativeElement, 'z-index', 40);
      this.renderer2.setStyle(this.menuBars.nativeElement, 'z-index', 41);
      // Wait for menu container to fade out
      setTimeout(() => {
        this.renderer2.setStyle(
          this.menuContainer.nativeElement,
          'z-index',
          -1
        );
      }, 500);
    }
  }

  /**
   * Handler on opening menu.
   */
  onMenuOpen(): void {
    if (!this.stateMenu) {
      this.stateMenu = true;
      this.renderer2.setStyle(this.menuContainer.nativeElement, 'z-index', 31);
      this.renderer2.setStyle(this.menuBars.nativeElement, 'z-index', 40);
      this.renderer2.setStyle(this.menuClose.nativeElement, 'z-index', 41);
    }
  }

  /**
   * Handler on search.
   */
  onSearch(): void {
    this.onMenuClose();
    this.router.navigate(['tagged', this.searchForm.controls.search.value]);
    this.searchForm.controls.search.patchValue('');
  }
}
