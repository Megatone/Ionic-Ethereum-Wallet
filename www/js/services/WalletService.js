angular.module('WalletService', []).service('WalletService', function ($rootScope, $state, $http) {
    var Wallet = null;

    this.setWallet = function (_wallet) {
        this.Wallet = _wallet;
    };

    this.getWallet = function () {
        return this.Wallet;
    };

    this.isWalletLoaded = function () {
        var a = (this.Wallet != null);
        return a;
    };

    this.openWallet = function (privateKey) {
        if (!this.isWalletLoaded()) {
            if (privateKey.substring(0, 2) !== '0x') { privateKey = '0x' + privateKey; }
            this.Wallet = new ethers.Wallet(privateKey);
            console.log(this.Wallet);
            this.Wallet.provider = new ethers.providers.getDefaultProvider(false);
        }
    };

    this.closeWallet = function () {
        this.Wallet = null;        
    };

    this.getBalance = function (_callback) {
        this.Wallet.getBalance('pending').then(function (balance) {
            _callback(ethers.utils.formatEther(balance, { commify: true }));
            $rootScope.$apply();
        }, function (error) {

        });
    };

    this.getGasPrice = function (_callback) {
        this.Wallet.provider.getGasPrice().then(function (gasPrice) {
            _callback(gasPrice.toString());
            $rootScope.$apply();
        }, function (err) {

        });
    };

    this.getEtherPrice = function (_callback) {
        $http({
            method: 'GET',
            url: 'http://api.etherscan.io/api?module=stats&action=ethprice'
        }).then(function successCallback(response) {
           _callback(response.data.result);         
        }, function errorCallback(response) {
        });
    };

});