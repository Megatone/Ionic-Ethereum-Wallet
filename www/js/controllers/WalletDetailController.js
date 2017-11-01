app.controller('WalletDetailController', function ($scope, $rootScope, $state, $stateParams, localStorageService, WalletsService, WalletService, $ionicModal, $q, $cordovaSocialSharing, $cordovaBarcodeScanner, $location, $translate) {

    $scope.RealWallet = null;
    $scope.wallet = WalletsService.getWallet($stateParams.address);
    $scope.Balance = 0;
    $scope.NumTransactions = 0;
    $scope.activeModal;
    $scope.EtherPrice = 0;
    $scope.canOpen = false;

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
        if ($rootScope.settings.avatars.id == 0) {
            return GeoPattern.generate($stateParams.address).toDataUrl();
        } else {
            return 'url(' + blockies.create({ seed: $stateParams.address.toLowerCase() }).toDataURL() + ')';
        }
    };

    $scope.removeWallet = function () {
        WalletsService.removeWallet($scope.wallet);
        $state.go('tab.wallets');
        $scope.closeModal();
    };

    $scope.$watch('wallet', function (newValue, oldValue) {
        $scope.canOpen = ($scope.wallet.password === '');
        openWallet();
    });

    function openWallet() {
        if ($scope.canOpen) {
            $scope.RealWallet = WalletService.openWallet($scope.wallet.privateKey);
            WalletService.getBalance(function (balance) {
                $scope.Balance = balance;
                apply();
            });
            WalletService.getTransactionsCount(function (transactionsCount) {
                $scope.NumTransactions = parseInt(transactionsCount);
                apply();
            });

            WalletService.getGasPrice(function (gasPrice) {
                $scope.InputsSendEtherBase.gasPrice = parseInt(gasPrice * 1);
                $scope.InputsSendEtherBase.transactionCost = ethers.utils.formatEther($scope.InputsSendEtherBase.gasPrice * $scope.InputsSendEtherBase.gasLimit);
                $scope.InputsSendEther = angular.copy($scope.InputsSendEtherBase);
                apply();
            });
            WalletService.getEtherPrice($rootScope.settings.coin.label, function (etherPrice) {
                $scope.EtherPrice = parseFloat(etherPrice);
                apply();
            });
        } else {
            $scope.openModal('templates/modals/modalOpenWalletPassword.html');
        }
    };
    $rootScope.$watch('settings.coin.label', function (newVal, oldVal) {
        if (newVal != oldVal) {
            openWallet();
        }
    });



    $scope.getBalance = function () {
        return parseFloat(parseFloat($scope.EtherPrice) * parseFloat($scope.Balance));
    };

    $scope.setPassword = function () {
        if ($scope.InputsModalSetPassword.password != '' && $scope.InputsModalSetPassword.password === $scope.InputsModalSetPassword.repeatPassword) {
            $scope.wallet.password = $scope.InputsModalSetPassword.password;
            WalletsService.updateWallet($scope.wallet);
            $scope.closeModal();
        } else {
            alert($translate.instant('AlertCompletePasswords'));
        }
    };

    $scope.unsetPassword = function () {
        $scope.wallet.password = '';
        WalletsService.updateWallet($scope.wallet);
        $scope.closeModal();
        alert($translate.instant('AlertPasswordRemoved'));

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
        if ($scope.InputModalOpenWalletPassword.password !== '') {
            if ($scope.InputModalOpenWalletPassword.password === $scope.wallet.password) {
                $scope.canOpen = true;
                openWallet();
                $scope.closeModal();
            } else {
                $scope.canOpen = false;
                alert($translate.instant('PasswordNotCorrect'));
                $scope.closeModalOpenWalletPassword();
            }
        } else {
            $scope.canOpen = false;
            alert($translate.instant('CompletePassword'));
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


    $scope.shareViaWhatsApp = function () {
        try {
            $cordovaSocialSharing.shareViaWhatsApp($scope.wallet.address, document.getElementsByClassName('qrcode-link')[0].href).then(function (result) {
            }, function (err) {
                alert($translate.instant('CannotShareWhatsApp'));
            });
        } catch (err) {
            alert($translate.instant('WhatsAppNotSuported') + err);
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
            alert($translate.instant('ScanCodeNotSuported') + err);
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
                return $translate.instant('Calculating') + '...';
            } else {
                return result;
            }
        }
        catch (err) {
            return $translate.instant('Calculating') + '...';
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
                throw "Error : " + $translate.instant('EnterPositiveAmount');
            if (parseFloat($scope.getTotalTransactionCost()) > parseFloat($scope.Balance))
                throw "Error : " + $translate.instant('TotalTransactionMoreBalance');
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

    $scope.openTransactionsHistory = function () {
        $location.url('/tab/transactions/' + $scope.RealWallet.address);
    };

    $scope.back = function () {
        $state.go('tab.wallets');
    };
});