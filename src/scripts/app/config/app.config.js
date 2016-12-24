///////////////////////////////////////////////
// ----- Configures Angular Application ---- //
///////////////////////////////////////////////

function appConfigModule(app, firebase) {
    app.constant("Firebase",firebase);
    app.constant("FirebaseUrl", "https://scakapo-2f1c6.firebaseio.com/");
    app.constant("MainState","main.profile");
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

            //profile
            default: FirebaseUrl,
            profiles: FirebaseUrl + "profiles",
            profilePhotos:FirebaseUrl+"profile-photos",
            connected:FirebaseUrl+"connected",

            //public room refs
            userRooms:FirebaseUrl+"user-rooms",
            rooms:FirebaseUrl+"rooms",
            roomUsers:FirebaseUrl+"room-users",
            roomMessages:FirebaseUrl+"room-messages",

            //private rooms ref
            userPrivateRooms:FirebaseUrl+"user-privates",
            privateRooms:FirebaseUrl+"private-rooms",
            privateRoomUsers:FirebaseUrl+"private-room-users",
            privateRoomMessages:FirebaseUrl+"private-room-messages",

            //queue to join user
            joinPrivateQueue:FirebaseUrl+"join-private-room/tasks"
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
                    Profile:["Auth",function(Auth){
                        return Auth.$requireSignIn();


                    }]
                }
            })
            // ---- chat route ---- //
            .state("main.chat",{
                url:"/chat",
                template:"<chat-main></chat-main>"
            })

            // ---- see others user profile page ---- //
            .state("main.user",{
                url:"/user/:id",
                template:"<user user='$resolve.User'></user>",
                resolve:{
                    Profile:["Auth",function(Auth){
                        return Auth.$requireSignIn();
                    }],
                    User:["UserService","$stateParams",function(UserService,$stateParams){
                        console.log($stateParams.id);
                        return UserService.GetProfile($stateParams.id);
                    }]
                }

            });


        //if none of the states match
        $urlRouterProvider.otherwise("/profile");
    }


    //inject firebase ref provider to make app testable
    appConfigFunction.$inject = ["$firebaseRefProvider", "$stateProvider", "$urlRouterProvider", "FirebaseUrl"];


    //app configuration
    app.config(appConfigFunction);


    app.run(["$rootScope", "$state","$firebaseRef","Auth","toastr", function ($rootScope, $state,$firebaseRef,Auth,toastr) {

        //catch state change
        $rootScope.$on("$stateChangeStart",function(event, toState, toParams, fromState, fromParams, options){


            if(toState.name == "main.chat"){ //if going to chat check if user set its username on profile

                const user = Auth.$getAuth();

                //if user logged
                if(user){
                    $firebaseRef.profiles.child(user.uid).once("value")
                    .then(snap=>{
                        if(snap.child("username").exists()){ //username exists
                            $state.go("main.chat"); //go to chat
                        }
                        else{
                            event.preventDefault();
                            $state.go("main.profile"); //username wasnt set, go to profile
                            toastr.error("Set your username first.","Error");
                        }
                    });
                }

            }
        });
        //catch auth error
        // for ui-router
        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireSignIn promise is rejected
            // and redirect the user back to the home page
            event.preventDefault();
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