
app.controller('TransactionDetailController', function($scope, $stateParams, Transactions) {
    $scope.transaction = Transactions.get($stateParams.transactionId);
  })