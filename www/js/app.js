var app = angular.module('app', ['ionic', 'ion-floating-menu', 'LocalStorageModule' , 'WalletService' , 'monospaced.qrcode' , 'ngCordova' , 'ngclipboard' ,'chart.js'])

  .run(function ($ionicPlatform, $rootScope, $state, $location , SettingsService) {
    $rootScope.settings = angular.copy(SettingsService.getSettings());
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
  .config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider ) {    
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
      }).state('tab.wallet-detail', {
        url: '/wallets/:address',
        views: {
          'tab-wallets': {
            templateUrl: 'templates/wallet-detail.html',
            controller: 'WalletDetailController'
          }
        }
      }).state('tab.transactions-history', {
        url: '/transactions/:address',
        views: {
          'tab-wallets': {
            templateUrl: 'templates/transactions-history.html',
            controller: 'TransactionsHistoryController'
          }
        }
      }).state('tab.transaction-view', {
        url: '/transaction/:transactionId',
        views: {
          'tab-wallets': {
            templateUrl: 'templates/transaction-view.html',
            controller: 'TransactionViewController'
          }
        }
      }).state('tab.new-wallet', {
        url: '/newWallet',
        views: {
          'tab-wallets': {
            templateUrl: 'templates/new-wallet.html',
            controller: 'NewWalletController'
          }
        }
      }).state('tab.price-history', {
        url: '/priceHistory',
        views: {
          'tab-price-history': {
            templateUrl: 'templates/tab-price-history.html',
            controller: 'PriceHistoryController'
          }
        }
      }).state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsController'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/wallets');

  });

  app.directive('customOnChange', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.customOnChange);
        element.bind('change', onChangeHandler);
      }
    };
  });