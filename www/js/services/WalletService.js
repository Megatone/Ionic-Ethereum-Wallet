angular.module('WalletService', []).service('WalletService', function ($rootScope, $state) {
    var Wallet = null;

    this.setWallet = function (_wallet) {
        this.Wallet = _wallet;
    };

    this.getWallet = function () {
        return this.Wallet;
    };

    this.isWalletLoaded = function () {
        return (this.Wallet != null)
    };

    this.openWallet = function (privateKey) {
        if (privateKey.substring(0, 2) !== '0x') { privateKey = '0x' + privateKey; }
        this.Wallet = new ethers.Wallet(privateKey);
        this.Wallet.provider = new ethers.providers.getDefaultProvider(false);
        
        window.location = "#/tab/wallet";
    };

    this.getBalance = function (_callback) {
        this.Wallet.getBalance('pending').then(function (balance) {
            _callback(ethers.utils.formatEther(balance, { commify: true }));
            $rootScope.$apply();
        }, function (error) {

        });
    }
});