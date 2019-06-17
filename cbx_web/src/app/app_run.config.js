angular.module('conext_gateway').run(
  ['$sessionStorage', '$window', '$rootScope', '$log', 'browserDetection', '$http', '$state', 'redirectService',
    function($sessionStorage, $window, $rootScope, $log, browserDetection, $http, $state, redirectService) {
      $http.defaults.headers.post['Content-Type'] = "text/plain;charset=utf-8";
      var listener = function(event, newUrl) {
        var url = newUrl.split('/');
        if (url.length < 5 || url[4] !== "reset_code") {
          if (!$sessionStorage.userName && (url.length === 0 || url[url.length - 1] !== "login.html")) {
            event.preventDefault();
            $log.debug("Redirecting to login");
            redirectService.redirectToLogin();
          }
          $rootScope.userName = $sessionStorage.userName;

        }
      };
      var handle = $rootScope.$on('$locationChangeStart', listener);

      $rootScope.$on("$destroy", function() {
        handle();
      });

      $rootScope.$state = $state;
      // Add browser classes to the HTML body
      browserDetection({
        addClasses: true
      });

    }
  ]);
