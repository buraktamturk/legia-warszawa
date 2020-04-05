
'use strict';

import "../assets/styles/page.css";

window.Promise = require('bluebird');

window.Promise.config({
  warnings: true
});

const angular = require('angular');
const swal = require('sweetalert2');

angular
  .module('pkp', [
    require('./router.js').default,
    require('angular1-scaffolder'),
    require('./upload.js').default,
    require('angular-sanitize'),
    require('angular-loading-bar')
  ])
  .config(['$sceProvider', '$compileProvider', function($sceProvider, $compileProvider){
    $sceProvider.enabled(false);
    $compileProvider.debugInfoEnabled(false);
  }])
  .factory('$ottp', ['$http', function ($http) {
    return async function (config) {
      try {
        return await $http({ url: ENDPOINT + config.path, ...config });
      } catch (e) {
        if(!e || e.xhrStatus != "abort") {
          swal.fire('Error', (e.data && e.data.message) || e.message || 'Unknown error', 'error');
          throw e;
        }
      }
    };
  }])
  .directive('loader', function () {
    return {
        restrict: 'A',
        scope: {
            loader: '='
        },
        transclude: true,
        template: `
          <div ng-if="!loader" ng-transclude></div>
          <div ng-if="loader" class="loading-container loading yh"></div>`
    };
  })
  .run(['$transitions', '$rootScope', function($transitions, $rootScope) {
    Promise.setScheduler(function (cb) {
      $rootScope.$evalAsync(cb);
    });
    
    $transitions.onStart({ }, async function(trans) {
      window.scrollTo(0, 0);
    });
  }]);
