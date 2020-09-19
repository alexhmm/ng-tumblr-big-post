# ng-tumblr

Create Angular (10.0.6) based Tumblr templates.

## Installation

Run `npm install` to install dependencies.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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

## Installation

Run `npm install` to install dependencies.

## Usage / Known Issues

Template coding could be bugged. <br />
Tumblr Editor doesn't recognize template variables including ':' (e.g. {block:ifMetaTag} won't work).<br />
So better make usage of the Tumblr API V2: https://www.tumblr.com/docs/en/api/v2. <br />
The Tumblr API only supports synchronous requests, so Angular's HTTPClientModule won't work. <br />
Use XMLHttpRequest to issue HTTP requests in order to exchange data between your blog and the Tumblr API.

Use the environment to declare global variables:

```
export const environment = {
  ...
  apiKey: 'YOUR_API_KEY',
  apiUrl: 'YOUR_TUMBLR_API_URL'
};
```

## Deployment on Tumblr

Run `ng build --prod` to build a production build.

Run `npm run inline` to inline index.html.

Copy content from formatted _dist/inline.html_ into Tumblr Editor.
Preview in Tumblr Editor might be unavailable.
