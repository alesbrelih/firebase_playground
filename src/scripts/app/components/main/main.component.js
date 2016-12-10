// ---- MAIN COMPONENT - WRAPPER -- MODULE ----- //
function mainComponentModule(app){

    function mainComponentController(ProfileService){

        //current scope
        const vm = this;

        vm.Profile = ProfileService.ReturnProfile();

        vm.signOut = ()=>{
            ProfileService.SignOut();
        };
    }
    //inject service
    mainComponentController.$inject = ["ProfileService"];


    //register component
    app.component("main",{
        controller:mainComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/main/main.component.html"
    });

}

module.exports = mainComponentModule;