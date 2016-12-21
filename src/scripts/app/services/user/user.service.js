// ----- User service module ---- //
function userServiceModule(app){

    function userServiceController($firebaseRef){
        //returned user factory
        const userFactory = {};

        userFactory.GetProfile = (id) => {
            return $firebaseRef.profiles.child(id)
                .once("value");
        };

        return userFactory;

    }
    userServiceController.$inject = ["$firebaseRef"];

    app.factory("UserService",userServiceController);


}

module.exports = userServiceModule;