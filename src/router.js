
export default require('angular')
    .module('pkp.router', [
        require('@uirouter/angularjs').default
    ])
    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise(function($injector) {
          var $state = $injector.get('$state');
          $state.go('home');
        });

        $stateProvider
          .state('page', {
            abstract: true,
            template: require('../html/page.html'),
            controllerAs: 'page',
            controller: require('./controllers/AppCtrl.js').default
          })
          .state('home', {
            url: '/',
            template: require('../html/home.html'),
            controllerAs: 'ctrl',
            controller: require('./controllers/HomeCtrl.js').default
          })
          .state('page.game', {
            url: '/game',
            template: require('../html/game.html'),
            controllerAs: 'ctrl',
            controller: require('./controllers/GameCtrl.js').default
          });
    }])
    .name;
