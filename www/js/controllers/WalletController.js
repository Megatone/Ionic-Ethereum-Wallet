app.controller('WalletController', function ($scope, $rootScope, $state, WalletService) {

    $scope.Wallet = WalletService.getWallet();

    $scope.AccountInformation = {
        Balance: 0,
        GasPrice: 0,
        EtherPrice: 0
    };

    inicializar();

    function inicializar() {
        WalletService.getBalance(function (balance) {
            $scope.AccountInformation.Balance = balance;
        });
        WalletService.getGasPrice(function (gasPrice) {
            $scope.AccountInformation.GasPrice = gasPrice;
        });
        WalletService.getEtherPrice(function (price) {
            $scope.AccountInformation.EtherPrice = price;
        })

    };

});