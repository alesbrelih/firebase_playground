// --- AUTH LOGIN COMPONENT --- //

function authLoginComponentModule(app){

    //function auth login controller
    function authLoginController(AuthService){

        //this scope
        const vm = this;



        //user info object
        vm.UserInfo = {
            username: "",
            password: ""
        };


        // --- METHODS --- //
        vm.LoginIn = ()=>{

            //try to login
            AuthService.$signInWithEmailAndPassword(vm.UserInfo.username,vm.UserInfo.password)
                .then(firebaseUser => {

                    console.log(firebaseUser);

                }).catch(err=>{
                    console.log(err);
                });
        };


    }

    //inject authservice
    authLoginController.$inject = ["AuthService"];


    app.component("authLogin",{
        controller: authLoginController,
        controllerAs: "vm",
        templateUrl: "/scripts/templates/auth/auth.login.component.html"
    });

}
module.exports = authLoginComponentModule;