import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Shared components
import { LogoComponent } from './components/logo/logo.component';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [LogoComponent, MenuComponent],
  exports: [LogoComponent, MenuComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class SharedModule {}
