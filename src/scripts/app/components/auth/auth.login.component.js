// --- AUTH LOGIN COMPONENT --- //

function authLoginComponentModule(app){

    //function auth login controller
    function authLoginController(AuthService){

        //this scope
        const vm = this;



        //user info object
        vm.User = {
            email: "",
            password: ""
        };


        // --- METHODS --- //
        vm.Login = ()=>{

            //try to login
            AuthService.SignInWithEmailAndPwd(vm.User.email,vm.User.password);
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