///////////////////////////////////////////////
// ----- Configures Angular Application ---- //
///////////////////////////////////////////////

function appConfigModule(app,firebase){

    //initialize firebase
    require("../firebase/firebase.config")(firebase);

    // function that will configure app
    function appConfigFunction($firebaseRefProvider){
        $firebaseRefProvider.registerUrl({
            default:"https://scakapo-2f1c6.firebaseio.com"
        });
    }

    //inject firebase ref provider to make app testable
    appConfigFunction.$inject = ["$firebaseRefProvider"];

    //app configuration
    app.config(appConfigFunction);

}

//export config module
module.exports = appConfigModule;