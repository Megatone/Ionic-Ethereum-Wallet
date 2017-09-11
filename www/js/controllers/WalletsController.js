app.controller('WalletsController', function ($scope, $rootScope, $state, localStorageService,  WalletsService) {
    $scope.newWallet = function () {
        $state.go("tab.new-wallet");
    };

    $scope.wallets = WalletsService.getWallets();


   
    $scope.getAvatar = function (address) {
        if($rootScope.settings.avatars.id ==0){
            return GeoPattern.generate(address).toDataUrl();
        }else{
            return 'url(' + blockies.create({ seed:address.toLowerCase()}).toDataURL() + ')';
        }
    };
});