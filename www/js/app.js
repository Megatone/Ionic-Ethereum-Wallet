var app = angular.module('app', ['ionic', 'ion-floating-menu', 'LocalStorageModule' , 'WalletService'])

  .run(function ($ionicPlatform, $rootScope, $state, $location) {
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
  })
  .config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('IonicEthereumWallet2')
      .setStorageType('localStorage');
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })
      .state('tab.wallets', {
        url: '/wallets',
        views: {
          'tab-wallets': {
            templateUrl: 'templates/tab-wallets.html',
            controller: 'WalletsController'
          }
        }
      })
      .state('tab.wallet-detail', {
        url: '/wallets/:address',
        views: {
          'tab-wallets': {
            templateUrl: 'templates/wallet-detail.html',
            controller: 'WalletDetailController'
          }
        }
      })
      .state('tab.new-wallet', {
        url: '/newWallet',
        views: {
          'tab-wallets': {
            templateUrl: 'templates/new-wallet.html',
            controller: 'NewWalletController'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/wallets');

  });
