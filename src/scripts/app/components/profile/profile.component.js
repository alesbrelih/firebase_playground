// ----- exported module ---- //
function profileComponentModule(app){

    //component controller
    function profileComponentController(ProfileService){

        const vm = this;

        //select photo flag to shwo modal
        vm.selectPhoto = false;

        //profile from db
        vm.Profile = ProfileService.ReturnProfile();

        //profile copy
        // vm.EditProfile = {
        //     name:vm.Profile.name,
        //     lastname:vm.Profile.lastname,
        //     username:vm.Profile.username
        // };
        vm.EditProfile = null;

        //select profile photo
        vm.selectProfilePhoto = ()=>{
            vm.selectPhoto = true;
            const modal= ProfileService.OpenProfilePhotoSelect();
            modal.then(photoUrl=>{
                console.log(photoUrl);
                vm.selectPhoto = false;
            })
            .catch(err=>{
                console.error("Error",err);
                vm.selectPhoto = false;
            });
        };



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