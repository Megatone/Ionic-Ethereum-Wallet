
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
  };

  function setItem(key, val) {
    return localStorageService.set(key, val, 'localStorage');
  };

  function getItem(key) {
    return localStorageService.get(key, 'localStorage');
  };

  function removeItem(key) {
    return localStorageService.remove(key, 'localStorage');
  };

 

});