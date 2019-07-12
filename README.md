# apollo-link-firebase-performance-monitoring

Firebase Performance Monitoring for Apollo GraphQL Client using Apollo Link

[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][LICENSE]
[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]

## Installing / Getting Started

```sh
npm install apollo-link-firebase-performance-monitoring
```

### Prerequisites

* Apollo Link: ^1.2.12
* Firebase: ^6.2.4

```ts
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Performance Monitoring library
import "firebase/performance";

// Add import for Apollo Link
import { from } from 'apollo-link';

// Add the import for this library
import createFPMLink from 'apollo-link-firebase-performance-monitoring';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  // ...
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Performance Monitoring and get a reference to the service
const perf = firebase.performance();

// ...
ApolloLink.from([
  createFPMLink(() => perf, true /* debug: true/false for logging to console */),
  // ...
]);
```
Do notice that you have to give a function that returns **Firebase performance instance or undefined**. Thats because the object is not available when using SSR.
If you use debug logging you may also want to only activate it when in the browser environment so that you don't fill up the logs on your server.

## License

This project is licensed under the MIT License - see the 
[license] file for details.

[npm]: https://www.npmjs.com/
[package]: https://www.npmjs.com/package/apollo-link-firebase-performance-monitoring
[downloads-badge]: https://img.shields.io/npm/dm/apollo-link-firebase-performance-monitoring.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/apollo-link-firebase-performance-monitoring
[version-badge]: https://img.shields.io/npm/v/apollo-link-firebase-performance-monitoring.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/apollo-link-firebase-performance-monitoring.svg?style=flat-square
[license]: https://github.com/Gerrel/apollo-link-firebase-performance-monitoring/blob/master/LICENSE.md
[github-watch-badge]: https://img.shields.io/github/watchers/Gerrel/apollo-link-firebase-performance-monitoring.svg?style=social
[github-watch]: https://github.com/Gerrel/apollo-link-firebase-performance-monitoring/watchers
[github-star-badge]: https://img.shields.io/github/stars/Gerrel/apollo-link-firebase-performance-monitoring.svg?style=social
[github-star]: https://github.com/Gerrel/apollo-link-firebase-performance-monitoring/stargazers
[releases]: https://github.com/Gerrel/apollo-link-firebase-performance-monitoring/releases