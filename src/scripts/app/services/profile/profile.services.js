function profileServicesModule(app){

    function profileServiceController($firebaseRef,$firebaseObject,$firebaseArray,Auth,$state,MainState,FirebaseStorage,$q,toastr){

        //profile object
        let profileObject = {};

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
            profileObject = $firebaseObject($firebaseRef.profiles.child(p_uid));

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
                        profilePhotos.$save(photoDbEntry).then(()=>{
                            toastr.success("Profile photo successfully saved.","success");
                        });

                    }
                    else{
                        //save downloadUrl to db and photo with same name wasnt already uploaded
                        profilePhotos
                            .$add({
                                name:photo.name,
                                url:snap.downloadURL
                            })
                            .then( () =>{
                                toastr.success("Profile photo successfully saved.","success");
                                //console.log("Added photo ref to db",ref);
                            });
                    }


                })
                .catch(err => {
                    console.error("Error: ",err);
                });
        };

        //remove profilephoto
        profileFactory.RemoveProfilePhoto = photo =>{

            //removes photo from storage
            FirebaseStorage.RemoveProfilePhoto(photo,p_uid)
                .then(()=>{
                    //if removed from storage successfully

                    //get ref in db
                    var photoDb = profilePhotos
                        .filter(item => {
                            return item.name == photo.name;
                        });

                    //if ref found
                    if(photoDb.length == 1){
                        //remove from
                        profilePhotos.$remove(photoDb[0])
                            .then( () =>{
                                toastr.success("Profile photo successfully removed.","success");
                                //console.log("Profile photo removed.");
                            });
                    }


                }).catch(err=>{
                    console.error("Error",err);
                });
        };

        //edit profileInfo
        profileFactory.SetProfile = profile => {

            //all changed data need to be set
            for(let prop in profile){
                profileObject[prop] = profile[prop];
            }

            profileObject.$save().then(function(success){
                //console.log(success);
                toastr.success("Profile successfully updated.","success");

                if($state.current.name == "main.profile"){
                    $state.go($state.current, {}, {reload: true});

                }
            });

        };

        // register with email pwd
        profileFactory.RegisterWithEmailAndPwd = (email,pwd) => {

            //registers using firebase register with email and pwd
            return Auth.$createUserWithEmailAndPassword(email, pwd)
                .then(firebaseUser => {
                    console.log(firebaseUser);
                    profileFactory.GetProfile(firebaseUser.uid);
                    toastr.success("Account created.","success");
                    $state.go(MainState);
                }, err => {
                    //console.log(err);
                    toastr.error(err.data,"error");
                });

        };

        profileFactory.SignInWithEmailAndPwd = (email,pwd) => {

            //signs in using firebase auth
            return Auth.$signInWithEmailAndPassword(email,pwd)
                .then(firebaseUser => {
                    toastr.success("Login successful.","success");
                    profileFactory.GetProfile(firebaseUser.uid);
                    $state.go(MainState);

                },
                err => {
                    //console.log(err);
                    toastr.error(err.data,"error");
                });

        };


        //catch user loging in
        Auth.$onAuthStateChanged(function(firebaseUser) {

            if(firebaseUser){ //user logged
                //set profile
                profileFactory.GetProfile(firebaseUser.uid);
            }
            else{ //user was logged
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
    profileServiceController.$inject = ["$firebaseRef","$firebaseObject","$firebaseArray","Auth","$state","MainState","FirebaseStorage","$q","toastr"];

    app.factory("ProfileService",profileServiceController);


}

module.exports = profileServicesModule;