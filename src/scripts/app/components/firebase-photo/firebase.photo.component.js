// --- firebase photo component module ---- //
function firebasePhotoComponentModule(app){

    //controller
    function firebasePhotoComponentController(){
        const vm = this;

        //upload photo
        vm.UploadPhoto = ()=>{
            if(vm.Photo != null){
                //check if photo really isnt null

                //TODO: FIREBASESTUFF WITH vm.Photo
            }

        };


    }

    //register component
    app.component("firebasePhoto",{
        controller:firebasePhotoComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/firebase-photo/firebase.photo.component.html"
    });

}

//export firebasephoto component module
module.exports = firebasePhotoComponentModule;