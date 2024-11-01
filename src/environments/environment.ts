// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration production` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backendURL:"http://localhost:5000",
  redirectURL:"http://localhost:4200/login", // Do not replace localhost with 127.0.0.1 here. It's known to fail. Gymkhana responds with an error saying that there's a mismatch in the redirect URL.
  clientID:"1dE3mAQY7EvCjw5IdHgoNtbutjgZy14CyIsWKRK8"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
