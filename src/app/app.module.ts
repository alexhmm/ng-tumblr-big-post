import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// App modules
import { InfoModule } from './info/info.module';
import { PostsModule } from './posts/posts.module';

// App component
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

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
    HttpClientModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
