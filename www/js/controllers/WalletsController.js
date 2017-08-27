app.controller('WalletsController', function ($scope, $rootScope, $state, localStorageService,  WalletsService) {
    $scope.newWallet = function () {
        $state.go("tab.new-wallet");
    };

    $scope.wallets = WalletsService.getWallets();
    $scope.getAvatar = function (address) {
        var pattern = GeoPattern.generate(address);
        return pattern.toDataUrl();
    };
});