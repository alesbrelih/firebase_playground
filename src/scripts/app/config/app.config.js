///////////////////////////////////////////////
// ----- Configures Angular Application ---- //
///////////////////////////////////////////////

function appConfigModule(app,firebase){

    //initialize firebase
    require("../firebase/firebase.config")(firebase);

    // function that will configure app
    function appConfigFunction($firebaseRefProvider,$stateProvider,$urlRouterProvider){

        //firebase default url
        $firebaseRefProvider.registerUrl("https://scakapo-2f1c6.firebaseio.com");


        //register states
        $stateProvider
            .state("auth",{
                abstract:true,
                url:"/auth",
                template:"<auth-main></auth-main>"
            })
            .state("auth.login",{
                url:"/login",
                template:"<auth-login></auth-login>"
            });

        //if none of the states match
        $urlRouterProvider.otherwise("/auth/login");
    }

    //inject firebase ref provider to make app testable
    appConfigFunction.$inject = ["$firebaseRefProvider","$stateProvider","$urlRouterProvider"];

    //app configuration
    app.config(appConfigFunction);

}

//export config module
module.exports = appConfigModule;