app.controller('WalletDetailController', function ($scope, $rootScope, $state, $stateParams, localStorageService, WalletsService, WalletService, $ionicModal, $q, $cordovaSocialSharing, $cordovaBarcodeScanner) {

    $scope.RealWallet = null;
    $scope.wallet = WalletsService.getWallet($stateParams.address);
    $scope.Balance = 0;
    $scope.NumTransactions = 0;
    $scope.activeModal;
    $scope.Transactions = [];
    $scope.EtherPriceUSD = 0;

    $scope.InputsModalSetPassword = {
        password: '',
        repeatPassword: ''
    };

    $scope.InputModalOpenWalletPassword = {
        password: ''
    };
    $scope.InputsSendEtherBase = {
        targetAddress: '',
        amount: 0,
        gasPrice: 0,
        gasLimit: 21000,
        transactionCost: 0,
        rangeGasPrice: 100
    };

    $scope.getAvatar = function () {
        var pattern = GeoPattern.generate($stateParams.address);
        return pattern.toDataUrl();
    };

    $scope.removeWallet = function () {
        WalletsService.removeWallet($scope.wallet);
        $state.go('tab.wallets');
        $scope.closeModal();
    };

    $scope.$watch('wallet', function (newValue, oldValue) {
        if ($scope.wallet.password !== '') {
            $scope.openModal('templates/modals/modalOpenWalletPassword.html');
        } else {
            openWallet();
        }
    });

    function openWallet() {
        $scope.RealWallet = WalletService.openWallet($scope.wallet.privateKey);
        WalletService.getBalance(function (balance) {
            $scope.Balance = balance;
            apply();
        });
        WalletService.getTransactionsCount(function (transactionsCount) {
            $scope.NumTransactions = parseInt(transactionsCount);
            apply();
        });
        WalletService.getTransactionsHistory(function (transactions) {
            $scope.Transactions = transactions;
            apply();
        });
        WalletService.getGasPrice(function (gasPrice) {
            $scope.InputsSendEtherBase.gasPrice = parseInt(gasPrice * 1);
            $scope.InputsSendEtherBase.transactionCost = ethers.utils.formatEther($scope.InputsSendEtherBase.gasPrice * $scope.InputsSendEtherBase.gasLimit);
            $scope.InputsSendEther = angular.copy($scope.InputsSendEtherBase);
            apply();
        });
        WalletService.getEtherPriceUSD(function (etherPriceUSD) {
            $scope.EtherPriceUSD = parseFloat(etherPriceUSD);
            apply();
        });
    };

    $scope.getBalanceToUSD = function () {
        return parseFloat(parseFloat($scope.EtherPriceUSD) * parseFloat($scope.Balance));
    };

    $scope.setPassword = function () {
        if ($scope.InputsModalSetPassword.password != '' && $scope.InputsModalSetPassword.password === $scope.InputsModalSetPassword.repeatPassword) {
            $scope.wallet.password = $scope.InputsModalSetPassword.password;
            WalletsService.updateWallet($scope.wallet);
            $scope.closeModal();
        } else {
            alert("Complete passwords fields with same text for set password on wallet");
        }
    };

    $scope.unsetPassword = function () {
        $scope.wallet.password = '';
        WalletsService.updateWallet($scope.wallet);
        $scope.closeModal();
        alert("now the wallet haven't password");
    };

    $scope.reloadWallet = function () {
        openWallet();
    };

    var initModal = function (templateUrl) {
        return $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.activeModal = modal;
        });

    };

    $scope.openModal = function (templateUrl) {
        initModal(templateUrl).then(function () {
            $scope.activeModal.show();
        });
    };

    $scope.closeModal = function () {
        $scope.activeModal.remove();
        $scope.activeModal = undefined;
        $scope.InputsModalSetPassword = {
            password: '',
            repeatPassword: ''
        };
        $scope.InputModalOpenWalletPassword = {
            password: ''
        };
        $scope.InputsSendEther = angular.copy($scope.InputsSendEtherBase);
    };

    $scope.closeModalOpenWalletPassword = function () {
        $scope.closeModal();
        $state.go('tab.wallets');
    };

    $scope.openWalletPassword = function () {
        if ($scope.InputModalOpenWalletPassword.password != '') {
            if ($scope.InputModalOpenWalletPassword.password === $scope.wallet.password) {
                openWallet();
                $scope.closeModal();
            } else {
                alert('The password is not correct.');
                $scope.closeModalOpenWalletPassword();
            }
        } else {
            alert('Enter the password field');
        }
    };

    function apply() {
        try {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        } catch (err) {

        }
    };

    $scope.getDateTransacction = function (timeStamp) {
        var d = new Date(timeStamp * 1000);
        return d.toISOString();
    };

    $scope.attachListToScreen = function () {
        try {

            document.getElementById("list-transactionHistory").firstChild.style.height = (window.screen.height - 132) + "px !important;";

        } catch (err) { }
    };

    $scope.shareViaWhatsApp = function () {
        try {
            $cordovaSocialSharing.shareViaWhatsApp($scope.wallet.address, document.getElementsByClassName('qrcode-link')[0].href).then(function (result) {
                alert("Shared address on WhatsApp");
            }, function (err) {
                alert("Cannot share on WhatsApp");
            });
        } catch (err) {
            alert("WhatsApp not suported" + err);
        }
    };

    $scope.scanCode = function () {
        try {
            $cordovaBarcodeScanner.scan().then(function (barcodeData) {
                $scope.InputsSendEther.targetAddress = validateAdress(barcodeData.text) ? barcodeData.text : '';
            }, function (error) {
                alert(err);
            });
        } catch (err) {
            alert('Scan Code not Suported' + err);
        }
    };

    function validateAdress(address) {
        try {
            ethers.utils.getAddress(address);
        } catch (err) {
            alert(err);
            return false;
        }
        return true
    };

    $scope.getTotalTransactionCost = function () {
        try {
            var result = parseFloat(parseFloat($scope.InputsSendEther.amount) + parseFloat($scope.InputsSendEther.transactionCost));
            if (isNaN(result)) {
                return 'Calculating...';
            } else {
                return result;
            }
        }
        catch (err) {
            return 'Calculating...';
        }
    };

    $scope.sendEther = function () {
        if (checkTransactionValues()) {
            WalletService.sendEther(angular.copy($scope.InputsSendEther), function (resultTransaction) {
                alert(resultTransaction);
                $scope.closeModal();
                openWallet();
            });
        }
    };

    function checkTransactionValues() {
        try {
            ethers.utils.getAddress($scope.InputsSendEther.targetAddress);
            if ($scope.InputsSendEther.amount <= 0)
                throw "Error : Please enter positive amout.";
            if (parseFloat($scope.getTotalTransactionCost()) > parseFloat($scope.Balance))
                throw "Error : Total Transaction amount is more that your balance";
        } catch (error) {
            alert(error);
            return false;
        }
        return true;
    };

    $scope.changeRangeGasPrice = function () {
        var percent = parseInt($scope.InputsSendEther.rangeGasPrice);
        var maxGasPrice = $scope.InputsSendEtherBase.gasPrice;
        var minGasPrice = ((maxGasPrice / 100) * 10);
        var diference = maxGasPrice - minGasPrice;
        var result = minGasPrice + ((diference / 100) * percent);
        $scope.InputsSendEther.gasPrice = result;
        $scope.InputsSendEther.transactionCost = ethers.utils.formatEther($scope.InputsSendEther.gasPrice * $scope.InputsSendEther.gasLimit);
        apply();
    };

    $scope.getTotalAmountClass = function () {
        if (parseFloat($scope.getTotalTransactionCost()) > parseFloat($scope.Balance)) {
            return 'error-amount';
        } else {
            return 'success-amount';
        }
    };
});