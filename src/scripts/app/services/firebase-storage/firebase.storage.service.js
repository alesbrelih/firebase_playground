// ----- FIREBASE STORAGE SERVICE ---- //
function firebaseStorageModule(app){

    //controller for module
    function firebaseStorageController(Firebase,Auth,$rootScope,UploadStatus){
        //returned factory
        const firebaseStorageFactory = {};

        //privates
        const firebaseUserUid = Auth.$getAuth().uid;
        const firebaseStorageRef = Firebase.storage().ref();

        //publics

        //upload profile photo to storage
        firebaseStorageFactory.UploadProfilePhoto = photo =>{

            return firebaseStorageRef.child(`profile-photos/${firebaseUserUid}/${photo.name}`)
                .put(photo).then(function(snapshot) {
                    $rootScope.$broadcast(UploadStatus.success);

                    console.log("Uploaded a blob or file!",snapshot);

                });
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