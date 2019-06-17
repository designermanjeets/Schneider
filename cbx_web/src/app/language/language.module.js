"use strict";

angular.module("conext_gateway.language", [
  // ngCookies is needed by the cookie storage,
  // which is the fallback for when local storage
  // isn't supported.
  'ngCookies',
  'pascalprecht.translate',
  'tmh.dynamicLocale',
  ]);
