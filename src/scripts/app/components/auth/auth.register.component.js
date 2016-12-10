
// -------- AUTH REGISTER COMPONENT MODULE ----- ///

function authRegisterComponentModule(app) {

    //auth register component controller
    function authRegisterController(ProfileService) {

        const vm = this;


        //user object
        vm.User = {
            email: "",
            password: "",
            confirm: ""
        };


        //register user
        vm.Register = () => {
            ProfileService.RegisterWithEmailAndPwd(vm.User.email,vm.User.password);
        };
    }

    //inject service
    authRegisterController.$inject = ["ProfileService"];


    //Register component
    app.component("authRegister",{
        templateUrl:"/scripts/templates/auth/auth.register.component.html",
        controller: authRegisterController,
        controllerAs: "vm"
    });

}

//export module for browserify
module.exports = authRegisterComponentModule;