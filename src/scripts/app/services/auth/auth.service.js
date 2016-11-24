///////////////////////////////////////////////////
// ------- Auth Factory using Firebase auth ---- //
///////////////////////////////////////////////////

function authServiceModule(app){

    //factory controller that returns firebaseauth object
    function authFactory($firebaseAuth){
        return $firebaseAuth();
    }

    //inject firebase auth
    authFactory.$inject = ["$firebaseAuth"];

    app.factory("AuthService",authFactory);
}

//export auth module
module.exports = authServiceModule;
