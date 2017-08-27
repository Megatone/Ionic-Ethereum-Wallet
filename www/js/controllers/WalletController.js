app.controller('WalletController', function ($scope, $rootScope, $state, WalletService) {

    $scope.Wallet = WalletService.getWallet();

    $scope.AccountInformation = {
        Balance: 0,
        GasPrice: 0,
        EtherPrice: {
            BTCPrice: 0,
            USDPrice: 0,
            TimeStamp: new Date()
        }
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
            $scope.AccountInformation.EtherPrice ={
                BTCPrice: parseFloat(price.ethbtc),
                USDPrice: parseFloat(price.ethusd),
                TimeStamp: new Date(price.ethbtc_timestamp * 1000)
            } 
        })

    };

});