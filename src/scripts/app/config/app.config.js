///////////////////////////////////////////////
// ----- Configures Angular Application ---- //
///////////////////////////////////////////////

function appConfigModule(app, firebase) {
    app.constant("Firebase",firebase);
    app.constant("FirebaseUrl", "https://scakapo-2f1c6.firebaseio.com/");
    app.constant("MainState","main.chat");
    app.constant("UploadStatus",{
        error:"error uploading",
        success:"upload successful"
    });




    //initialize firebase
    require("../firebase/firebase.config")(firebase);

    // function that will configure app
    function appConfigFunction($firebaseRefProvider, $stateProvider, $urlRouterProvider, FirebaseUrl) {

        //firebase default url
        $firebaseRefProvider.registerUrl({
            default: FirebaseUrl,
            profiles: FirebaseUrl + "profiles",
            profilePhotos:FirebaseUrl+"profile-photos",
            userRooms:FirebaseUrl+"user-rooms",
            rooms:FirebaseUrl+"rooms",
            roomUsers:FirebaseUrl+"room-users",
            roomMessages:FirebaseUrl+"room-messages",
            connected:FirebaseUrl+"connected"

        });


        //auth states
        $stateProvider

            // --- AUTH STATES --- //
            .state("auth", {
                abstract: true,
                url: "/auth",
                template: "<auth-main></auth-main>"
            })
            .state("auth.login", {
                url: "/login",
                template: "<auth-login></auth-login>"
            })
            .state("auth.register", {
                url: "/register",
                template: "<auth-register></auth-register>"
            })

            // --- MAIN COMPONENT --- ///;
            .state("main", {
                abstract:true,
                template: "<main></main>",
                resolve: {
                    Authentication: ["Auth", function (Auth) {
                        return Auth.$requireSignIn();
                    }]
                }

            })
            // ---- profile route ---- //
            .state("main.profile",{
                url:"/profile",
                template:"<profile></profile>",
                resolve:{
                    Profile:["ProfileService","Auth",function(ProfileService,Auth){
                        return Auth.$requireSignIn();


                    }]
                }
            })
            // ---- chat route ---- //
            .state("main.chat",{
                url:"/chat",
                template:"<chat-main></chat-main>"
            });


        //if none of the states match
        $urlRouterProvider.otherwise("/auth/login");
    }


    //inject firebase ref provider to make app testable
    appConfigFunction.$inject = ["$firebaseRefProvider", "$stateProvider", "$urlRouterProvider", "FirebaseUrl"];


    //app configuration
    app.config(appConfigFunction);

    //catch auth error
    // for ui-router
    app.run(["$rootScope", "$state", function ($rootScope, $state) {
        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireSignIn promise is rejected
            // and redirect the user back to the home page
            event.preventDefault();
            console.log("errrrrr");
            if(error){
                console.log("error",error);
            }
            if (error === "AUTH_REQUIRED") {
                console.log("Not Authorized");
                $state.go("auth.login");
            }
        });
    }]);

}

//export config module
module.exports = appConfigModule;