///////////////////////////////////////////////
// ----- Configures Angular Application ---- //
///////////////////////////////////////////////

function appConfigModule(app,firebase){

    app.constant("FirebaseUrl","https://scakapo-2f1c6.firebaseio.com/");

    //initialize firebase
    require("../firebase/firebase.config")(firebase);

    // function that will configure app
    function appConfigFunction($firebaseRefProvider,$stateProvider,$urlRouterProvider,FirebaseUrl){

        //firebase default url
        $firebaseRefProvider.registerUrl({
            default:FirebaseUrl,
            profiles:FirebaseUrl+"profiles"
        });


        //auth states
        $stateProvider

            // --- AUTH STATES --- //
            .state("auth",{
                abstract:true,
                url:"/auth",
                template:"<auth-main></auth-main>"
            })
            .state("auth.login",{
                url:"/login",
                template:"<auth-login></auth-login>"
            })
            .state("auth.register",{
                url:"/register",
                template: "<auth-register></auth-register>"
            })

            // --- MAIN COMPONENT --- ///;
            .state("main",{
                //abstract:true,
                url:"/main",
                template:"<main></main>"
            });


        //if none of the states match
        $urlRouterProvider.otherwise("/auth/login");
    }

    //inject firebase ref provider to make app testable
    appConfigFunction.$inject = ["$firebaseRefProvider","$stateProvider","$urlRouterProvider","FirebaseUrl"];

    //app configuration
    app.config(appConfigFunction);

}

//export config module
module.exports = appConfigModule;