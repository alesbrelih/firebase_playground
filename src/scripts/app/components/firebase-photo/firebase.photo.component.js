// --- firebase photo component module ---- //
function firebasePhotoComponentModule(app){

    //controller
    function firebasePhotoComponentController(FirebaseStorage,$rootScope,UploadStatus,$scope){
        const vm = this;

        //set event catcher
        $rootScope.$on(UploadStatus.success,function(){
            $scope.$apply(function(){
                vm.Photo = null;
                vm.previewSrc = null;
            });

        });
        


        FirebaseStorage.GetProfilePhotos();

        //upload photo
        vm.UploadPhoto = ()=>{
            if(vm.Photo != null){
                FirebaseStorage.UploadProfilePhoto(vm.Photo);

            }
        };



    }
    firebasePhotoComponentController.$inject = ["FirebaseStorage","$rootScope","UploadStatus","$scope"];

    //register component
    app.component("firebasePhoto",{
        controller:firebasePhotoComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/firebase-photo/firebase.photo.component.html"
    });

}


//export firebasephoto component module
module.exports = firebasePhotoComponentModule;


