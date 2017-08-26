
app.controller('ConfigurationController', function ($scope, $rootScope, localStorageService) {
  localStorageService.setPrefix('ConfigurationStorage');
  $rootScope.Wallet = null;

  $scope.Settings = {
    PrivateKey: '0x0123456789012345678901234567890123456789012345678901234567890123'
  };



  $scope.saveConfiguration = function () {
    setItem('PrivateKey' , $scope.Settings.PrivateKey);
  };

    $scope.getConfiguration = function(){
      alert(getItem("PrivateKey"));
    };

  function setItem(key, val) {
    return localStorageService.set(key, val);
  };

  function getItem(key) {
    return localStorageService.get(key);
  };
});