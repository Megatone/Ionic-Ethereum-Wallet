
app.factory("FirebaseService", function () {
    var rootRef = firebase.database().ref();
    var uuid = '';   

    return {
        setUuid: function (_uuid) {            
            uuid = _uuid;           
            rootRef.child('Devices/' + _uuid + '/uuid').set(_uuid);
        },
        setToken: function (_token) {          
            rootRef.child('Devices/' + uuid + '/token').set(_token);
        },      
        getSettings: function (_callback) {
            rootRef.child('Devices/' + uuid).on('value', function (snapshot) {
                _callback(snapshot.val());
            });
        },
        setSettings : function(_settings){
            rootRef.child('Devices/' + uuid).set(_settings);
        }    
    }
});