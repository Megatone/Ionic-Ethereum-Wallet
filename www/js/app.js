var app = angular.module('app', ['ionic', 'LocalStorageModule', 'WalletService'])

  .run(function ($ionicPlatform, $rootScope, $state, $location, WalletService) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });


    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if (toState.authenticate && !WalletService.isWalletLoaded()) {
        // User isn’t authenticated
        $state.go("tab.configuration");
        event.preventDefault();
      }
    });
  })
  .config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('IonicEthereumWallet')

      .setStorageType('localStorage');
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.wallet', {
        url: '/wallet',
        views: {
          'tab-wallet': {
            templateUrl: 'templates/tab-wallet.html',
            controller: 'WalletController'
          }
        },
        authenticate: true
      })

      .state('tab.transactions', {
        url: '/transactions',
        views: {
          'tab-transactions': {
            templateUrl: 'templates/tab-transactions.html',
            controller: 'TransactionsController'
          }
        },
        authenticate: true
      })
      .state('tab.transaction-detail', {
        url: '/transactions/:transactionId',
        views: {
          'tab-transactions': {
            templateUrl: 'templates/transaction-detail.html',
            controller: 'TransactionDetailController'
          }
        },
        authenticate: true
      })

      .state('tab.configuration', {
        url: '/configuration',
        views: {
          'tab-configuration': {
            templateUrl: 'templates/tab-configuration.html',
            controller: 'ConfigurationController'
          }
        },
        authenticate: false
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/wallet');

  });
