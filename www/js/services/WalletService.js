angular.module('WalletService', []).service('WalletService', function ($http) {
    this.Wallet = null;
    var Transactions = null;

    this.openWallet = function (privateKey) {
        if (privateKey.substring(0, 2) !== '0x') { privateKey = '0x' + privateKey; }
        this.Wallet = new ethers.Wallet(privateKey);
        this.Wallet.provider = new ethers.providers.getDefaultProvider(false);
        return this.Wallet;
    };

    this.getWallet = function(){
        return this.Wallet;
    };

    this.closeWallet = function () {
        this.Wallet = null;
    };

    this.getBalance = function (_callback) {
        this.Wallet.getBalance('pending').then(function (balance) {
            _callback(ethers.utils.formatEther(balance, { commify: true }));
        }, function (error) {

        });
    };
    this.getTransactionsCount = function (_callback) {
        $http({
            method: 'GET',
            url: 'http://api.etherscan.io/api?module=account&action=txlist&address=' + this.Wallet.address + '&startblock=0&endblock=99999999&sort=desc'
        }).then(function successCallback(response) {
            _callback(response.data.result.length);
        }, function errorCallback(response) {
        });
    };

    this.getTransactionsHistory = function (_callback) {
        $http({
            method: 'GET',
            url: 'http://api.etherscan.io/api?module=account&action=txlist&address=' + this.Wallet.address + '&startblock=0&endblock=99999999&sort=desc'
        }).then(function successCallback(response) {
            Transactions = response.data.result;        
            _callback(response.data.result);
        }, function errorCallback(response) {
        });
    };
    this.getTransaction = function(transactionId){
        for (var i = 0; i < Transactions.length; i++) {
            if (Transactions[i].hash === transactionId) {
                console.log(Transactions[i]);
              return Transactions[i];
            }
        }
        return null;
    };

    this.getGasPrice = function (_callback) {
        this.Wallet.provider.getGasPrice().then(function (gasPrice) {
            _callback(gasPrice.toString());
        }, function (err) {

        });
    };

    this.getEtherPrice = function ( coin , _callback) {
        $http({
            method: 'GET',
            url: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR'
        }).then(function successCallback(response) {
            console.log(response);
            _callback(response.data[coin]);
        }, function errorCallback(response) {
        });
    };

    this.sendEther = function (transactionInfo, _callback) {
        var amountWei = ethers.utils.parseEther(transactionInfo.amount.toString());
        this.Wallet.send(transactionInfo.targetAddress, amountWei, {
            gasPrice: transactionInfo.gasPrice,
            gasLimit: transactionInfo.gasLimit,
        }).then(function (transactionId) {
            _callback("The transfer has been successful, its identifier is " + transactionId.hash);
        }, function (error) {
            _callback(error);
        });
    };

    this.getETHPriceHistory = function ( coin , days, _callback) {
        var url = 'https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym='+coin+'&limit=' + days + '&aggregate=1&e=Kraken';
        if (days == 1) {
            url = 'https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym='+coin+'&limit=24&aggregate=1&e=Kraken';
        }
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            _callback(response.data.Data);
        }, function errorCallback(response) {
        });
    };

});