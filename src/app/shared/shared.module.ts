import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Shared components
import { FooterComponent } from './components/footer/footer.component';
import { LogoComponent } from './components/logo/logo.component';
import { MenuComponent } from './components/menu/menu.component';
import { NavSideComponent } from './components/nav-side/nav-side.component';

@NgModule({
  declarations: [
    FooterComponent,
    LogoComponent,
    MenuComponent,
    NavSideComponent
  ],
  exports: [FooterComponent, LogoComponent, MenuComponent, NavSideComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class SharedModule {}
