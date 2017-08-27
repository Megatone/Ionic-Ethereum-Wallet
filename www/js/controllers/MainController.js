app.controller("MainController", function ($scope, $rootScope, localStorageService, $state, WalletService) {

    $rootScope.Settings = {
        PrivateKey: '',
        AutoOpen: true
    };

    $rootScope.openWallet = function () {
        WalletService.openWallet($rootScope.Settings.PrivateKey);
        window.location = "#/tab/wallet";
    };
    $rootScope.closeWallet = function () {
        WalletService.closeWallet();   
        $rootScope.Settings.AutoOpen = false;
        setItem('Settings' , $rootScope.Settings  );
        window.location.reload();
    };

    $scope.IsWalletLoaded = function () {
        return WalletService.isWalletLoaded();
    };

    function inicializar() {
        if (localStorageService.length() > 0) {
            $rootScope.Settings = getItem("Settings");
            if ($rootScope.Settings) {
                if ($rootScope.Settings.AutoOpen) {
                    if ($scope.Settings.PrivateKey) {
                        $rootScope.openWallet();
                    }
                }
            }
        }
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



    inicializar();

});