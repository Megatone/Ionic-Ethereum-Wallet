
app.factory('SettingsService', function (localStorageService, $rootScope) {
    var settings = {};

    return {
        getSettings: function () {
            settings = (localStorageService.length() > 0) ? localStorageService.get('settings', 'localStorage') :
                {
                    coin: {
                        id: 0,
                        label: 'USD',
                        simbol: '$',
                    }, language: {
                        id: 'en',
                        label: 'English'
                    }
                };    
            localStorageService.set('settings', settings, 'localStorage');          
            return settings;
        },
        setSettings: function (_settings) {
            settings = _settings;
            localStorageService.set('settings', settings, 'localStorage');       
        }
    };
});
