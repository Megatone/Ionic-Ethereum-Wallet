
app.factory('WalletsService', function (localStorageService) {
  var wallets = [];

  function saveWallets() {
    localStorageService.set('wallets', wallets, 'localStorage');
  };

  return {
    getWallets: function () {
      wallets = (localStorageService.length() > 1) ? localStorageService.get('wallets', 'localStorage') : [];
      return wallets;
    },
    removeWallet: function (wallet) {
      wallets.splice(wallets.indexOf(wallet), 1);
      saveWallets();
    },
    getWallet: function (address) {
      for (var i = 0; i < wallets.length; i++) {
        if (wallets[i].address === address) {
          return wallets[i];
        }
      }
      return null;
    },
    addWallet: function (wallet) {
      if (this.getWallet(wallet.address) == null) {
        wallets.push(wallet);
        saveWallets();
      } else {
        alert("This wallet is already registered in the application.");
      }
    },
    updateWallet: function (wallet) {
      for (var i = 0; i < wallets.length; i++) {
        if (wallets[i].address === wallet.address) {
          wallets[i] = wallet;
          saveWallets();
        }
      }
    }
  };
});
