app.controller('TransactionsController', function ($scope, Transactions) {
  $scope.transactions = Transactions.all();
  $scope.remove = function (transaction) {
    Transactions.remove(transaction);
  };
})