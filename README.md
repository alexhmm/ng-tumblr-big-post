# ng-tumblr

Create Angular (10.0.6) based Tumblr templates.

## Installation

Run `npm install` to install dependencies.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Installation

Run `npm install` to install dependencies.

## Usage & Tutorial

### General Information

Custom theming: `https://www.tumblr.com/docs/de/custom_themes` doesn't seem to work.<br />
Tumblr Editor doesn't recognize template variables including ':' (e.g. {block:ifMetaTag} won't work).<br />

So we make usage of the Tumblr API V2: `https://www.tumblr.com/docs/en/api/v2`. <br />
The Tumblr API only supports synchronous requests, so Angular's HTTPClientModule won't work. <br />
We will use XMLHttpRequest to issue HTTP requests in order to exchange data between the blog and the Tumblr API.

Use the environment to declare global variables:

```
export const environment = {
  ...
  apiKey: 'YOUR_API_KEY',
  apiUrl: 'YOUR_TUMBLR_API_URL'
};
```

The following tutorial only supports Tumblr photo posts.

### Prepare Pages and Endpoints

In order to use the typical Tumblr url endpoints, we will 'fake' these urls with Angular Routing:

- /page/{PageNumber}
- /post/{PostID}
- /post/{PostID}/{Caption}
- /tagged/{Tag}
- /tagged/{Tag}/page/{PageNumber}

Therefore modify the routes and use a component where the posts will be loaded: <br />

app-routing.module.ts:

```
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
```

### Create a HTTP Request Service to receive Tumblr Posts

We want to save the current received posts in a state.<br />
In a component we will subscribe to this state later.<br />
We create class variables for the post limit and posts itself.<br />

services/posts.service:

```
limit = 20;
postsSrc = new BehaviorSubject<any>(null);
posts = this.postsSrc.asObservable();
```

To get the correct posts while navigating through pages,<br />
we will create a calculcation to determine the current offset.<br />

services/posts.service:

```
/**
  * Returns calculated offset by page
  * @param page Page
  */
getOffsetByPage(page: string): number {
  return (parseInt(page, 10) - 1) * this.limit;
}
```

To retrieve posts from the Tumblr API we use a GET XMLHttpRequest.<br />
The query parameters are determined by the current ActivatedRoute.<br />

services/posts.service:

```
/**
  * Get Tumblr posts
  * @param limit Limit
  * @param offset Offset
  * @param tag Tag
  * @param id Post ID
  */
getPosts(limit: number, offset: number, tag: string, id: string): void {
  // Get posts
  const httpRequest = new XMLHttpRequest();
  httpRequest.onloadstart = () => {
    // Do something on load start (e.g. spinner start etc.)
  };
  httpRequest.onloadend = () => {
    // Do something on load start (e.g. spinner start etc.)
  };
  // Fill observable if response success
  httpRequest.onreadystatechange = () => {
    if (httpRequest.status === 200 && httpRequest.response) {
      this.postsSrc.next(JSON.parse(httpRequest.response));
    }
  };
  // Define query params
  let queryParams = `${environment.apiUrl}/posts?api_key=${environment.apiKey}&limit=${limit}`;
  // Get posts by a given offset
  if (offset) {
    queryParams = queryParams.concat('&offset=' + offset);
  }
  // Get posts by a given tag
  if (tag) {
    queryParams = queryParams.concat('&tag=' + tag);
  }
  // Get a single post by a given id
  if (id) {
    queryParams = queryParams.concat('&id=' + id + '&notes_info=true');
  }
  // Send request
  httpRequest.open('GET', queryParams);
  httpRequest.send();
}
```

### Create a component to display Posts

In order to display Tumblr posts, we need a class variable to store the data.<br />
Due we will subscribe to the created PostsService Observable,<br />
we will create an unsubscribe object to avoid infinity loading after destroying the component.<br />

components/posts/posts.component.ts:

```
posts: any[] = [];
unsubscribe$ = new Subject();
```

To save the updated posts data in our variable,<br />
we will subscribe to the PostsService Observable.<br />

components/posts/posts.component.ts:

```
/**
  * Inits subscription on posts. Formats date.
  */
initSubscriptionPosts(): void {
  this.postsService.posts
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(posts => {
      if (posts) {
        const mapPosts = [];
        for (const post of posts.response.posts) {
          const mapPost = post;
          mapPost.date = moment(post.date.substr(0, 10)).format('LL');
          mapPosts.push(mapPost);
        }
        this.posts = mapPosts;
      }
    });
}
```

To make the GET HTTP Request with the correct query parameters,<br />
we will map through the ActivatedRoute.<br />

components/posts/posts.component.ts:

```
/**
  * Subscription on route params.
  */
initSubscriptionRouteParams(): void {
  this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
    if (Object.keys(params).length === 0 && params.constructor === Object) {
      this.postsService.getPosts(this.postsService.limit, null, null, null);
    }
    if (params.page && !params.tag) {
      this.postsService.getPosts(
        this.postsService.limit,
        this.postsService.getOffsetByPage(params.page),
        null,
        null
      );
      window.scroll(0, 0);
    }
    if (params.postId) {
      this.postsService.getPosts(
        this.postsService.limit,
        null,
        null,
        params.postId
      );
      window.scroll(0, 0);
    }
    if (params.tag) {
      this.postsService.getPosts(
        this.postsService.limit,
        null,
        params.tag,
        null
      );
      window.scroll(0, 0);
    }
    if (params.tag && params.page) {
      this.postsService.getPosts(
        this.postsService.limit,
        this.postsService.getOffsetByPage(params.page),
        params.tag,
        null
      );
    }
  });
}
```

Now create a template to display the stored posts.<br />

components/posts/posts.component.html:

```
<section *ngIf="posts" class="posts">
  <article *ngFor="let post of posts" class="posts-item">
    <div class="posts-item-header">
      {{ post.summary }}
    </div>
    <div class="posts-item-photo">
      <img [src]="post.photos[0].original_size.url" />
    </div>
  </article>
</section>
```

Now create some styling for the displayed posts.<br />

components/posts/posts.component.scss:

```
.posts {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 16px 0px;
  width: 100%;
  &-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    &-header {
      font-size: 24px;
      margin-bottom: 8px;
      text-align: center;
    }
    &-photo {
      display: flex;
      justify-content: center;
      width: 100%;
      & img {
        width: 100%;
      }
    }
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}

@media (min-width: 720px) {
  .posts {
    &-item {
      &-photo {
        & img {
          width: 640px;
        }
      }
    }
  }
}
```

### Conclusion

All in all this should display a basic photo blog with a caption and a photo for each post. <br />
This is a starting point. You can add a navigation, implement other types of posts, add spinners for loading, etc... !

## Deployment on Tumblr

Run `ng build --prod` to build a production build.

Run `npm run inline` to inline index.html.

Copy content from formatted _dist/inline.html_ into Tumblr Editor.
Preview in Tumblr Editor might be unavailable.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
