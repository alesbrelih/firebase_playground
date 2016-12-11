function profileServicesModule(app){

    function profileServiceController($firebaseRef,$firebaseObject,$firebaseArray,Auth,$state,MainState,FirebaseStorage,$q){

        //profile object
        let profileObject = null;

        //profile photos
        let profilePhotos = null;

        //profile uid
        let p_uid = null;

        //promise for profile photo select
        let promisePhotoSelect = null;

        //function that sets ref to profilePhotos
        function getProfilePhotos(){
            profilePhotos = $firebaseArray($firebaseRef.profilePhotos.child(p_uid));

        }


        //returned profile factory
        const profileFactory = {};



        //gets profileInfo
        profileFactory.GetProfile = uid=>{

            //set puid
            p_uid = uid;

            //sets profile object data
            profileObject = $firebaseObject;

            //gets profile photos
            getProfilePhotos();
        };

        //uploads new profilePhoto
        profileFactory.UploadProfilePhoto = photo =>{

            //calls storage service
            FirebaseStorage.UploadProfilePhoto(photo,p_uid)
                .then(snap => {


                    //get if entry with same filename was added
                    const entryId = profilePhotos.filter(item => {
                        return item.name == photo.name;
                    }).map(item=>{
                        return item.$id;
                    });

                    //photo with same name was already saved
                    if (entryId.length == 1)
                    {
                        let photoDbEntry = profilePhotos.$getRecord(entryId[0]);
                        photoDbEntry.url = snap.downloadURL;
                        profilePhotos.$save(photoDbEntry);

                    }
                    else{
                        //save downloadUrl to db and photo with same name wasnt already uploaded
                        profilePhotos
                            .$add({
                                name:photo.name,
                                url:snap.downloadURL
                            })
                            .then(ref=>{
                                console.log("Added photo ref to db",ref);
                            });
                    }


                })
                .catch(err => {
                    console.error("Error: ",err);
                });
        };

        //remove profilephoto
        profileFactory.RemoveProfilePhoto = photo =>{

            FirebaseStorage.RemoveProfilePhoto(photo,p_uid)
                .then(()=>{
                    var photoDb = profilePhotos
                        .filter(item => {
                            return item.name == photo.name;
                        });
                    console.log(photoDb);
                    if(photoDb.length == 1){
                        profilePhotos.$remove(photoDb[0])
                            .then( () =>{
                                console.log("Profile photo removed.");
                            });
                    }


                }).catch(err=>{
                    console.error("Error",err);
                });
        };

        //edit profileInfo
        profileFactory.SetProfile = profile => {
            profileDbRef.child(profileObject.uid).set({
                name: profile.name,
                lastname:profile.surname,
                username:profile.username
            });
        };

        // register with email pwd
        profileFactory.RegisterWithEmailAndPwd = (email,pwd) => {

            //registers using firebase register with email and pwd
            return Auth.$createUserWithEmailAndPassword(email, pwd)
                .then(firebaseUser => {
                    profileFactory.GetProfile(firebaseUser.uid);
                    $state.go(MainState);
                }, err => {
                    console.log(err);
                });

        };

        profileFactory.SignInWithEmailAndPwd = (email,pwd) => {

            //signs in using firebase auth
            return Auth.$signInWithEmailAndPassword(email,pwd)
                .then(firebaseUser => {

                    profileFactory.GetProfile(firebaseUser.uid);
                    $state.go(MainState);

                },
                err => {
                    console.log(err);
                });

        };


        //catch user loging in
        Auth.$onAuthStateChanged(function(firebaseUser) {

            if(firebaseUser){ //user logged
                //set profile
                console.log("firebaseUserFound",firebaseUser);
                profileFactory.GetProfile(firebaseUser.uid);
            }
            else{ //user was logged
                console.log("firebaseUserNOTFound",firebaseUser);
                $state.go("auth.login");
            }


        });

        //signs out profile
        profileFactory.SignOut = () => {

            //sign out user
            Auth.$signOut();

        };

        //return profileInfo
        profileFactory.ReturnProfile = ()=>{

            return profileObject;

        };

        //return profilePhotos
        profileFactory.ReturnProfilePhotos = ()=>{
            return profilePhotos;
        };

        ////////////////////////////////////////////////////////////////////////
        // --------- PROMISE METHODS FOR PROFILE PHOTO SELECTION OPEN ------ ///
        ////////////////////////////////////////////////////////////////////////
        
        //opens profile photo selection
        profileFactory.OpenProfilePhotoSelect = ()=>{
            promisePhotoSelect = $q.defer();
            return promisePhotoSelect.promise;
        };

        //reject promise
        profileFactory.RejectProfilePhotoSelect = ()=>{
            promisePhotoSelect.reject();
        };

        //resolve promise
        profileFactory.ResolveProfilePhotoSelect = photo => {
            promisePhotoSelect.resolve(photo.url);
        };

        //return factory
        return profileFactory;


    }
    profileServiceController.$inject = ["$firebaseRef","$firebaseObject","$firebaseArray","Auth","$state","MainState","FirebaseStorage","$q"];

    app.factory("ProfileService",profileServiceController);


}

module.exports = profileServicesModule;