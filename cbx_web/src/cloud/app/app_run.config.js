angular.module('conext_gateway').run(
  ['$sessionStorage', '$window', '$rootScope', '$log', 'browserDetection', '$http', '$state', 'redirectService',
    function($sessionStorage, $window, $rootScope, $log, browserDetection, $http, $state, redirectService) {
      $http.defaults.headers.post['Content-Type'] = "text/plain;charset=utf-8";
      var listener = function(event, newUrl) {
        var url = newUrl.split('/');
        if ($rootScope.connectedDevice === undefined && url[url.length - 1] !== 'deviceselect' && url[url.length - 1] !== 'configviewer') {
          event.preventDefault();
          console.log("Redirecting : " + url[url.length - 1]);
          $state.go("deviceselect");
        } else if ((url.length < 5 || url[4] !== "reset_code") && checkIfCloudPages(url[url.length - 1])) {
          if (!$sessionStorage.userName && (url.length === 0 ||
              (url[url.length - 1] !== "login"))) {
            event.preventDefault();
            console.log("Redirecting to login");
            redirectService.redirectToLogin();
          }
          $rootScope.userName = $sessionStorage.userName;
        }
      };

      function checkIfCloudPages(urlEnding) {
        return urlEnding !== "console" &&
          urlEnding !== "deviceselect" &&
          urlEnding !== "filebrowser" &&
          urlEnding !== 'firmwareupdate' &&
          urlEnding !== 'configviewer';
      }

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
