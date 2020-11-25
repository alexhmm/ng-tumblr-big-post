import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Module pages
import { PostsComponent } from './pages/posts/posts.component';

// Module components
import { PostPhotoComponent } from './components/post-photo/post-photo.component';

// Module services
import { PostsService } from './services/posts.service';
import { HttpClientModule } from '@angular/common/http';

/**
 * Module routes
 */
const routes: Routes = [
  {
    path: '',
    component: PostsComponent
  },
  {
    path: 'page/:page',
    component: PostsComponent
  },
  {
    path: 'tagged/:tag',
    component: PostsComponent
  },
  {
    path: 'tagged/:tag/page/:page',
    component: PostsComponent
  },
  {
    path: 'post/:postId',
    component: PostsComponent
  },
  {
    path: 'post/:postId/:caption',
    component: PostsComponent
  }
];

@NgModule({
  declarations: [PostsComponent, PostPhotoComponent],
  imports: [
    AngularSvgIconModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [PostsService]
})
export class PostsModule {}
