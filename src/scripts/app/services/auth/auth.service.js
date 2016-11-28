///////////////////////////////////////////////////
// ------- Auth Factory using Firebase auth ---- //
///////////////////////////////////////////////////

function authServiceModule(app){

    //factory controller that returns firebaseauth object
    function authFactory($firebaseAuth,$state){

        const firebaseAuth = $firebaseAuth();

        var auth = {};

        auth.RegisterWithEmailAndPwd = (email,pwd) => {

            //registers using firebase register with email and pwd
            return firebaseAuth.$createUserWithEmailAndPassword(email, pwd)
                .then(firebaseUser => {
                    console.log("User " + firebaseUser.uid + " created successfully!");
                }, err => {
                    console.log(err);
                });

        };

        auth.SignInWithEmailAndPwd = (email,pwd) => {

            console.log("login in");
            //signs in using firebase auth
            return firebaseAuth.$signInWithEmailAndPassword(email,pwd)
                .then(firebaseUser => {

                    console.log(firebaseUser);

                },
                err => {
                    console.log(err);
                });

        };

        // ---- publics --- //
        return auth;
    }

    //inject firebase auth
    authFactory.$inject = ["$firebaseAuth","$state"];

    app.factory("AuthService",authFactory);
}

//export auth module
module.exports = authServiceModule;
