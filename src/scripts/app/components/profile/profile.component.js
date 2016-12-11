// ----- exported module ---- //
function profileComponentModule(app) {

    //component controller
    function profileComponentController(ProfileService) {

        const vm = this;

        //select photo flag to shwo modal
        vm.selectPhoto = false;

        //edit photo started flg
        vm.photoEdited = false;

        //profile from db
        vm.profile = ProfileService.ReturnProfile();

        //set edit profile once profile ref loaded
        vm.profile.$loaded(item => {
            vm.editProfile = {
                name: item.name,
                lastname: item.lastname,
                username: item.username,
                photo: item.photo
            };
        }, err => {
            vm.editProfile = {};
            console.error("err",err);
        });



        //select profile photo
        vm.selectProfilePhoto = () => {
            vm.selectPhoto = true;
            const modal = ProfileService.OpenProfilePhotoSelect();
            modal.then(photoUrl => {
                vm.editProfile.photo = photoUrl;

                //hide select photo modal
                vm.selectPhoto = false;

                //flag that something changed
                vm.photoEdited = true;
            })
                .catch(err => {
                    console.error("Error", err);
                    vm.selectPhoto = false;
                });
        };

        //save profile data
        vm.saveProfile = () => {

            if (vm.editProfile) {
                ProfileService.SetProfile(vm.editProfile);
            }
        };

        //reset profile - resets all changes made before saving
        vm.resetProfile = () => {
            vm.editProfile = {}; //reset profile
            vm.photoEdited = false;
            vm.editFlag = false;
        };



    }

    //inject needed services
    profileComponentController.$inject = ["ProfileService"];

    //register component
    app.component("profile", {
        controller: profileComponentController,
        controllerAs: "vm",
        templateUrl: "/scripts/templates/profile/profile.component.html"
    });

}

module.exports = profileComponentModule;