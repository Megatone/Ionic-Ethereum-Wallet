app.controller("ToolsController", function ($scope, $rootScope, WalletService) {


    $scope.EtherPrice = 0;

    init();

    function init() {
        getEtherPrice();
    };

    $scope.ToolETHFIAT = {
        eth: 0,
        fiat: 0
    };
    $scope.ToolFIATETH = {
        eth: 0,
        fiat: 0
    };

    function getEtherPrice() {
        WalletService.getEtherPrice($rootScope.settings.coin.label, function (etherPrice) {
            $scope.EtherPrice = etherPrice;
        });
    };

    $scope.ethToFiat = function () {
        try {
            if ($scope.ToolETHFIAT.eth === null) throw "";
            if (isNaN($scope.ToolETHFIAT.eth)) throw "";
            $scope.ToolETHFIAT.fiat = parseFloat($scope.ToolETHFIAT.eth) * parseFloat($scope.EtherPrice);
        } catch (err) {
            $scope.ToolETHFIAT.fiat = $translate.instant('Calculating') + "...";
        }
    };

    $scope.fiatToEth = function () {
        try {
            if ($scope.ToolFIATETH.fiat === null) throw "";
            if (isNaN($scope.ToolFIATETH.fiat)) throw "";
            $scope.ToolFIATETH.eth = parseFloat($scope.ToolFIATETH.fiat) / parseFloat($scope.EtherPrice);
        } catch (err) {
            $scope.ToolFIATETH.eth = $translate.instant('Calculating') + "...";
        }
    };

    $rootScope.$watch('settings.coin.label', function (newVal, oldVal) {
        if (newVal != oldVal) {
            getEtherPrice();
            $scope.ToolETHFIAT = {
                eth: 0,
                fiat: 0
            };
            $scope.ToolFIATETH = {
                eth: 0,
                fiat: 0
            };
        }
    });
});