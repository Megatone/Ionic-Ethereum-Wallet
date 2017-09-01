app.controller("TransactionsHistoryController", function ($scope, $rootScope, $state, $stateParams, localStorageService, WalletsService, WalletService  , $location) {
    $scope.wallet = WalletsService.getWallet($stateParams.address);
    $scope.Transactions = [];

    $scope.$watch('wallet', function (newValue, oldValue) {
        WalletService.getTransactionsHistory(function (transactions) {
            $scope.Transactions = transactions;
            apply();
        });
    });

    $scope.getDateTransacction = function (timeStamp) {
        var d = new Date(timeStamp * 1000);
        return d.toISOString();
    };

    function apply() {
        try {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        } catch (err) {

        }
    };

    $scope.openTransactionView = function(transactionId){
        $location.url('/tab/transaction/' + transactionId );
    };

});