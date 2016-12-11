// ----- FIREBASE STORAGE SERVICE ---- //
function firebaseStorageModule(app){

    //controller for module
    function firebaseStorageController(Firebase,Auth,$rootScope,UploadStatus){
        //returned factory
        const firebaseStorageFactory = {};

        //privates
        const firebaseStorageRef = Firebase.storage().ref();

        //publics

        //upload profile photo to storage
        firebaseStorageFactory.UploadProfilePhoto = (photo,uid) =>{


            return firebaseStorageRef.child(`profile-photos/${uid}/${photo.name}`)
                .put(photo).then(function(snapshot) {
                    $rootScope.$broadcast(UploadStatus.success);
                    return snapshot;
                });
        };

        //remove profile photo from storage
        firebaseStorageFactory.RemoveProfilePhoto = (photo,uid) =>{
            // Create a reference to the file to delete
            var removeRef = firebaseStorageRef.child(`profile-photos/${uid}/${photo.name}`);

            // Delete the file
            return removeRef.delete();
        };


        return firebaseStorageFactory;
    }
    //inject service
    firebaseStorageController.$inject = ["Firebase","Auth","$rootScope","UploadStatus"];

    //register factory
    app.factory("FirebaseStorage",firebaseStorageController);
}

// exports module
module.exports = firebaseStorageModule;