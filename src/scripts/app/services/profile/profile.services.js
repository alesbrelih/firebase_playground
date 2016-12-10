function profileServicesModule(app){

    function profileServiceController($firebaseRef,$firebaseArray,Auth,$state){

        //profile object
        let profileObject = null;

        //returned profile factory
        const profileFactory = {};

        //profile db ref
        const profileDbRef = $firebaseArray($firebaseRef.profiles);

        //gets profileInfo
        profileFactory.GetProfile = uid=>{

            //sets profile object data
            profileObject = profileDbRef.$getRecord(uid);

        };

        //sets profileInfo
        profileFactory.CreateProfile = profile =>{
            profileDbRef.child(profileObject.uid).set({
                name:profile.name,
                surname:profile.surname,
                username:profile.username
            });
        };

        //edit profileInfo
        profileFactory.EditProfile = profile => {
            profileDbRef.child(profileObject.uid).set({
                name: profile.name,
                surname:profile.surname,
                username:profile.username
            });
        };

        // register with email pwd
        profileFactory.RegisterWithEmailAndPwd = (email,pwd) => {

            //registers using firebase register with email and pwd
            return Auth.$createUserWithEmailAndPassword(email, pwd)
                .then(firebaseUser => {
                    console.log("User " + firebaseUser.uid + " created successfully!");
                }, err => {
                    console.log(err);
                });

        };

        profileFactory.SignInWithEmailAndPwd = (email,pwd) => {

            console.log("login in");
            //signs in using firebase auth
            return Auth.$signInWithEmailAndPassword(email,pwd)
                .then(firebaseUser => {

                    console.log(firebaseUser);
                    $state.go("main");

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

        //return factory
        return profileFactory;


    }
    profileServiceController.$inject = ["$firebaseRef","$firebaseArray","Auth","$state"];

    app.factory("ProfileService",profileServiceController);


}

module.exports = profileServicesModule;