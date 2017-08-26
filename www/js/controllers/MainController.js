app.controller("MainController", function ($scope, $rootScope, localStorageService, $state, WalletService) {

    $rootScope.Settings = {
        PrivateKey: '',
        AutoOpen: true
    };
    $rootScope.openWallet = function () {
        WalletService.openWallet($rootScope.Settings.PrivateKey);
    };


    function inicializar() {
        $rootScope.Settings = getItem("Settings");
        if ($rootScope.Settings) {
            if ($rootScope.Settings.AutoOpen) {
                if ($scope.Settings.PrivateKey) {
                    $rootScope.openWallet();
                }
            }
        }
    };



    function setItem(key, val) {
        return localStorageService.set(key, val);
    };

    function getItem(key) {
        return localStorageService.get(key);
    };

    function removeItem(key) {
        return localStorageService.remove(key);
    };

    $scope.IsWalletLoaded = function () {
        return WalletService.isWalletLoaded();
    }

    inicializar();

});