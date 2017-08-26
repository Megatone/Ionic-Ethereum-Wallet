
app.factory('Transactions', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var transactions = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return transactions;
    },
    remove: function(transaction) {
      transactions.splice(transactions.indexOf(transaction), 1);
    },
    get: function(transactionId) {
      for (var i = 0; i < transactions.length; i++) {
        if (transactions[i].id === parseInt(transactionId)) {
          return transactions[i];
        }
      }
      return null;
    }
  };
});
