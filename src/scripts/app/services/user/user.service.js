// ----- User service module ---- //
function userServiceModule(app){

    function userServiceController($firebaseRef){
        //returned user factory
        const userFactory = {};

        userFactory.GetProfile = (id) => {
            $firebaseRef.profiles.child(id)
                .once("value").then(snap=>{
                    return snap.val();
                }).catch(err=>console.log(err));
        };

        return userFactory;

    }
    userServiceController.$inject = ["$firebaseRef"];

    app.factory("UserService",userServiceController);


}

module.exports = userServiceModule;