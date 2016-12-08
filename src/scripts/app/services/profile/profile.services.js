function profileServicesModule(app){

    function profileServiceController($firebaseRef,$firebaseObject){

        const profileRef = $firebaseObject($firebaseRef.profiles);


        

    }
    profileServiceController.$inject = ["$firebaseRef","$firebaseObject"];


}

module.exports = profileServicesModule;