///////////////////////////////////////////////
// --- Register all components module ------///
//////////////////////////////////////////////

function registerAllComponentsModule(app){

    /////////////////////////////////
    // -----  Auth components ---- //
    ////////////////////////////////

    // main

    const authMain = require("./auth/auth.main.component");
    authMain(app);

    //login
    const authLogin = require("./auth/auth.login.component");
    authLogin(app);

    //register
    const authRegister = require("./auth/auth.register.component");
    authRegister(app);

    ////////////////////////////////////
    // ------------------------------ //
    ////////////////////////////////////

    ///////////////////////////////////
    // ------- Main Components ------//
    ///////////////////////////////////

    //main "wrapper
    const mainComponent = require("./main/main.component");
    mainComponent(app);

    //profile component
    const profileComponent = require("./profile/profile.component");
    profileComponent(app);


    //////////////////////////////////
    // ------ Helper components ----//
    //////////////////////////////////

    //firebase photo select/upload for profile photo
    const firebasePhotoComponent = require("./firebase-photo/firebase.photo.component");
    firebasePhotoComponent(app);

    //spinner component
    const spinnerComponent = require("./spinner/spinner.component");
    spinnerComponent(app);



}

module.exports = registerAllComponentsModule;