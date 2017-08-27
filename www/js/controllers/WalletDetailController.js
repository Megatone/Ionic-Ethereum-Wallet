app.controller('WalletDetailController', function ($scope, $rootScope, $state, $stateParams, localStorageService, WalletsService, WalletService, $ionicModal, $q) {

    $scope.RealWallet = null;
    $scope.wallet = WalletsService.getWallet($stateParams.address);
    $scope.Balance = 0;
    $scope.NumTransactions = 0;
    $scope.activeModal;
    $scope.Transactions = [];

    $scope.InputsModalSetPassword = {
        password: '',
        repeatPassword: ''
    };

    $scope.InputModalOpenWalletPassword = {
        password: ''
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
    };

    $scope.setPassword = function () {
        if ($scope.InputsModalSetPassword.password != '' && $scope.InputsModalSetPassword.password == $scope.InputsModalSetPassword.repeatPassword) {
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
        if ($scope.activeModal) {
            return $q.when();
        }
        else {
            return $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.activeModal = modal;
            });
        }
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
        try{  
        document.getElementById("list-transactionHistory").firstChild.style.height = (window.screen.height - 132) + "px";      
        }catch(err){}
    };
});