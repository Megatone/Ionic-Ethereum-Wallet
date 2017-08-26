app.controller('WalletController', function ($scope, $rootScope, $state, WalletService) {

    $scope.Wallet = WalletService.getWallet();

    $scope.AccountInformation = {
        Balance: 0
    };

    inicializar();

    function inicializar() {
        WalletService.getBalance(function (balance) {
            $scope.AccountInformation.Balance = balance;
        });

    };

});