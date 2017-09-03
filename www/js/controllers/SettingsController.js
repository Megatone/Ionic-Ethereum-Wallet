app.controller('SettingsController', function ($scope, $rootScope, SettingsService, $filter ,$translate) {

    $scope.Coins = [
        {
            id: 0,
            label: 'USD',
            simbol: '$',
        }, {
            id: 1,
            label: 'EUR',
            simbol: '€',
        }
    ];

    $scope.Languages = [
        {
            id: 'en',
            label: 'English'
        }, {
            id: 'es',
            label: 'Spanish'
        }
    ];

    

    var storageSetting = SettingsService.getSettings();

    $scope.Settings = {
        coin: filter($scope.Coins, storageSetting.coin),
        language: filter($scope.Languages, storageSetting.language)
    };
    $scope.settingsChanged = function () {
        SettingsService.setSettings($scope.Settings);
        $rootScope.settings = angular.copy(SettingsService.getSettings());
        $translate.use( $rootScope.settings.language.id);
        apply();
    };

    function filter(list, obj) {
        var o = $filter('filter')(list, { id: obj.id }, true)[0];
        return o;
    };

   // apply(function(){TranslationService.getTranslation($scope, $rootScope.settings.language.id)});
    function apply(_callback) {
        try {
            if (!$scope.$$phase) {               
                $scope.$apply(_callback);
            } else{
                setTimeout(function(){apply(_callback)},51);
            }
        } catch (err) {
        }
    };
});