// --- firebase photo component module ---- //
function firebasePhotoComponentModule(app){

    //controller
    function firebasePhotoComponentController(ProfileService,$rootScope,UploadStatus,$scope){
        const vm = this;

        vm.uploading = false;

        vm.profilePhotos = ProfileService.ReturnProfilePhotos();

        //set event catcher
        $rootScope.$on(UploadStatus.success,function(){
            $scope.$apply(function(){
                vm.Photo = null;
                vm.previewSrc = null;
                vm.uploading = false;
            });

        });



        //FirebaseStorage.GetProfilePhotos();

        //upload photo
        vm.UploadPhoto = ()=>{
            if(vm.Photo != null){
                vm.uploading = true;
                ProfileService.UploadProfilePhoto(vm.Photo);
            }
        };

        //select photo
        vm.SelectPhoto = photo =>{
            if(photo){
                ProfileService.ResolveProfilePhotoSelect(photo);
            }
        };

        //remove photo
        vm.RemovePhoto = (photo) =>{
            if(photo != null){
                ProfileService.RemoveProfilePhoto(photo);
            }
        };

        //close window
        vm.CloseWindow = ()=>{
            ProfileService.RejectProfilePhotoSelect();
        };



    }
    firebasePhotoComponentController.$inject = ["ProfileService","$rootScope","UploadStatus","$scope"];

    //register component
    app.component("firebasePhoto",{
        controller:firebasePhotoComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/firebase-photo/firebase.photo.component.html"
    });

}


//export firebasephoto component module
module.exports = firebasePhotoComponentModule;


