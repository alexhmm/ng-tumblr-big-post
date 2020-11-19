import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Shared components
import { NavSideComponent } from './components/nav-side/nav-side.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { LogoComponent } from './components/logo/logo.component';
import { MenuComponent } from './components/menu/menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LogoComponent,
    MenuComponent,
    NavSideComponent,
    PaginationComponent
  ],
  exports: [
    LogoComponent,
    MenuComponent,
    NavSideComponent,
    PaginationComponent
  ],
  imports: [AngularSvgIconModule, CommonModule, RouterModule]
})
export class SharedModule {}
