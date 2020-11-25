import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';

// App component
import { AppComponent } from './app.component';

// App modules
import { PostsModule } from './posts/posts.module';
import { SharedModule } from './shared/shared.module';

/**
 * App routes
 */
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule)
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    AngularSvgIconModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PostsModule,
    RouterModule.forRoot(routes),
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
