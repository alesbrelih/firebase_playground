////////////////////////////////////////
// ----- Firebase Config Module ----- //
///////////////////////////////////////

function firebaseConfigModule(firebase){

    //firebase cfg
    const config = {
        apiKey: "AIzaSyC0G_puVkQgwqL1wICl4TuQigccVJ2u7xw",
        authDomain: "scakapo-2f1c6.firebaseapp.com",
        databaseURL: "https://scakapo-2f1c6.firebaseio.com",
        storageBucket: "scakapo-2f1c6.appspot.com",
        messagingSenderId: "656327460988"
    };

    //init firebase app
    firebase.initializeApp(config);
}

//export config module
module.exports = firebaseConfigModule;