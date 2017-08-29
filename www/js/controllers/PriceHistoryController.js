app.controller('PriceHistoryController', function ($scope, $rootScope, WalletService) {

    $scope.TimeLabels = [{
        days: 30,
        label: 'MONTH'
    }, {
        days: 365,
        label: 'YEAR'
    }, {
        days: 1,
        label: 'DAY'
    }];

    $scope.IndexTimeLabel = 0;


    $scope.EtherPriceUSD = 0
    $scope.labels = [];
    $scope.series = ['USD'];
    $scope.data = [[]];

    $scope.colors = ["#387ef5"];
    $scope.options = {
        scales: {
            yAxes: [{ display: false }],
            xAxes: [{ display: false }]
        }
    };

    init();
    function init() {
        getEtherPriceHistory();
        refreshEtherPriceUSD();
    };

    function getEtherPriceHistory() {
        $scope.labels = [];
        $scope.data[0] = [];
        var days = $scope.TimeLabels[$scope.IndexTimeLabel].days;
        WalletService.getETHPriceHistory(days, function (data) {
            for (var i = 0; i <= data.length - 1; i++) {
                var d = new Date(data[i].time * 1000);
                var yyyy = d.getFullYear().toString();
                var MM = (d.getMonth() + 101).toString().slice(-2);
                var dd = (d.getDate() + 100).toString().slice(-2);
                var hh = (d.getHours()).toString().slice(-2);
              

                $scope.labels.push((days == 1) ?dd + '-' + MM + '-' + yyyy + ' '+ hh + ':00': dd + '-' + MM + '-' + yyyy);
                $scope.data[0].push(data[i].close);
            }
        });
    };

    function refreshEtherPriceUSD() {
        WalletService.getEtherPriceUSD(function (etherPriceUSD) {
            $scope.EtherPriceUSD = etherPriceUSD;
        });
        setTimeout(function () {
            refreshEtherPriceUSD();
        }, 3000);
    };

    $scope.backHistory = function () {
        $scope.IndexTimeLabel = ($scope.IndexTimeLabel == 0) ? $scope.TimeLabels.length - 1 : $scope.IndexTimeLabel - 1;
        getEtherPriceHistory();
    };

    $scope.nextHistory = function () {
        $scope.IndexTimeLabel = ($scope.IndexTimeLabel == $scope.TimeLabels.length - 1) ? 0 : $scope.IndexTimeLabel = $scope.IndexTimeLabel + 1;
        getEtherPriceHistory();
    };

});