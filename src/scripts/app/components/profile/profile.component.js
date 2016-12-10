// ----- exported module ---- //
function profileComponentModule(app){

    //component controller
    function profileComponentController(ProfileService){

        const vm = this;

        //profile from db
        vm.Profile = ProfileService.ReturnProfile();

        //profile copy
        // vm.EditProfile = {
        //     name:vm.Profile.name,
        //     lastname:vm.Profile.lastname,
        //     username:vm.Profile.username
        // };
        vm.EditProfile = null;



    }

    //inject needed services
    profileComponentController.$inject = ["ProfileService"];

    //register component
    app.component("profile",{
        controller:profileComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/profile/profile.component.html"
    });

}

module.exports = profileComponentModule;