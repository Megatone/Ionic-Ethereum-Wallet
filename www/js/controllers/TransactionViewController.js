app.controller("TransactionViewController", function ($scope,  WalletService,  $stateParams) {
    $scope.RealWallet = WalletService.getWallet();
    $scope.Transaction = WalletService.getTransaction($stateParams.transactionId);

    $scope.getDateTransacction = function (timeStamp) {
        var d = new Date(timeStamp * 1000);
        return d.toISOString();
    };

    $scope.getTransactionCost = function(){
       return format(parseFloat($scope.Transaction.gasPrice) * parseFloat($scope.Transaction.gasUsed));
    };
    $scope.getTransactionValue = function(){
        return getSimbolTransaction() + format($scope.Transaction.value);
    };

    function format(value){
        try{
            return ethers.utils.formatEther(value.toString());
        }catch(err){
            return 0;
        }
    };
    
    $scope.getColorTransactionClass = function () {
        if($scope.RealWallet.address.toUpperCase() === $scope.Transaction.from.toUpperCase()){
            return 'error-amount';
        } else {
            return 'success-amount';
        }
    };

    function getSimbolTransaction() {
        if($scope.RealWallet.address.toUpperCase() === $scope.Transaction.from.toUpperCase()){
            return '- ';
        } else {
            return '+ ';
        }
    };
});