
app.controller('ConfigurationController', function ($scope, $rootScope, localStorageService, $state, WalletService) {

  $scope.Settings = {
    PrivateKey: '',
    AutoOpen: true
  };

  inicializar();

  function inicializar() {
    $scope.Settings = angular.copy($rootScope.Settings);
  };


  $scope.saveConfiguration = function () {
    setItem('Settings', $scope.Settings);
    $rootScope.Settings = getItem("Settings");
    console.log($rootScope.Settings);
  };

  function setItem(key, val) {
    return localStorageService.set(key, val);
  };

  function getItem(key) {
    return localStorageService.get(key);
  };
  function removeItem(key) {
    return localStorageService.remove(key);
  }


});