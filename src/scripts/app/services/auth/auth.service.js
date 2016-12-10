///////////////////////////////////////////////////
// ------- Auth Factory using Firebase auth ---- //
///////////////////////////////////////////////////

function authServiceModule(app){

    //factory controller that returns firebaseauth object
    function authFactory($firebaseAuth){

        const firebaseAuth = $firebaseAuth();

        return firebaseAuth;


    }

    //inject firebase auth
    authFactory.$inject = ["$firebaseAuth"];

    app.factory("Auth",authFactory);
}

//export auth module
module.exports = authServiceModule;
