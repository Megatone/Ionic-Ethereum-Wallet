app.controller('NewWalletController', function ($scope, $rootScope, $state, localStorageService, WalletsService, $ionicModal , $translate) {
    $scope.newWallet = {
        name: '',
        address: '',
        privateKey: '',
        password: ''
    };
    $scope.modalNewWallet = {
        name: '',
        address: '',  
        privateKey: '',
        password: ''
    };
    $scope.modalNewWalletJSON = {
        name : '',
        password : '',
        config : {}
    };
    $scope.FileName = '';

    $scope.createRandomWallet = function () {
        if ($scope.newWallet.name != '') {
            var wallet = ethers.Wallet.createRandom($scope.newWallet.name);
            $scope.newWallet.address = wallet.address;
            $scope.newWallet.privateKey = wallet.privateKey;
            WalletsService.addWallet($scope.newWallet);
            $state.go('tab.wallets');
        } else {
            alert($translate.instant('AlertCompleteNameField'));
        }
    };



    var init = function (template) {
        return $ionicModal.fromTemplateUrl(template, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
    };

    $scope.openModal = function (template) {
        init(template).then(function () {
            $scope.modal.show();
        });
    };

    $scope.closeModal = function () {
        $scope.modalNewWallet = {
            name: '',
            address: '',
            privateKey: ''
        };
        $scope.modalNewWalletJSON = {
            name : '',
            password : '',
            config : {}
        };
        $scope.FileName  = '';
        $scope.modal.hide();
    };

    $scope.addWalletFromPrivateKey = function () {
        if ($scope.modalNewWallet.name != '') {
            if ($scope.modalNewWallet.privateKey.substring(0, 2) !== '0x') { $scope.modalNewWallet.privateKey = '0x' + $scope.modalNewWallet.privateKey; }
            try {
                var wallet = new ethers.Wallet($scope.modalNewWallet.privateKey);
                $scope.modalNewWallet.address = wallet.address;
                WalletsService.addWallet($scope.modalNewWallet);
                $scope.closeModal();
                $state.go('tab.wallets');
            } catch (err) {
                alert(err);
            }
        } else {
            alert($translate.instant('AlertCompleteNameField'));
        }
    };

    $scope.uploadFile = function (event) {
        var file = event.target.files[0];   
        $scope.FileName = file.name; 
        $scope.$apply();
        var reader = new FileReader();

        reader.onload = (function (theFile) {
            return function (e) {      
                var strJson = atob(e.target.result.split(',')[1]);
                $scope.modalNewWalletJSON.config = JSON.parse(strJson);                          
            };
        })(file);
       
        reader.readAsDataURL(file);
    };

    $scope.Importing = false;
    $scope.ImportWalletFromJsonFile = function(){
        $scope.Importing = true;
        try{        
        var json = JSON.stringify($scope.modalNewWalletJSON.config);
        var password = $scope.modalNewWalletJSON.password;
        ethers.Wallet.fromEncryptedWallet(json, password).then(function(wallet) {
            var newWalletJSON ={
                name : $scope.modalNewWalletJSON.name,
                address : wallet.address,
                password : $scope.modalNewWalletJSON.password,
                privateKey : wallet.privateKey
            };
            WalletsService.addWallet(newWalletJSON);
            $scope.Importing = false;
            $scope.closeModal(); 
            $state.go('tab.wallets');      
        });
        }catch(err){
            alert('Import Failed');
            $scope.Importing = false;
        }
    };
   
    $scope.openExplorer = function(){
        document.getElementById('inputfile').click();
    };

});