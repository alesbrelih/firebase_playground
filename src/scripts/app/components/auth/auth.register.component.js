
// -------- AUTH REGISTER COMPONENT MODULE ----- ///

function authRegisterComponentModule(app) {

    //auth register component controller
    function authRegisterController(AuthService) {

        const vm = this;


        //user object
        vm.User = {
            email: "",
            password: "",
            confirm: ""
        };


        //register user
        vm.Register = () => {
            AuthService.RegisterWithEmailAndPwd(vm.User.email,vm.User.password);
        };
    }

    //inject service
    authRegisterController.$inject = ["AuthService"];


    //Register component
    app.component("authRegister",{
        templateUrl:"/scripts/templates/auth/auth.register.component.html",
        controller: authRegisterController,
        controllerAs: "vm"
    });

}

//export module for browserify
module.exports = authRegisterComponentModule;