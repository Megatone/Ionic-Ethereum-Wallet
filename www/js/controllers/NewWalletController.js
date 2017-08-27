app.controller('NewWalletController', function ($scope, $rootScope, $state, localStorageService, WalletsService, $ionicModal, $q) {
    $scope.newWallet = {
        name: '',
        address: '',
        privateKey: '',
        password : ''
    };
    $scope.modalNewWallet = {
        name: '',
        address: '',
        privateKey: '',
        password:''
    };

    $scope.createRandomWallet = function () {
        if ($scope.newWallet.name != '') {
            var wallet = ethers.Wallet.createRandom($scope.newWallet.name);
            $scope.newWallet.address = wallet.address;
            $scope.newWallet.privateKey = wallet.privateKey;
            WalletsService.addWallet($scope.newWallet);
            $state.go('tab.wallets');
        } else {
            alert("Complete the name field to create wallet");
        }
    };



    var init = function () {
        if ($scope.modal) {
            return $q.when();
        }
        else {
            return $ionicModal.fromTemplateUrl('modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            })
        }
    };

    $scope.openModal = function () {
        init().then(function () {
            $scope.modal.show();
        });
    };

    $scope.closeModal = function () {
        $scope.modalNewWallet = {
            name: '',
            address: '',
            privateKey: ''
        };
        $scope.modal.hide();
    };

    $scope.addWalletFromPrivateKey = function () {
        if ($scope.modalNewWallet.name != '') {
            if ($scope.modalNewWallet.privateKey.substring(0, 2) !== '0x') { $scope.modalNewWallet.privateKey = '0x' + $scope.modalNewWallet.privateKey; }
            try{
            var wallet = new ethers.Wallet($scope.modalNewWallet.privateKey);
            $scope.modalNewWallet.address = wallet.address;
            WalletsService.addWallet($scope.modalNewWallet);
            $scope.modal.hide();
            $state.go('tab.wallets');
            }catch(err){
                alert(err);
            }
        }else{
            alert("Complete the name field to create wallet");
        }
    };
});