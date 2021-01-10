import {
  BrowserModule,
  HammerGestureConfig,
  HammerModule,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injectable, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import * as hammer from 'hammerjs';

// App modules
import { InfoModule } from './info/info.module';
import { PostsModule } from './posts/posts.module';

// App component
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@Injectable()
export class CustomHammerGestureConfig extends HammerGestureConfig {
  overrides: any = {
    // Override HammerJs default configuration
    swipe: { direction: hammer.DIRECTION_ALL }
  };
}

/**
 * App routes
 */
const routes: Routes = [
  // Lazy loading not correctly working with Tumblr
  // {
  //   path: '',
  //   loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule)
  // },
  // {
  //   path: 'info',
  //   loadChildren: () => import('./info/info.module').then(m => m.InfoModule)
  // }
  {
    path: '',
    loadChildren: () => PostsModule
  },
  {
    path: 'info',
    loadChildren: () => InfoModule
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    SharedModule
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerGestureConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
