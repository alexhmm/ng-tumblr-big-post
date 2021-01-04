import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

// Info pages
import { AboutComponent } from './pages/about/about.component';

export const infoRoutes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full'
  },
  {
    component: AboutComponent,
    path: 'about'
  }
];

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, RouterModule.forChild(infoRoutes), SharedModule]
})
export class InfoModule {}
